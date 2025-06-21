import React, { useState, useEffect } from 'react';
import { Shield, Search, FileText, Users, Zap, ChevronRight, Lock, Smartphone, Globe, CheckCircle, ArrowRight } from 'lucide-react';
import Footer from '../components/Footer';
import Header from '../components/Header';

const DigitalLandChain: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % 4);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Blockchain Security",
      description: "Tamper-proof land records stored on Sepolia Testnet with smart contract verification"
    },
    {
      icon: <Search className="w-8 h-8" />,
      title: "Instant Verification",
      description: "Real-time land ownership verification and transparent transaction history"
    },
    {
      icon: <FileText className="w-8 h-8" />,
      title: "Digital Certificates",
      description: "Hashed digital land certificates with permanent ownership proof"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Multi-stakeholder",
      description: "Seamless integration for citizens, municipalities, and banking institutions"
    }
  ];

  const benefits = [
    "Eliminates 30% of land disputes caused by unclear records",
    "Reduces transaction time from weeks to minutes",
    "Provides 99.9% uptime for land record access",
    "Enables secure mortgage verification for banks",
    "Supports KYC and OTP-based authentication"
  ];

  const stats = [
    { number: "30%", label: "Reduction in Land Disputes" },
    { number: "99.9%", label: "System Uptime" },
    { number: "< 2s", label: "Response Time" },
    { number: "24/7", label: "Availability" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 opacity-20">
        <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-2000"></div>
        <div className="absolute bottom-20 left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-4000"></div>
      </div>

      {/* navigation */}
      <Header />



      {/* Hero Section */}
      <section className="relative z-10 px-6 py-20">
        <div className="max-w-7xl mx-auto text-center">
          <div className={`transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Revolutionary
              </span>
              <br />
              Land Management
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Secure, transparent, and efficient land ownership management powered by blockchain technology. 
              Transforming Nepal's land administration with tamper-proof records and instant verification.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button className="bg-gradient-to-r from-blue-500 to-purple-600 px-8 py-4 rounded-full text-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all transform hover:scale-105 flex items-center gap-2">
                Explore Platform <ArrowRight className="w-5 h-5" />
              </button>
              <button className="border border-gray-600 px-8 py-4 rounded-full text-lg font-semibold hover:bg-white hover:text-gray-900 transition-all">
                Watch Demo
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative z-10 px-6 py-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative z-10 px-6 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Powerful Features
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Built on Sepolia Testnet with cutting-edge technology stack including React.js, Node.js, and Solidity smart contracts
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className={`p-8 rounded-2xl border backdrop-blur-sm transition-all duration-500 cursor-pointer transform hover:scale-105 ${
                  activeFeature === index 
                    ? 'border-blue-500 bg-gradient-to-r from-blue-500/20 to-purple-500/20 shadow-2xl' 
                    : 'border-gray-700 bg-white/5 hover:border-gray-600'
                }`}
                onMouseEnter={() => setActiveFeature(index)}
              >
                <div className={`mb-6 ${activeFeature === index ? 'text-blue-400' : 'text-gray-400'} transition-colors`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-4">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="relative z-10 px-6 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-8">
                <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Transform Nepal's
                </span>
                <br />
                Land Administration
              </h2>
              <p className="text-xl text-gray-300 mb-8">
                Addressing critical challenges in land management with blockchain innovation, 
                reducing fraud and improving accessibility for all stakeholders.
              </p>
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-green-400 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-300">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl blur-xl opacity-30"></div>
              <div className="relative p-8 bg-white/10 backdrop-blur-sm rounded-3xl border border-gray-700">
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center p-4 bg-white/5 rounded-xl">
                    <Lock className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                    <div className="text-sm text-gray-400">Blockchain Security</div>
                  </div>
                  <div className="text-center p-4 bg-white/5 rounded-xl">
                    <Smartphone className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                    <div className="text-sm text-gray-400">Mobile Accessible</div>
                  </div>
                  <div className="text-center p-4 bg-white/5 rounded-xl">
                    <Globe className="w-8 h-8 text-green-400 mx-auto mb-2" />
                    <div className="text-sm text-gray-400">24/7 Available</div>
                  </div>
                  <div className="text-center p-4 bg-white/5 rounded-xl">
                    <Zap className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                    <div className="text-sm text-gray-400">Instant Verification</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Technology Stack */}
      <section id="technology" className="relative z-10 px-6 py-20">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Built with Modern Technology
            </span>
          </h2>
          <p className="text-xl text-gray-300 mb-12">
            Leveraging cutting-edge blockchain and web technologies for maximum performance and security
          </p>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 bg-white/5 backdrop-blur-sm rounded-2xl border border-gray-700">
              <h3 className="text-2xl font-semibold mb-4 text-blue-400">Frontend</h3>
              <div className="space-y-2 text-gray-300">
                <div>React.js + TypeScript</div>
                <div>TailwindCSS</div>
                <div>Vite</div>
              </div>
            </div>
            <div className="p-8 bg-white/5 backdrop-blur-sm rounded-2xl border border-gray-700">
              <h3 className="text-2xl font-semibold mb-4 text-purple-400">Backend</h3>
              <div className="space-y-2 text-gray-300">
                <div>Node.js + Express</div>
                <div>MongoDB</div>
                <div>Ethers.js</div>
              </div>
            </div>
            <div className="p-8 bg-white/5 backdrop-blur-sm rounded-2xl border border-gray-700">
              <h3 className="text-2xl font-semibold mb-4 text-green-400">Blockchain</h3>
              <div className="space-y-2 text-gray-300">
                <div>Solidity Smart Contracts</div>
                <div>Sepolia Testnet</div>
                <div>Hardhat</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="p-12 bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-sm rounded-3xl border border-gray-700">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Transform Land Management?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Join the revolution in land administration. Experience secure, transparent, and efficient land ownership management.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-gradient-to-r from-blue-500 to-purple-600 px-8 py-4 rounded-full text-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all transform hover:scale-105 flex items-center justify-center gap-2">
                Get Started Today <ChevronRight className="w-5 h-5" />
              </button>
              <button className="border border-gray-600 px-8 py-4 rounded-full text-lg font-semibold hover:bg-white hover:text-gray-900 transition-all">
                Contact Us
              </button>
            </div>
          </div>
        </div>
      </section>

     <Footer/>
    </div>
  );
};

export default DigitalLandChain;