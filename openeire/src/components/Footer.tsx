import React, { useState } from "react";
import { Link } from "react-router-dom";
import { newsletterSignup } from "../services/api";
import { toast } from "react-toastify";
import { FaFacebook, FaInstagram, FaYoutube } from "react-icons/fa";
import logoImage from "../assets/full-logo-white.png";

const Footer: React.FC = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await newsletterSignup(email);
      toast.success("Thank you for subscribing to our newsletter!");
      setEmail("");
    } catch (err: any) {
      toast.error(err.email?.[0] || "Failed to subscribe. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="bg-black text-gray-300 pt-12 pb-8">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About Section */}
          <div>
            <h3 className="text-lg font-bold text-white mb-4">
              <img
                src={logoImage}
                alt="OpenEire Studios Logo"
                className="h-18 mb-2"
              />
            </h3>
            <p className="text-sm">
              Capturing the world from above. Premium aerial stock footage and
              art prints with proud Irish roots and a global perspective.
            </p>
          </div>
          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold text-white mb-4">Explore</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/gallery/digital" className="hover:text-white">
                  Stock Footage
                </Link>
              </li>
              <li>
                <Link to="/gallery/physical" className="hover:text-white">
                  Art Prints
                </Link>
              </li>
              <li>
                <Link to="/blog" className="hover:text-white">
                  Blog
                </Link>
              </li>
            </ul>
          </div>
          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-bold text-white mb-4">
              Join Our Newsletter
            </h3>
            <p className="text-sm mb-4">
              Get updates on new collections and exclusive offers.
            </p>
            <form onSubmit={handleSubmit}>
              <div className="flex">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address"
                  required
                  className="w-full px-3 py-2 text-gray-800 rounded-l-md focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-primary text-white px-4 py-2 rounded-r-md hover:bg-primary/90 disabled:opacity-50"
                >
                  {loading ? "..." : "Sign Up"}
                </button>
              </div>
            </form>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center text-sm">
          <p>
            &copy; {new Date().getFullYear()} OpenEire Studios. All rights
            reserved.
          </p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <a href="#" className="hover:text-white">
              <FaFacebook size={20} />
            </a>
            <a href="#" className="hover:text-white">
              <FaInstagram size={20} />
            </a>
            <a href="#" className="hover:text-white">
              <FaYoutube size={20} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
