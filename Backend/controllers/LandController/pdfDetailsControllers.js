import Land from "../../models/Land.js";
import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";
import { ethers } from "ethers";
import { contract } from "../../utils/Blockchain.js";

// Fetch data from DB + Blockchain
async function getLandOwnershipData(landId) {
  // 1️⃣ DB: land + owner info
  const land = await Land.findOne({ landId }).populate("owner");
  if (!land) throw new Error("Land not found");

  // 2️⃣ Blockchain: current owner & ownership history
  const [currentOwner] = await contract.getLand(landId);
  const ownershipHistory = await contract.getOwnershipHistory(landId);

  return { land, currentOwner, ownershipHistory };
}

// Generate PDF
async function generatePDF(data) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      margin: 40,
      size: "A4",
      info: {
        Title: `Land Ownership Certificate - ${data.land.landId}`,
        Author: "Digital Land Chain",
        CreationDate: new Date(),
      },
    });

    const pdfsDir = path.resolve("./pdfs");
    const fileName = `ownership_${data.land.landId}.pdf`;
    const filePath = path.join(pdfsDir, fileName);

    // Create ./pdfs directory if it doesn't exist
    try {
      if (!fs.existsSync(pdfsDir)) {
        fs.mkdirSync(pdfsDir, { recursive: true });
      }
    } catch (error) {
      console.error("Failed to create pdfs directory:", error);
      reject(new Error("Could not create directory for PDF storage"));
      return;
    }

    // Create write stream and handle errors
    const writeStream = fs.createWriteStream(filePath);
    writeStream.on("error", (error) => {
      console.error("Error writing PDF file:", error);
      reject(new Error("Failed to write PDF file"));
    });
    writeStream.on("finish", () => {
      resolve(filePath);
    });

    doc.pipe(writeStream);

    // Fonts
    doc.registerFont("Bold", "Helvetica-Bold");
    doc.registerFont("Regular", "Helvetica");
    doc.registerFont("Italic", "Helvetica-Oblique");

    // Header
    doc
      .rect(30, 30, 535, 80)
      .lineWidth(1)
      .strokeColor("#003087")
      .stroke();
    doc
      .font("Bold")
      .fontSize(24)
      .fillColor("#FF0000")
      .text("Land Ownership Certificate", 0, 50, { align: "center" });
    doc
      .font("Regular")
      .fontSize(12)
      .fillColor("#333333")
      .text("Digital Land Chain Authority", 0, 80, { align: "center" });
    doc.moveDown(2);

    // Certificate Number and Issue Date
    const certificateNumber = `DLC-${data.land.landId}-${Date.now()}`;
    const issueDate = new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    doc
      .font("Regular")
      .fontSize(10)
      .fillColor("#666666")
      .text(`Certificate No: ${certificateNumber}`, 40, 120)
      .text(`Issue Date: ${issueDate}`, 40, 135);
    doc.moveDown(2);

    // Watermark
    doc
      .font("Italic")
      .fontSize(40)
      .fillColor("#E6E6E6")
      .opacity(0.3)
      .rotate(-45, { origin: [300, 400] })
      .text("OFFICIAL CERTIFICATE", 150, 350, { align: "center" })
      .rotate(45, { origin: [300, 400] })
      .opacity(1)
      .fillColor("#333333");

    // Land Details Section
    doc
      .font("Bold")
      .fontSize(16)
      .fillColor("#FF0000")
      .text("Land Details", 40, 170, { underline: true });
    doc
      .font("Regular")
      .fontSize(12)
      .fillColor("#333333")
      .text(`Land ID: ${data.land.landId || "N/A"}`, 40, 195)
      .text(`Area: ${data.land.area ? `${data.land.area} sq.m` : "N/A"}`, 40, 210)
      .text(`Status: ${data.land.status || "N/A"}`, 40, 225)
      .text(`Location: ${data.land.location || "N/A"}`, 40, 240);
    doc.moveDown(2);

    // Owner Details Section
    const owner = data.land.owner || {};
    doc
      .font("Bold")
      .fontSize(16)
      .fillColor("#FF0000")
      .text("Owner Details", 40, 270, { underline: true });
    doc
      .font("Regular")
      .fontSize(12)
      .fillColor("#333333")
      .text(`Name: ${owner.name || "N/A"}`, 40, 295)
      .text(`Email: ${owner.email || "N/A"}`, 40, 310)
      .text(`Wallet Address: ${owner.walletAddress || "N/A"}`, 40, 325)
      .text(`Full Name (English): ${owner.kyc?.fullName?.english || "N/A"}`, 40, 340)
      .text(`Citizenship Number: ${owner.kyc?.citizenshipNumber || "N/A"}`, 40, 370);
    doc.moveDown(2);

    // Blockchain Ownership Section
    doc
      .font("Bold")
      .fontSize(16)
      .fillColor("#FF0000")
      .text("Blockchain Verification", 40, 400, { underline: true });
    doc
      .font("Regular")
      .fontSize(12)
      .fillColor("#333333")
      .text(`Current Owner (on-chain): ${data.currentOwner || "N/A"}`, 40, 425);
    doc
      .font("Regular")
      .fontSize(12)
      .text("Ownership History (on-chain):", 40, 440);
    doc
      .font("Regular")
      .fontSize(10)
      .text(
        data.ownershipHistory?.length > 0 ? data.ownershipHistory.join(", ") : "N/A",
        50,
        455,
        { width: 500, lineBreak: true }
      );
    doc.moveDown(2);

    // Footer
    doc
      .rect(30, 720, 535, 60)
      .lineWidth(1)
      .strokeColor("#003087")
      .stroke();
    doc
      .font("Italic")
      .fontSize(10)
      .fillColor("#666666")
      .text(
        "This certificate is issued by the Digital Land Chain Authority and verified on the blockchain.",
        0,
        740,
        { align: "center" }
      );

    // Border for entire page
    doc
      .rect(20, 20, 555, 802)
      .lineWidth(2)
      .strokeColor("#003087")
      .stroke();

    doc.end();
  });
}



// Controller
export const generateOwnershipPDFController = async (req, res) => {
  try {
    const { landId } = req.params;
    console.log("Generating PDF for landId:", landId); // Debug
    const data = await getLandOwnershipData(landId);
    const pdfPath = await generatePDF(data); // Await PDF generation
    res.download(pdfPath, `ownership_${landId}.pdf`, (err) => {
      if (err) {
        console.error("Error sending PDF:", err);
        res.status(500).json({ message: "Failed to send PDF file" });
      }
      // Clean up the PDF file after download
      fs.unlink(pdfPath, (unlinkErr) => {
        if (unlinkErr) console.error("Failed to delete PDF file:", unlinkErr);
      });
    });
  } catch (error) {
    console.error("Error in generateOwnershipPDFController:", error);
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};