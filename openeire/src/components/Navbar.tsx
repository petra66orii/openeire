import React from "react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar: React.FC = () => {
  const { isAuthenticated } = useAuth();

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
              OpenEire Studios
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
            </div>
          </div>

          {/* Right Side: Auth Links */}
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
                  className="bg-green-600 hover:bg-green-700 px-3 py-2 rounded-md text-sm font-medium"
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
                  className="bg-green-600 hover:bg-green-700 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button would go here */}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
