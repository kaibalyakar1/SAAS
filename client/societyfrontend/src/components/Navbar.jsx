import { Link, useNavigate } from "react-router-dom";
import { useReducer, useRef, useState } from "react";
import { Menu, X } from "lucide-react";
import logo from "../assets/LOGO.png"; // Adjust the path to your logo
import { useScroll } from "../context/ScrollContext";
const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  const aboutRef = useScroll();
  const navigate = useNavigate();
  const scrollToAbout = () => {
    aboutRef.current.scrollIntoView({ behavior: "smooth" });
  };

  const contactRef = useScroll();
  const scrollToContact = () => {
    contactRef.current.scrollIntoView({ behavior: "smooth" });
  };
  return (
    <nav className="bg-white shadow-md fixed w-screen z-50 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Logo Left */}
        <div className="flex items-center space-x-3">
          <img src={logo} alt="Logo" className="w-10 h-10 rounded-full" />
          <h1 className="text-xl font-bold text-gray-800">Nayan Vihar</h1>
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center space-x-6">
          <Link
            to="#"
            onClick={scrollToAbout}
            className="text-gray-700 hover:text-blue-600 transition duration-300 hover:underline"
          >
            About
          </Link>
          <div
            onClick={scrollToContact}
            className="text-gray-700 hover:text-blue-600 transition duration-300 hover:underline"
          >
            Contact
          </div>
          <Link
            to="/login"
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
          >
            Login
          </Link>
          <Link
            to="/signup"
            className="px-4 py-2 border border-blue-500 text-blue-500 rounded-lg hover:bg-blue-50 transition"
          >
            Signup
          </Link>
        </div>

        {/* Mobile Toggle */}
        <div className="md:hidden">
          <button onClick={toggleMenu}>
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden mt-4 flex flex-col items-start space-y-4 animate-slideDown">
          <Link
            to="/about"
            className="text-gray-700 hover:text-blue-600 transition duration-300"
            onClick={toggleMenu}
          >
            About
          </Link>
          <Link
            to="/contact"
            className="text-gray-700 hover:text-blue-600 transition duration-300"
            onClick={toggleMenu}
          >
            Contact
          </Link>
          <Link
            to="/login"
            className="text-white bg-blue-500 px-4 py-2 rounded hover:bg-blue-600 transition"
            onClick={toggleMenu}
          >
            Login
          </Link>
          <Link
            to="/signup"
            className="text-blue-500 border border-blue-500 px-4 py-2 rounded hover:bg-blue-50 transition"
            onClick={toggleMenu}
          >
            Signup
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
