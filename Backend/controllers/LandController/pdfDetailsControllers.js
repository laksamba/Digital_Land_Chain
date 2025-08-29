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

  // 2️⃣ Blockchain: current owner, full land hash & ownership history
  let currentOwner, landHash, ownershipHistory;
  try {
    const landData = await contract.getLand(landId);
    console.log("Raw getLand output:", landData); // Debug log
    [currentOwner, , landHash] = landData; // Destructure, skip isActive
    ownershipHistory = await contract.getOwnershipHistory(landId);

    // Validate landHash
    if (!landHash || typeof landHash !== "string" || landHash.trim() === "") {
      console.warn(`Invalid land hash for landId ${landId}: ${landHash}`);
      landHash = "N/A"; // Fallback to avoid breaking PDF generation
    }
  } catch (error) {
    console.error(`Error fetching blockchain data for landId ${landId}:`, error);
    currentOwner = "N/A";
    landHash = "N/A";
    ownershipHistory = [];
  }

  return { land, currentOwner, landHash, ownershipHistory };
}

// Generate PDF
async function generatePDF(data) {
  return new Promise((resolve, reject) => {

    const doc = new PDFDocument({
      margin: 30,
      size: 'A4',
      info: {
        Title: `Land Ownership Certificate - ${data.land.landId}`,
        Author: 'Digital Land Chain Authority',
        Subject: 'Official Land Ownership Document',
        Creator: 'Digital Land Chain System',
        CreationDate: new Date(),
      },
    });

    const pdfsDir = path.resolve('./pdfs');
    const fileName = `ownership_${data.land.landId}.pdf`;
    const filePath = path.join(pdfsDir, fileName);

    // Create ./pdfs directory if it doesn't exist
    try {
      if (!fs.existsSync(pdfsDir)) {
        fs.mkdirSync(pdfsDir, { recursive: true });
      }
    } catch (error) {
      console.error('Failed to create pdfs directory:', error);
      reject(new Error('Could not create directory for PDF storage'));
      return;
    }

    // Create write stream and handle errors
    const writeStream = fs.createWriteStream(filePath);
    writeStream.on('error', (error) => {
      console.error('Error writing PDF file:', error);
      reject(new Error('Failed to write PDF file'));
    });
    writeStream.on('finish', () => {
      resolve(filePath);
    });

    doc.pipe(writeStream);

    // Fonts
    doc.registerFont('Bold', 'Times-Bold');
    doc.registerFont('Regular', 'Times-Roman');
    doc.registerFont('Italic', 'Times-Italic');

    // Page Border
    doc
      .rect(15, 15, 565, 812)
      .lineWidth(2.5)
      .strokeColor('#1A3C6B')
      .stroke();

    // Header Section
    doc
      .rect(15, 15, 565, 110)
      .fillColor('#F5F6F5')
      .fill()
      .rect(15, 15, 565, 110)
      .lineWidth(1)
      .strokeColor('#1A3C6B')
      .stroke();

    doc
      .font('Bold')
      .fontSize(28)
      .fillColor('#1A3C6B')
      .text('Land Ownership Certificate', 0, 30, { align: 'center' });
    doc
      .font('Regular')
      .fontSize(14)
      .fillColor('#333333')
      .text('Digital Land Chain Authority', 0, 65, { align: 'center' });
    doc
      .font('Italic')
      .fontSize(10)
      .fillColor('#666666')
      .text('Ministry of Land Management and Blockchain Registry', 0, 85, { align: 'center' });

    // Official Seal Placeholder (Text-based for simplicity)
    doc
      .circle(520, 50, 30)
      .lineWidth(1)
      .strokeColor('#1A3C6B')
      .stroke();
    doc
      .font('Bold')
      .fontSize(8)
      .fillColor('#1A3C6B')
      .text('Official Seal', 505, 45, { align: 'center' });

    // Certificate Metadata
    const certificateNumber = `DLC-${data.land.landId}-${Date.now()}`;
    const issueDate = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    const validUntil = new Date(new Date().setFullYear(new Date().getFullYear() + 5)).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    doc
      .font('Regular')
      .fontSize(10)
      .fillColor('#333333')
      .text(`Certificate No.: ${certificateNumber}`, 30, 130)
      .text(`Issue Date: ${issueDate}`, 30, 145)
      .text(`Valid Until: ${validUntil}`, 30, 160);
    doc.moveDown(2);

    // Watermark
    doc
      .font('Italic')
      .fontSize(50)
      .fillColor('#D3D3D3')
      .opacity(0.2)
      .rotate(-45, { origin: [297.5, 420.5] })
      .text('OFFICIAL DOCUMENT', 100, 350, { align: 'center' })
      .rotate(45, { origin: [297.5, 420.5] })
      .opacity(1)
      .fillColor('#333333');

    // Land Details Section
    doc
      .font('Bold')
      .fontSize(16)
      .fillColor('#1A3C6B')
      .text('Land Property Details', 30, 190, { underline: true });
    doc
      .font('Regular')
      .fontSize(11)
      .fillColor('#333333')
      .text(`Land ID: ${data.land.landId || 'N/A'}`, 40, 215)
      .text(`Area: ${data.land.area ? `${data.land.area} square meters` : 'N/A'}`, 40, 230)
      .text(`Status: ${data.land.status || 'N/A'}`, 40, 245)
      .text(`Location: ${data.land.location || 'N/A'}`, 40, 260)
      .text(`Coordinates: ${data.land.coordinates || 'N/A'}`, 40, 275);
    doc.moveDown(2);

    // Owner Details Section
    const owner = data.land.owner || {};
    doc
      .font('Bold')
      .fontSize(16)
      .fillColor('#1A3C6B')
      .text('Registered Owner', 30, 305, { underline: true });
    doc
      .font('Regular')
      .fontSize(11)
      .fillColor('#333333')
      .text(`Name: ${owner.name || 'N/A'}`, 40, 330)
      .text(`Full Name (English): ${owner.kyc?.fullName?.english || 'N/A'}`, 40, 345)
      .text(`Citizenship No.: ${owner.kyc?.citizenshipNumber || 'N/A'}`, 40, 360)
      .text(`Email: ${owner.email || 'N/A'}`, 40, 375)
      .text(`Wallet Address: ${owner.walletAddress || 'N/A'}`, 40, 390);
    doc.moveDown(2);

    // Blockchain Verification Section
    doc
      .font('Bold')
      .fontSize(16)
      .fillColor('#1A3C6B')
      .text('Blockchain Authentication', 30, 420, { underline: true });
    doc
      .font('Regular')
      .fontSize(11)
      .fillColor('#333333')
      .text(`Current Owner(On-Chain) : ${data.currentOwner || 'N/A'}`, 40, 445)
      .text('Land Hash :', 40, 460);
    doc
      .font('Regular')
      .fontSize(9)
      .text(data.landHash || 'N/A', 50, 475, { width: 500, lineBreak: true });
    doc
      .font('Regular')
      .fontSize(11)
      .text('Ownership History (On-Chain):', 40, 500);
    doc
      .font('Regular')
      .fontSize(9)
      .text(
        data.ownershipHistory?.length > 0 ? data.ownershipHistory.join(', ') : 'N/A',
        50,
        515,
        { width: 500, lineBreak: true }
      );
    doc.moveDown(2);

    // Certification Statement
    doc
      .font('Italic')
      .fontSize(10)
      .fillColor('#333333')
      .text(
        'This is to certify that the above particulars are true and correct as per the records maintained by the Digital Land Chain Authority. This certificate is issued under the authority of the Ministry of Land Management and Blockchain Registry.',
        30,
        550,
        { width: 535, align: 'justify' }
      );

    // Signature Section
    doc
      .font('Bold')
      .fontSize(12)
      .fillColor('#1A3C6B')
      .text('Authorized Signatory', 30, 620, { underline: true });
    doc
      .font('Regular')
      .fontSize(10)
      .fillColor('#333333')
      // .text('Name: ___________________________', 30, 645)
      .text('Designation: Registrar, Digital Land Chain Authority', 30, 660)
      .text('Date: ' + issueDate, 30, 675);

    // Footer
    doc
      .rect(15, 750, 565, 77)
      .fillColor('#F5F6F5')
      .fill()
      .rect(15, 750, 565, 77)
      .lineWidth(1)
      .strokeColor('#1A3C6B')
      .stroke();
    doc
      .font('Italic')
      .fontSize(9)
      .fillColor('#666666')
      .text(
        'This certificate is an official document issued by the Digital Land Chain Authority under the Ministry of Land Management and Blockchain Registry. Unauthorized reproduction or alteration is strictly prohibited.',
        30,
        765,
        { align: 'center', width: 535 }
      );

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