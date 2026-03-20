import React, { useState } from "react";
import { Link } from "react-router-dom";
import { newsletterSignup } from "../services/api";
import toast from "react-hot-toast";
import { FaFacebook, FaInstagram, FaYoutube, FaTwitter } from "react-icons/fa";
import logoImage from "../assets/full-logo-white.png";

const Footer: React.FC = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await newsletterSignup(email);
      toast.success("Welcome to the community! \uD83C\uDDEE\uD83C\uDDEA");
      setEmail("");
    } catch (err: any) {
      toast.error(err.email?.[0] || "Failed to subscribe. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="bg-brand-900 text-brand-100 pt-20 pb-10 border-t border-brand-800">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          {/* 1. BRAND COLUMN */}
          <div className="md:col-span-1">
            <Link to="/" className="inline-block mb-6">
              <img
                src={logoImage}
                alt={"Open\u00C9ire Studios"}
                width={380}
                height={200}
                decoding="async"
                className="h-12 w-auto opacity-90 hover:opacity-100 transition-opacity"
              />
            </Link>
            <p className="text-sm leading-relaxed text-brand-100/80 mb-6">
              Capturing the raw beauty of Ireland and beyond. Premium aerial
              stock footage and fine art prints for creators and collectors.
            </p>
            <div className="flex space-x-4">
              <SocialLink href="#" label="Instagram" icon={<FaInstagram />} />
              <SocialLink href="#" label="Facebook" icon={<FaFacebook />} />
              <SocialLink href="#" label="YouTube" icon={<FaYoutube />} />
              <SocialLink href="#" label="Twitter" icon={<FaTwitter />} />
            </div>
          </div>

          {/* 2. EXPLORE LINKS */}
          <div>
            <h3 className="text-white font-serif font-bold text-lg mb-6">
              Explore
            </h3>
            <ul className="space-y-3 text-sm">
              <FooterLink to="/gallery/digital">Stock Footage</FooterLink>
              <FooterLink to="/gallery/physical">Art Prints</FooterLink>
              <FooterLink to="/blog">Journal</FooterLink>
              <FooterLink to="/about">Our Story</FooterLink>
            </ul>
          </div>

          {/* 3. SUPPORT LINKS */}
          <div>
            <h3 className="text-white font-serif font-bold text-lg mb-6">
              Support
            </h3>
            <ul className="space-y-3 text-sm">
              <FooterLink to="/contact">Contact Us</FooterLink>
              <FooterLink to="/licensing">
                Licensing Agreement (EULA)
              </FooterLink>
              <FooterLink to="/terms">Terms & Conditions</FooterLink>
              <FooterLink to="/privacy">Privacy & Cookie Policy</FooterLink>
              <FooterLink to="/shipping">Shipping Policy</FooterLink>
              <FooterLink to="/refunds">Refund & Return Policy</FooterLink>
            </ul>
          </div>

          {/* 4. NEWSLETTER */}
          <div>
            <h3 className="text-white font-serif font-bold text-lg mb-4">
              Stay Connected
            </h3>
            <p className="text-sm text-brand-100/80 mb-4">
              Join our community for exclusive discounts and new location drops.
            </p>
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@example.com"
                required
                className="w-full px-4 py-3 bg-brand-800 border border-paper rounded-lg text-white placeholder-paper/50 focus:outline-none focus:ring-1 focus:ring-accent transition-all"
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-accent hover:bg-accent-hover text-brand-900 font-bold py-3 px-4 rounded-lg transition-colors shadow-lg shadow-black/20"
              >
                {loading ? "Subscribing..." : "Subscribe"}
              </button>
            </form>
          </div>
        </div>

        {/* BOTTOM BAR */}
        <div className="border-t border-brand-800 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-brand-100/80">
          <div className="text-center md:text-left">
            <p>
              &copy; {new Date().getFullYear()} Open{"\u00C9"}ire Studios. All rights
              reserved.
              <span className="hidden md:inline"> {"\u2022"} </span>
              <span className="block md:inline mt-1 md:mt-0">
                Designed with {"\u2618\uFE0F"} by
                <a
                  href="https://missbott.online"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand-100 hover:text-accent font-medium transition-colors duration-300"
                >
                  {" "}
                  Miss Bott
                </a>
              </span>
            </p>
            <p className="mt-2 text-[10px] text-brand-100/90 max-w-2xl mx-auto uppercase tracking-wider leading-relaxed">
              Art prints are sold for personal display only and do not include
              reproduction rights. Digital media is Rights-Managed and subject
              to strict commercial licensing terms.
              <Link
                to="/licensing"
                className="ml-1 underline text-white hover:text-accent"
              >
                View Licensing Terms
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

// Helper Components for clean code
const FooterLink: React.FC<{ to: string; children: React.ReactNode }> = ({
  to,
  children,
}) => (
  <li>
    <Link
      to={to}
      className="text-brand-100/80 hover:text-accent transition-colors duration-200 block hover:translate-x-1 transform"
    >
      {children}
    </Link>
  </li>
);

const SocialLink: React.FC<{
  href: string;
  label: string;
  icon: React.ReactNode;
}> = ({
  href,
  label,
  icon,
}) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    aria-label={label}
    title={label}
    className="h-10 w-10 rounded-full bg-brand-800 flex items-center justify-center text-white hover:bg-accent hover:text-brand-900 transition-all duration-300"
  >
    {icon}
  </a>
);

export default Footer;
