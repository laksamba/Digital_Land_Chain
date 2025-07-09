import User from "../../models/User.js";

export const fetchAllKycRecords = async (req, res) => {
  try {
    const users = await User.find({ kyc: { $exists: true } }, 'name email walletAddress kyc').lean();

    const kycList = users.map(user => {
      const kyc = user.kyc || {};
      const fullName = kyc.fullName || {};
      const documents = Array.isArray(kyc.documents) ? kyc.documents : [];

      return {
        id: kyc._id?.toString() || "",            
        userId: user._id?.toString(),                
        name: user.name || "N/A",
        email: user.email || "N/A",
        walletAddress: user.walletAddress || "N/A",
        kyc: {
          fullName: {
            english: fullName.english || "N/A",
            nepali: fullName.nepali || "N/A",
          },
          documentType: kyc.documentType || "N/A",
          citizenshipNumber: kyc.citizenshipNumber || "N/A",
          citizenshipIssuedDistrict: kyc.citizenshipIssuedDistrict || "N/A",
          citizenshipIssuedDate: kyc.citizenshipIssuedDate || {},
          dateOfBirth: kyc.dateOfBirth || {},
          photo: kyc.photo || "",
          documents: documents.map(doc => ({
            name: doc.url?.split("/").pop() || "Unnamed Document",
            type: kyc.documentType || "N/A",
            status: doc.status || kyc.verificationStatus || "pending",
            url: doc.url || "",
          })),
          verificationStatus: kyc.verificationStatus || "pending",
          verified: kyc.verified || false,
          createdAt: kyc.createdAt?.toISOString() || "",
          _id: kyc._id?.toString() || "",
          verifiedAt: kyc.verifiedAt ? kyc.verifiedAt.toISOString() : "",
        }
      };
    });

    res.json(kycList);
  } catch (error) {
    console.error("Error fetching KYC data:", error);
    res.status(500).json({ error: 'Failed to fetch KYC data' });
  }
};
