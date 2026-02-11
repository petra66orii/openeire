import React, { useState, useEffect } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import logoImage from "../assets/full-logo-white.png";

const Navbar: React.FC = () => {
  const { isAuthenticated, logout } = useAuth(); // Removed unused 'logout' if not using, but keeping for safety
  const { itemCount } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [showBanner, setShowBanner] = useState(true); // 👈 New State for Banner
  const location = useLocation();

  // Check if we are on the Home Page
  const isHome = location.pathname === "/";

  // Handle Scroll Effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // --- DYNAMIC STYLES ---

  // 1. Background: Transparent on top of home, Glass/Dark everywhere else
  const navBackground =
    isHome && !scrolled
      ? "bg-transparent py-6"
      : "bg-dark/90 backdrop-blur-md shadow-sm py-3";

  // 2. Hover Color for Links
  const hoverColor = "hover:text-accent-hover transition-colors";

  // 3. Active Link Style (Gold)
  const activeStyle = ({ isActive }: { isActive: boolean }) =>
    isActive ? { color: "var(--color-accent)", fontWeight: 600 } : undefined;

  return (
    <div className="fixed top-0 left-0 w-full z-50 flex flex-col transition-all duration-300">
      {/* ✨ 1. ANNOUNCEMENT BAR ✨ */}
      {showBanner && (
        <div className="bg-dark text-white text-xs font-medium py-2 px-4 relative transition-all duration-300 ease-in-out">
          <div className="container mx-auto flex justify-center items-center text-center">
            <p className="tracking-wide">
              <span className="text-accent font-bold">✨ Free Delivery</span>
              <span className="opacity-90 ml-1">
                on all physical orders over{" "}
              </span>
              <span className="font-bold text-white ml-1">€120</span>

              <Link
                to="/gallery/physical"
                className="hidden md:inline-block ml-3 underline decoration-accent/50 hover:decoration-accent hover:text-accent transition-all"
              >
                Shop Prints &rarr;
              </Link>
            </p>

            {/* Close Button */}
            <button
              onClick={() => setShowBanner(false)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white p-1"
              aria-label="Close"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-3 w-3"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* 🧭 2. NAVBAR 🧭 */}
      <nav
        className={`w-full transition-all duration-300 text-white ${navBackground}`}
      >
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between">
            {/* LEFT: Logo */}
            <Link to="/" className="flex items-center">
              <img
                src={logoImage}
                alt="OpenEire Studios Logo"
                className="text-white h-16 transition-all"
              />
            </Link>

            {/* CENTER: Main Navigation (Desktop) */}
            <div className="hidden md:flex items-center space-x-8 font-medium text-sm tracking-wide uppercase">
              <NavLink
                to="/gallery/digital"
                className={hoverColor}
                style={activeStyle}
              >
                Stock Footage
              </NavLink>
              <NavLink
                to="/gallery/physical"
                className={hoverColor}
                style={activeStyle}
              >
                Art Prints
              </NavLink>
              <NavLink to="/blog" className={hoverColor} style={activeStyle}>
                Blog
              </NavLink>
              <NavLink to="/contact" className={hoverColor} style={activeStyle}>
                Contact
              </NavLink>
            </div>

            {/* RIGHT: Cart & Auth */}
            <div className="flex items-center space-x-6">
              {/* Shopping Bag */}
              <Link to="/bag" className={`relative group ${hoverColor}`}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                </svg>
                {itemCount > 0 && (
                  <span
                    className={`absolute -top-2 -right-2 bg-primary text-white ${hoverColor} text-[10px] font-bold h-5 w-5 flex items-center justify-center rounded-full `}
                  >
                    {itemCount}
                  </span>
                )}
              </Link>

              {/* User Menu */}
              <div className="hidden md:flex items-center space-x-4 text-sm font-medium">
                {isAuthenticated ? (
                  <>
                    <NavLink
                      to="/profile"
                      className={hoverColor}
                      style={activeStyle}
                    >
                      Profile
                    </NavLink>
                    <Link
                      to="/logout"
                      className={`px-4 py-2 rounded-full border transition-all ${
                        isHome && !scrolled
                          ? "border-white/30 hover:bg-white hover:text-dark"
                          : "border-dark/20 hover:bg-dark hover:text-white"
                      }`}
                    >
                      Logout
                    </Link>
                  </>
                ) : (
                  <>
                    <NavLink to="/login" className={hoverColor}>
                      Login
                    </NavLink>
                    <Link
                      to="/register"
                      className="bg-primary hover:bg-primary/90 text-white px-5 py-2 rounded-full transition-transform hover:scale-105 shadow-lg shadow-primary/30"
                    >
                      Get Started
                    </Link>
                  </>
                )}
              </div>
            </div>

            {/* Mobile Menu Button (Hamburger) - Placeholder */}
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
