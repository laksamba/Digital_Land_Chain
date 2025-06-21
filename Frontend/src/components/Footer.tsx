import React from 'react';
import { MapPin } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="relative z-10 px-6 py-12 border-t border-gray-800">
      <div className="max-w-7xl mx-auto text-center">
        <div className="flex items-center justify-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <MapPin className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Digital Land Chain
          </span>
        </div>
        <p className="text-gray-400 mb-4">
          A project by AIMS College, Tribhuvan University
        </p>
        <p className="text-gray-500 text-sm">
          Developed by Ram Tapesh Mandal, Rupesh Rajbanshi, and Sandesh Laksamba
        </p>
      </div>
    </footer>
  );
};

export default Footer;
