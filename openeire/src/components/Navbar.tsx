import React from "react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import logoImage from "../assets/full-logo-white.png";

const Navbar: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const { itemCount } = useCart();

  // Style for active NavLink
  const activeLinkStyle = {
    textDecoration: "underline",
    color: "#ca8a04", // A gold color for the active link
  };

  return (
    <nav className="bg-black text-white shadow-md">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left Side: Logo and Main Links */}
          <div className="flex items-center space-x-8">
            <Link to="/" className="text-xl font-bold">
              <img
                src={logoImage}
                alt="OpenEire Studios Logo"
                className="h-16"
              />
            </Link>
            <div className="hidden md:flex items-center space-x-4">
              <NavLink
                to="/gallery/digital"
                className="hover:text-gray-300"
                style={({ isActive }) =>
                  isActive ? activeLinkStyle : undefined
                }
              >
                Stock Footage
              </NavLink>
              <NavLink
                to="/gallery/physical"
                className="hover:text-gray-300"
                style={({ isActive }) =>
                  isActive ? activeLinkStyle : undefined
                }
              >
                Art Prints
              </NavLink>
              <NavLink
                to="/blog"
                className="hover:text-gray-300"
                style={({ isActive }) =>
                  isActive ? activeLinkStyle : undefined
                }
              >
                Blog
              </NavLink>
              <NavLink
                to="/contact"
                className="hover:text-gray-300"
                style={({ isActive }) =>
                  isActive ? activeLinkStyle : undefined
                }
              >
                Contact
              </NavLink>
            </div>
          </div>

          {/* Right Side: Auth Links */}
          <div className="flex items-center space-x-4">
            {/* --- 3. Add the Shopping Bag Icon/Link Here --- */}
            <Link
              to="/bag"
              className="relative p-2 hover:bg-gray-700 rounded-full"
            >
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
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
                  {itemCount}
                </span>
              )}
            </Link>

            <div className="hidden md:flex items-center space-x-4">
              {isAuthenticated ? (
                <>
                  <NavLink
                    to="/profile"
                    className="hover:text-gray-300"
                    style={({ isActive }) =>
                      isActive ? activeLinkStyle : undefined
                    }
                  >
                    Profile
                  </NavLink>
                  <Link
                    to="/logout"
                    className="bg-primary hover:bg-primary/90 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Logout
                  </Link>
                </>
              ) : (
                <>
                  <NavLink
                    to="/login"
                    className="hover:text-gray-300"
                    style={({ isActive }) =>
                      isActive ? activeLinkStyle : undefined
                    }
                  >
                    Login
                  </NavLink>
                  <Link
                    to="/register"
                    className="bg-primary hover:bg-primary/90 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Mobile Menu Button would go here */}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
