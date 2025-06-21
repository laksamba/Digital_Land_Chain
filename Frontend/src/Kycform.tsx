import React, { useState, useRef, useEffect } from 'react';
import { Upload, Camera, FileText, User, MapPin, Shield, CheckCircle, } from 'lucide-react';

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
  documentNumber: string;
  citizenshipNumber: string;
  citizenshipIssuedDistrict: string;
  citizenshipIssuedDate: {
    bs: string;
    ad: string;
  };
  photo: string;
  documents: Array<{
    type: string;
    url: string;
  }>;
}

const steps = [
  {
    id: 1,
    title: "Personal Info",
    icon: <User className="w-6 h-6" />
  },
  {
    id: 2,
    title: "Documents",
    icon: <FileText className="w-6 h-6" />
  },
  {
    id: 3,
    title: "OTP",
    icon: <Shield className="w-6 h-6" />
  },
  {
    id: 4,
    title: "Complete",
    icon: <CheckCircle className="w-6 h-6" />
  }
];

const KYCForm: React.FC = () => {
  const [userData] = useState<UserData>({
    fullName: {
      english: "Sandesh Limbu",
      nepali: "\u0938\u0928\u094d\u0926\u0947\u0936 \u0932\u093f\u092e\u094d\u092c\u0941"
    },
    documentType: "citizenship",
    dateOfBirth: {
      bs: "2055-01-12",
      ad: "1998-04-25T00:00:00.000Z"
    },
    documentNumber: "DOC-987654",
    citizenshipNumber: "01-1234-56789",
    citizenshipIssuedDistrict: "Sunsari",
    citizenshipIssuedDate: {
      bs: "2070-04-15",
      ad: "2013-07-31T00:00:00.000Z"
    },
    photo: "https://example.com/photo.jpg",
    documents: [
      {
        type: "citizenship_front",
        url: "https://example.com/citizen-front.jpg"
      },
      {
        type: "citizenship_back",
        url: "https://example.com/citizen-back.jpg"
      }
    ]
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [uploadedPhoto, setUploadedPhoto] = useState<string | null>(null);
  const [uploadedDocuments, setUploadedDocuments] = useState<{[key: string]: string}>({});
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const photoInputRef = useRef<HTMLInputElement>(null);
  const frontDocRef = useRef<HTMLInputElement>(null);
  const backDocRef = useRef<HTMLInputElement>(null);

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedPhoto(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDocumentUpload = (event: React.ChangeEvent<HTMLInputElement>, docType: string) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedDocuments(prev => ({
          ...prev,
          [docType]: e.target?.result as string
        }));
      };
      reader.readAsDataURL(file);
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
    setTimeout(() => {
      setIsVerifying(false);
      setVerificationStatus('success');
    }, 2000);
  };

  useEffect(() => {
    if (verificationStatus === 'success') {
      const timer = setTimeout(() => {
        setCurrentStep(4);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [verificationStatus]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
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
          <p className="text-gray-400">Secure your Digital Land Chain account with identity verification</p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all ${
                  currentStep >= step.id 
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 border-transparent text-white' 
                    : 'border-gray-600 text-gray-400'
                }`}>
                  {currentStep > step.id ? <CheckCircle className="w-6 h-6" /> : step.icon}
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-20 h-1 mx-2 rounded ${
                    currentStep > step.id ? 'bg-gradient-to-r from-blue-500 to-purple-600' : 'bg-gray-700'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2">
            {steps.map((step) => (
              <div key={step.id} className={`text-sm ${
                currentStep >= step.id ? 'text-blue-400' : 'text-gray-500'
              }`}>
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
                Personal Information Verification
              </h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Full Name (English)</label>
                    <div className="w-full px-4 py-3 bg-white/5 border border-gray-600 rounded-xl text-white">
                      {userData.fullName.english}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Full Name (Nepali)</label>
                    <div className="w-full px-4 py-3 bg-white/5 border border-gray-600 rounded-xl text-white">
                      {userData.fullName.nepali}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Date of Birth</label>
                    <div className="flex gap-2">
                      <div className="flex-1 px-4 py-3 bg-white/5 border border-gray-600 rounded-xl text-white">
                        <span className="text-xs text-gray-400">BS:</span> {userData.dateOfBirth.bs}
                      </div>
                      <div className="flex-1 px-4 py-3 bg-white/5 border border-gray-600 rounded-xl text-white">
                        <span className="text-xs text-gray-400">AD:</span> {formatDate(userData.dateOfBirth.ad)}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Citizenship Number</label>
                    <div className="w-full px-4 py-3 bg-white/5 border border-gray-600 rounded-xl text-white">
                      {userData.citizenshipNumber}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Document Number</label>
                    <div className="w-full px-4 py-3 bg-white/5 border border-gray-600 rounded-xl text-white">
                      {userData.documentNumber}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Issued District</label>
                    <div className="w-full px-4 py-3 bg-white/5 border border-gray-600 rounded-xl text-white flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      {userData.citizenshipIssuedDistrict}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end">
                <button 
                  onClick={() => setCurrentStep(2)}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 px-8 py-3 rounded-xl text-white font-semibold hover:from-blue-600 hover:to-purple-700 transition-all"
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
                <h3 className="text-lg font-semibold text-white mb-4">Profile Photo</h3>
                <div className="flex items-center gap-6">
                  <div className="w-32 h-32 border-2 border-dashed border-gray-600 rounded-xl flex items-center justify-center bg-white/5">
                    {uploadedPhoto ? (
                      <img src={uploadedPhoto} alt="Profile" className="w-full h-full object-cover rounded-xl" />
                    ) : (
                      <div className="text-center">
                        <Camera className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <span className="text-sm text-gray-400">Upload Photo</span>
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
                    />
                    <p className="text-xs text-gray-400 mt-2">Supported formats: JPG, PNG (Max 5MB)</p>
                  </div>
                </div>
              </div>
              
              {/* Document Upload */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="border border-gray-600 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Citizenship Front</h3>
                  <div className="aspect-video border-2 border-dashed border-gray-600 rounded-xl flex items-center justify-center bg-white/5 mb-4">
                    {uploadedDocuments.citizenship_front ? (
                      <img src={uploadedDocuments.citizenship_front} alt="Citizenship Front" className="w-full h-full object-cover rounded-xl" />
                    ) : (
                      <div className="text-center">
                        <FileText className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <span className="text-sm text-gray-400">Upload Front Side</span>
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
                    onChange={(e) => handleDocumentUpload(e, 'citizenship_front')}
                    className="hidden"
                  />
                </div>
                
                <div className="border border-gray-600 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Citizenship Back</h3>
                  <div className="aspect-video border-2 border-dashed border-gray-600 rounded-xl flex items-center justify-center bg-white/5 mb-4">
                    {uploadedDocuments.citizenship_back ? (
                      <img src={uploadedDocuments.citizenship_back} alt="Citizenship Back" className="w-full h-full object-cover rounded-xl" />
                    ) : (
                      <div className="text-center">
                        <FileText className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <span className="text-sm text-gray-400">Upload Back Side</span>
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
                    onChange={(e) => handleDocumentUpload(e, 'citizenship_back')}
                    className="hidden"
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
                  disabled={!uploadedPhoto || !uploadedDocuments.citizenship_front || !uploadedDocuments.citizenship_back}
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
                  We've sent a 6-digit verification code to your registered mobile number
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
                  disabled={otp.some(digit => !digit) || isVerifying}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 px-8 py-3 rounded-xl text-white font-semibold hover:from-blue-600 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isVerifying ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Verifying...
                    </>
                  ) : (
                    'Verify & Complete'
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Completion */}
          {currentStep === 4 && (
            <div className="text-center space-y-6">
              <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-10 h-10 text-white" />
              </div>
              
              <h2 className="text-3xl font-bold text-white">KYC Verification Complete!</h2>
              <p className="text-gray-300 max-w-md mx-auto">
                Your identity has been successfully verified. You can now access all features of Digital Land Chain.
              </p>
              
              <div className="bg-white/5 border border-gray-600 rounded-xl p-6 max-w-md mx-auto">
                <h3 className="text-lg font-semibold text-white mb-4">Verification Details</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Name:</span>
                    <span className="text-white">{userData.fullName.english}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Citizenship:</span>
                    <span className="text-white">{userData.citizenshipNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Status:</span>
                    <span className="text-green-400 flex items-center gap-1">
                      <CheckCircle className="w-4 h-4" />
                      Verified
                    </span>
                  </div>
                </div>
              </div>
              
              <button className="bg-gradient-to-r from-blue-500 to-purple-600 px-8 py-3 rounded-xl text-white font-semibold hover:from-blue-600 hover:to-purple-700 transition-all">
                Continue to Dashboard
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default KYCForm;
