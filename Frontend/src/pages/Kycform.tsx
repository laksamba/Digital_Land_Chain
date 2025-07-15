import React, { useState, useRef, useEffect } from "react";
import {
  Upload,
  Camera,
  FileText,
  User,
  MapPin,
  Shield,
  CheckCircle,
} from "lucide-react";
import { userKyc } from "../api/userApi";
import { Link } from "react-router-dom";

interface UserData {
  fullName: {
    english: string;
    nepali: string;
  };
  documentType: string;
  dateOfBirth: {
    bs: string;
    ad: string;
  };
  citizenshipNumber: string;
  citizenshipIssuedDistrict: string;
  citizenshipIssuedDate: {
    bs: string;
    ad: string;
  };
  photo: string | File;
  documents: Array<{
    type: string;
    url?: string;
    file?: File;
  }>;
}

const steps = [
  {
    id: 1,
    title: "Personal Info",
    icon: <User className="w-6 h-6" />,
  },
  {
    id: 2,
    title: "Documents",
    icon: <FileText className="w-6 h-6" />,
  },
  {
    id: 3,
    title: "OTP",
    icon: <Shield className="w-6 h-6" />,
  },
  {
    id: 4,
    title: "Complete",
    icon: <CheckCircle className="w-6 h-6" />,
  },
];

const KYCForm: React.FC = () => {
  const [userData, setUserData] = useState<UserData>({
    fullName: {
      english: "",
      nepali: "",
    },
    documentType: "citizenship",
    dateOfBirth: {
      bs: "",
      ad: "",
    },
    citizenshipNumber: "",
    citizenshipIssuedDistrict: "",
    citizenshipIssuedDate: {
      bs: "",
      ad: "",
    },
    photo: "",
    documents: [],
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [uploadedPhoto, setUploadedPhoto] = useState<string | null>(null);
  const [uploadedDocuments, setUploadedDocuments] = useState<{
    [key: string]: string;
  }>({});
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [saveStatus, setSaveStatus] = useState<
    "idle" | "saving" | "success" | "error"
  >("idle");

  const photoInputRef = useRef<HTMLInputElement>(null);
  const frontDocRef = useRef<HTMLInputElement>(null);
  const backDocRef = useRef<HTMLInputElement>(null);

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const preview = URL.createObjectURL(file); // for image preview
      setUploadedPhoto(preview); // show preview

      setUserData((prev) => ({
        ...prev,
        photo: file, // ✅ store the File, not base64
      }));
    }
  };

  const handleDocumentUpload = (
    event: React.ChangeEvent<HTMLInputElement>,
    docType: string
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);

      setUploadedDocuments((prev) => ({
        ...prev,
        [docType]: previewUrl,
      }));

      setUserData((prev) => {
        const updatedDocuments = [...prev.documents];
        const existingIndex = updatedDocuments.findIndex(
          (doc) => doc.type === docType
        );

        const newDoc = { type: docType, file };

        if (existingIndex >= 0) {
          updatedDocuments[existingIndex] = newDoc;
        } else {
          updatedDocuments.push(newDoc);
        }

        return { ...prev, documents: updatedDocuments };
      });
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      if (value && index < 5) {
        const nextInput = document.getElementById(`otp-${index + 1}`);
        nextInput?.focus();
      }
    }
  };

  const handleVerification = async () => {
    setIsVerifying(true);
    // Simulate OTP verification
    setTimeout(() => {
      setIsVerifying(false);
      setVerificationStatus("success");
    }, 2000);
  };

  const saveToDatabase = async (data: UserData) => {
    setSaveStatus("saving");
    setIsSaving(true);

    try {
      // Simulate API call to save data
      console.log("Saving KYC data to database:", data);

      // Convert UserData to FormData
      const formData = new FormData();
      formData.append("fullName.english", data.fullName.english);
      formData.append("fullName.nepali", data.fullName.nepali);

      formData.append("documentType", data.documentType);
      formData.append("dateOfBirth.bs", data.dateOfBirth.bs);
      formData.append("dateOfBirth.ad", data.dateOfBirth.ad);
      formData.append("citizenshipNumber", data.citizenshipNumber);
      formData.append(
        "citizenshipIssuedDistrict",
        data.citizenshipIssuedDistrict
      );
      formData.append(
        "citizenshipIssuedDate.bs",
        data.citizenshipIssuedDate.bs
      );
      formData.append(
        "citizenshipIssuedDate.ad",
        data.citizenshipIssuedDate.ad
      );

      if (data.photo instanceof File) {
        formData.append("photo", data.photo);
      } else {
        console.warn("Photo is not a File. Skipping upload.");
      }

      data.documents.forEach((doc, _idx) => {
        if (doc.file) {
          formData.append("documents", doc.file);
        }
      });

      const response = await userKyc(formData); // actual API call

      setSaveStatus("success");
      console.log("KYC data saved successfully:", response);
      await new Promise((resolve) => setTimeout(resolve, 2000));
    } catch (error) {
      console.error("Error saving KYC data:", error);
      setSaveStatus("error");
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    if (verificationStatus === "success") {
      const timer = setTimeout(async () => {
        // Save to database before moving to completion step
        await saveToDatabase(userData);
        setCurrentStep(4);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [verificationStatus, userData]);

  const validateStep1 = () => {
    return (
      userData.fullName.english.trim() !== "" &&
      userData.fullName.nepali.trim() !== "" &&
      userData.dateOfBirth.bs.trim() !== "" &&
      userData.dateOfBirth.ad.trim() !== "" &&
      userData.citizenshipNumber.trim() !== "" &&
      userData.citizenshipIssuedDistrict.trim() !== "" &&
      userData.citizenshipIssuedDate.bs.trim() !== "" &&
      userData.citizenshipIssuedDate.ad.trim() !== ""
    );
  };

  const validateStep2 = () => {
    return (
      uploadedPhoto !== null &&
      uploadedDocuments.citizenship_front &&
      uploadedDocuments.citizenship_back
    );
  };

  const validateStep3 = () => {
    return otp.every((digit) => digit !== "");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              KYC Verification
            </h1>
          </div>
          <p className="text-gray-400">
            Secure your Digital Land Chain account with identity verification
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div
                  className={`flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all ${
                    currentStep >= step.id
                      ? "bg-gradient-to-r from-blue-500 to-purple-600 border-transparent text-white"
                      : "border-gray-600 text-gray-400"
                  }`}
                >
                  {currentStep > step.id ? (
                    <CheckCircle className="w-6 h-6" />
                  ) : (
                    step.icon
                  )}
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`w-20 h-1 mx-2 rounded ${
                      currentStep > step.id
                        ? "bg-gradient-to-r from-blue-500 to-purple-600"
                        : "bg-gray-700"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2">
            {steps.map((step) => (
              <div
                key={step.id}
                className={`text-sm ${
                  currentStep >= step.id ? "text-blue-400" : "text-gray-500"
                }`}
              >
                {step.title}
              </div>
            ))}
          </div>
        </div>

        {/* Form Container */}
        <div className="bg-white/10 backdrop-blur-sm rounded-3xl border border-gray-700/50 p-8">
          {/* Step 1: Personal Information */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-white mb-6 flex items-center gap-3">
                <User className="w-6 h-6 text-blue-400" />
                Personal Information
              </h2>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Full Name (English){" "}
                      <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={userData.fullName.english}
                      onChange={(e) =>
                        setUserData({
                          ...userData,
                          fullName: {
                            ...userData.fullName,
                            english: e.target.value,
                          },
                        })
                      }
                      className="w-full px-4 py-3 bg-white/5 border border-gray-600 rounded-xl text-white placeholder:text-gray-400 focus:border-blue-500 focus:outline-none transition-all"
                      placeholder="Enter full name in English"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Full Name (Nepali) <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={userData.fullName.nepali}
                      onChange={(e) =>
                        setUserData({
                          ...userData,
                          fullName: {
                            ...userData.fullName,
                            nepali: e.target.value,
                          },
                        })
                      }
                      className="w-full px-4 py-3 bg-white/5 border border-gray-600 rounded-xl text-white placeholder:text-gray-400 focus:border-blue-500 focus:outline-none transition-all"
                      placeholder="पूरा नाम नेपालीमा लेख्नुहोस्"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Date of Birth <span className="text-red-400">*</span>
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={userData.dateOfBirth.bs}
                        onChange={(e) =>
                          setUserData({
                            ...userData,
                            dateOfBirth: {
                              ...userData.dateOfBirth,
                              bs: e.target.value,
                            },
                          })
                        }
                        className="px-4 py-3 bg-white/5 border border-gray-600 rounded-xl text-white placeholder:text-gray-400 focus:border-blue-500 focus:outline-none transition-all"
                        placeholder="BS (e.g., 2055-01-12)"
                        required
                      />
                      <input
                        type="date"
                        value={userData.dateOfBirth.ad}
                        onChange={(e) =>
                          setUserData({
                            ...userData,
                            dateOfBirth: {
                              ...userData.dateOfBirth,
                              ad: e.target.value,
                            },
                          })
                        }
                        className="px-4 py-3 bg-white/5 border border-gray-600 rounded-xl text-white placeholder:text-gray-400 focus:border-blue-500 focus:outline-none transition-all"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Citizenship Number <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={userData.citizenshipNumber}
                      onChange={(e) =>
                        setUserData({
                          ...userData,
                          citizenshipNumber: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 bg-white/5 border border-gray-600 rounded-xl text-white placeholder:text-gray-400 focus:border-blue-500 focus:outline-none transition-all"
                      placeholder="Enter Citizenship Number"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Issued District <span className="text-red-400">*</span>
                    </label>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        value={userData.citizenshipIssuedDistrict}
                        onChange={(e) =>
                          setUserData({
                            ...userData,
                            citizenshipIssuedDistrict: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 bg-white/5 border border-gray-600 rounded-xl text-white placeholder:text-gray-400 focus:border-blue-500 focus:outline-none transition-all"
                        placeholder="District where citizenship was issued"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Citizenship Issue Date{" "}
                      <span className="text-red-400">*</span>
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={userData.citizenshipIssuedDate.bs}
                        onChange={(e) =>
                          setUserData({
                            ...userData,
                            citizenshipIssuedDate: {
                              ...userData.citizenshipIssuedDate,
                              bs: e.target.value,
                            },
                          })
                        }
                        className="px-4 py-3 bg-white/5 border border-gray-600 rounded-xl text-white placeholder:text-gray-400 focus:border-blue-500 focus:outline-none transition-all"
                        placeholder="BS Date"
                        required
                      />
                      <input
                        type="date"
                        value={userData.citizenshipIssuedDate.ad}
                        onChange={(e) =>
                          setUserData({
                            ...userData,
                            citizenshipIssuedDate: {
                              ...userData.citizenshipIssuedDate,
                              ad: e.target.value,
                            },
                          })
                        }
                        className="px-4 py-3 bg-white/5 border border-gray-600 rounded-xl text-white placeholder:text-gray-400 focus:border-blue-500 focus:outline-none transition-all"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => setCurrentStep(2)}
                  disabled={!validateStep1()}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 px-8 py-3 rounded-xl text-white font-semibold hover:from-blue-600 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Continue to Document Upload
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Document Upload */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-white mb-6 flex items-center gap-3">
                <FileText className="w-6 h-6 text-blue-400" />
                Document Upload
              </h2>

              {/* Photo Upload */}
              <div className="border border-gray-600 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">
                  Profile Photo <span className="text-red-400">*</span>
                </h3>
                <div className="flex items-center gap-6">
                  <div className="w-32 h-32 border-2 border-dashed border-gray-600 rounded-xl flex items-center justify-center bg-white/5">
                    {uploadedPhoto ? (
                      <img
                        src={uploadedPhoto}
                        alt="Profile"
                        className="w-full h-full object-cover rounded-xl"
                      />
                    ) : (
                      <div className="text-center">
                        <Camera className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <span className="text-sm text-gray-400">
                          Upload Photo
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <button
                      onClick={() => photoInputRef.current?.click()}
                      className="w-full bg-white/10 border border-gray-600 rounded-xl px-4 py-3 text-white hover:bg-white/20 transition-all flex items-center justify-center gap-2"
                    >
                      <Upload className="w-5 h-5" />
                      Choose Photo
                    </button>
                    <input
                      ref={photoInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="hidden"
                      required
                    />
                    <p className="text-xs text-gray-400 mt-2">
                      Supported formats: JPG, PNG (Max 5MB)
                    </p>
                  </div>
                </div>
              </div>

              {/* Document Upload */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="border border-gray-600 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">
                    Citizenship Front <span className="text-red-400">*</span>
                  </h3>
                  <div className="aspect-video border-2 border-dashed border-gray-600 rounded-xl flex items-center justify-center bg-white/5 mb-4">
                    {uploadedDocuments.citizenship_front ? (
                      <img
                        src={uploadedDocuments.citizenship_front}
                        alt="Citizenship Front"
                        className="w-full h-full object-cover rounded-xl"
                      />
                    ) : (
                      <div className="text-center">
                        <FileText className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <span className="text-sm text-gray-400">
                          Upload Front Side
                        </span>
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => frontDocRef.current?.click()}
                    className="w-full bg-white/10 border border-gray-600 rounded-xl px-4 py-3 text-white hover:bg-white/20 transition-all flex items-center justify-center gap-2"
                  >
                    <Upload className="w-5 h-5" />
                    Upload Front
                  </button>
                  <input
                    ref={frontDocRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      handleDocumentUpload(e, "citizenship_front")
                    }
                    className="hidden"
                    required
                  />
                </div>

                <div className="border border-gray-600 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">
                    Citizenship Back <span className="text-red-400">*</span>
                  </h3>
                  <div className="aspect-video border-2 border-dashed border-gray-600 rounded-xl flex items-center justify-center bg-white/5 mb-4">
                    {uploadedDocuments.citizenship_back ? (
                      <img
                        src={uploadedDocuments.citizenship_back}
                        alt="Citizenship Back"
                        className="w-full h-full object-cover rounded-xl"
                      />
                    ) : (
                      <div className="text-center">
                        <FileText className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <span className="text-sm text-gray-400">
                          Upload Back Side
                        </span>
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => backDocRef.current?.click()}
                    className="w-full bg-white/10 border border-gray-600 rounded-xl px-4 py-3 text-white hover:bg-white/20 transition-all flex items-center justify-center gap-2"
                  >
                    <Upload className="w-5 h-5" />
                    Upload Back
                  </button>
                  <input
                    ref={backDocRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      handleDocumentUpload(e, "citizenship_back")
                    }
                    className="hidden"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-between">
                <button
                  onClick={() => setCurrentStep(1)}
                  className="px-8 py-3 border border-gray-600 rounded-xl text-white hover:bg-white/10 transition-all"
                >
                  Back
                </button>
                <button
                  onClick={() => setCurrentStep(3)}
                  disabled={!validateStep2()}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 px-8 py-3 rounded-xl text-white font-semibold hover:from-blue-600 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Continue to OTP
                </button>
              </div>
            </div>
          )}

          {/* Step 3: OTP Verification */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-white mb-6 flex items-center gap-3">
                <Shield className="w-6 h-6 text-blue-400" />
                OTP Verification
              </h2>

              <div className="text-center">
                <p className="text-gray-300 mb-6">
                  We've sent a 6-digit verification code to your registered
                  mobile number
                </p>

                <div className="flex justify-center gap-3 mb-6">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      id={`otp-${index}`}
                      type="text"
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      className="w-14 h-14 text-center text-2xl font-bold bg-white/10 border border-gray-600 rounded-xl text-white focus:border-blue-500 focus:outline-none transition-all"
                      maxLength={1}
                      required
                    />
                  ))}
                </div>

                <button className="text-blue-400 hover:text-blue-300 text-sm mb-6">
                  Didn't receive code? Resend OTP
                </button>
              </div>

              <div className="flex justify-between">
                <button
                  onClick={() => setCurrentStep(2)}
                  className="px-8 py-3 border border-gray-600 rounded-xl text-white hover:bg-white/10 transition-all"
                >
                  Back
                </button>
                <button
                  onClick={handleVerification}
                  disabled={!validateStep3() || isVerifying}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 px-8 py-3 rounded-xl text-white font-semibold hover:from-blue-600 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isVerifying ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Verifying...
                    </>
                  ) : (
                    "Verify & Complete"
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Completion */}
          {currentStep === 4 && (
            <div className="text-center space-y-6">
              {isSaving ? (
                <div className="space-y-4">
                  <div className="w-20 h-20 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                  <h2 className="text-2xl font-semibold text-white">
                    Saving Your Information...
                  </h2>
                  <p className="text-gray-300">
                    Please wait while we securely save your KYC data.
                  </p>
                </div>
              ) : saveStatus === "success" ? (
                <>
                  <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle className="w-10 h-10 text-white" />
                  </div>

                  <h2 className="text-3xl font-bold text-white">
                    KYC Verification Complete!
                  </h2>
                  <p className="text-gray-300 max-w-md mx-auto">
                    Your identity has been successfully verified and saved to
                    our secure database. You can now access all features of
                    Digital Land Chain.
                  </p>

                  <div className="bg-white/5 border border-gray-600 rounded-xl p-6 max-w-md mx-auto">
                    <h3 className="text-lg font-semibold text-white mb-4">
                      Verification Details
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Name:</span>
                        <span className="text-white">
                          {userData.fullName.english}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Citizenship:</span>
                        <span className="text-white">
                          {userData.citizenshipNumber}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Status:</span>
                        <span className="text-green-400 flex items-center gap-1">
                          <CheckCircle className="w-4 h-4" />
                          Verified & Saved
                        </span>
                      </div>
                    </div>
                  </div>

                  <Link
                    to="/login"
                    className="bg-gradient-to-r from-blue-500 to-purple-600 px-8 py-3 rounded-xl text-white font-semibold hover:from-blue-600 hover:to-purple-700 transition-all mt-6 inline-block"
                  >
                    Go to Login
                  </Link>
                </>
              ) : (
                <div className="space-y-4">
                  <div className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center mx-auto">
                    <span className="text-white text-2xl">✕</span>
                  </div>
                  <h2 className="text-2xl font-semibold text-white">
                    Save Failed
                  </h2>
                  <p className="text-gray-300">
                    There was an error saving your data. Please try again.
                  </p>
                  <button
                    onClick={() => saveToDatabase(userData)}
                    className="bg-gradient-to-r from-blue-500 to-purple-600 px-8 py-3 rounded-xl text-white font-semibold hover:from-blue-600 hover:to-purple-700 transition-all"
                  >
                    Retry Save
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default KYCForm;
