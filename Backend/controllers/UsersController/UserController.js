import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../../models/User.js";
import cloudinary from "../../config/cloudinary.js";
import { Readable } from "stream";

// Register a new user and redirect to KYC
export const registerUser = async (req, res, next) => {
  try {
    const { name, email, role, password, walletAddress } = req.body;

    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ error: "Email already registered" });
    }

    user = await User.findOne({ walletAddress });
    if (user) {
      return res
        .status(400)
        .json({ error: "Wallet address already registered" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    user = new User({
      name,
      email,
      password: hashedPassword,
      role,
      walletAddress,
    });

    await user.save();

    // Generate JWT for immediate KYC redirection
    const payload = { userId: user._id, role: user.role };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.status(201).json({
      message: "User registered successfully. Redirect to KYC form.",
      token,
      redirect: "/kyc", // Frontend route for KYC form
    });
  } catch (error) {
    next(error);
  }
};

// Submit KYC details
const uploadToCloudinary = (buffer, folder) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (error) reject(error);
        else resolve(result.secure_url);
      }
    );
    Readable.from(buffer).pipe(stream);
  });
};

export const submitKyc = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (user.kyc && user.kyc.verificationStatus !== "Rejected") {
      return res
        .status(400)
        .json({ error: "KYC already submitted or verified" });
    }

    const {
      "fullName.english": fullNameEnglish,
      "fullName.nepali": fullNameNepali,
      documentType,
      "dateOfBirth.bs": dateOfBirthBs,
      "dateOfBirth.ad": dateOfBirthAd,
      citizenshipNumber,
      citizenshipIssuedDistrict,
      "citizenshipIssuedDate.bs": issuedDateBs,
      "citizenshipIssuedDate.ad": issuedDateAd,
    } = req.body;

    // Validate date strings
    const dobAd = new Date(dateOfBirthAd);
    const issuedAd = new Date(issuedDateAd);

    if (isNaN(dobAd.getTime()) || isNaN(issuedAd.getTime())) {
      return res.status(400).json({ error: "Invalid AD date format provided" });
    }

    const existingKyc = await User.findOne({
      "kyc.citizenshipNumber": citizenshipNumber,
    });
    if (existingKyc && existingKyc._id.toString() !== user._id.toString()) {
      return res
        .status(400)
        .json({ error: "Citizenship number already registered" });
    }

    const fullName = {
      english: fullNameEnglish,
      nepali: fullNameNepali,
    };

    // Upload photo
    const photoFile = req.files["photo"]?.[0];
    const photoUrl = photoFile
      ? await uploadToCloudinary(photoFile.buffer, "kyc/photos")
      : null;

    // Upload documents
    const documents = req.files["documents"] || [];
    const documentTypes = req.body.documentsType;
    const documentUrls = [];

    for (let i = 0; i < documents.length; i++) {
      const url = await uploadToCloudinary(
        documents[i].buffer,
        "kyc/documents"
      );
      documentUrls.push({
        type: Array.isArray(documentTypes) ? documentTypes[i] : documentTypes,
        url,
      });
    }

    user.kyc = {
      fullName,
      documentType,
      dateOfBirth: {
        bs: dateOfBirthBs,
        ad: dobAd,
      },
      citizenshipNumber,
      citizenshipIssuedDistrict,
      citizenshipIssuedDate: {
        bs: issuedDateBs,
        ad: issuedAd,
      },
      photo: photoUrl,
      documents: documentUrls,
      verificationStatus: "Pending",
      verified: false,
      createdAt: Date.now(),
    };

    await user.save();

    res
      .status(200)
      .json({ message: "KYC submitted successfully. Awaiting verification." });
  } catch (error) {
    next(error);
  }
};



// Verify KYC by Land Officer
export const verifyKyc = async (req, res, next) => {
  try {
    const { userId, status, verified } = req.body;

    if (!["Verified", "Rejected"].includes(status)) {
      return res
        .status(400)
        .json({ error: "Invalid status. Must be Verified or Rejected." });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (!user.kyc || user.kyc.verificationStatus !== "Pending") {
      return res
        .status(400)
        .json({ error: "KYC not pending or already processed" });
    }

    user.kyc.verificationStatus = status;
    user.kyc.verified = verified && status === "Verified";
    if (user.kyc.verified) {
      user.kyc.verifiedAt = Date.now();
    }

    await user.save();

    res
      .status(200)
      .json({ message: `KYC ${status.toLowerCase()} successfully` });
  } catch (error) {
    next(error);
  }
};

// Login user with KYC verification check
export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Check KYC status
if (user.role !== "admin" && user.role !== "land_officer") {
  if (
    !user.kyc ||
    user.kyc.verificationStatus !== "Verified" ||
    !user.kyc.verified
  ) {
    return res.status(403).json({ error: "KYC not completed or verified" });
  }
}


    // Generate JWT
   const payload = {
  userId: user._id.toString(), 
  role: user.role,
  walletAddress: user.walletAddress,
  kycStatus: user.kyc?.verificationStatus || "pending",
};

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        role: user.role,
        email: user.email,
        kycStatus: user.kyc?.verificationStatus,
      },
    });
  } catch (error) {
    next(error);
  }
};
