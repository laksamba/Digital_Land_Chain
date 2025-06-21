import { MapPin } from "lucide-react"
import { Link } from "react-router-dom";


const Header: React.FC = () => {
  // Navigation
    return (
        <nav className="relative z-10 px-6 py-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Digital Land Chain
              </span>
            </div>
            <div className="hidden md:flex space-x-8">
              <a href="#features" className="hover:text-blue-400 transition-colors">Features</a>
              <a href="#benefits" className="hover:text-blue-400 transition-colors">Benefits</a>
              <a href="#technology" className="hover:text-blue-400 transition-colors">Technology</a>
            </div>
            <Link to={"/register"} className="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-2 rounded-full hover:from-blue-600 hover:to-purple-700 transition-all transform hover:scale-105">
              Get Started
            </Link>
          </div>
        </nav>
    )
}

export default Header ;