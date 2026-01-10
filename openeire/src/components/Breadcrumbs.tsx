import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useBreadcrumb } from "../context/BreadcrumbContext";

const Breadcrumbs = () => {
  const location = useLocation();
  const { titles } = useBreadcrumb();

  // 1. Don't show breadcrumbs on the Homepage
  if (location.pathname === "/") return null;

  const state = location.state as { from?: { pathname: string } } | null;
  const isGatePage = location.pathname === "/gallery-gate";

  const pathSource =
    isGatePage && state?.from ? state.from.pathname : location.pathname;

  const pathnames = pathSource.split("/").filter((x) => x);

  const nameMap: { [key: string]: string } = {
    gallery: "Gallery",
    physical: "Art Prints",
    digital: "Stock Footage",
    photo: "Stock Footage",
    video: "Stock Footage",
    bag: "Shopping Bag",
    checkout: "Checkout",
    "checkout-success": "Order Confirmed",
    profile: "My Profile",
    login: "Login",
    register: "Sign Up",
    blog: "Blog",
    contact: "Contact Us",
    "gallery-gate": "Private Access",
    "verify-pending": "Verification Pending",
  };

  return (
    <nav
      className="bg-gray-50 border-b border-gray-200 w-full"
      aria-label="Breadcrumb"
    >
      <div className="container mx-auto px-4 py-3">
        <ol className="list-reset flex flex-wrap text-gray-600 text-sm font-sans">
          {/* Home Link */}
          <li>
            <Link
              to="/"
              className="hover:text-primary transition-colors flex items-center"
            >
              <svg
                className="w-4 h-4 mr-1 mb-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
              Home
            </Link>
          </li>

          {/* Path Segments */}
          {pathnames.map((value, index) => {
            // Reconstruct the full path for this segment (e.g., "/gallery/physical/5")
            const to = `/${pathnames.slice(0, index + 1).join("/")}`;
            const isLast = index === pathnames.length - 1;

            let displayName = titles[to] || nameMap[value] || value;

            // Fallback for IDs if no title is set yet
            if (!titles[to] && !nameMap[value] && !isNaN(Number(value))) {
              displayName = `Item #${value}`;
            }

            // Capitalize fallback
            if (!titles[to] && !nameMap[value] && isNaN(Number(value))) {
              displayName = value.charAt(0).toUpperCase() + value.slice(1);
            }

            return (
              <React.Fragment key={to}>
                <li>
                  <span className="mx-2 text-gray-400">/</span>
                </li>
                <li>
                  {isLast ? (
                    <span className="text-primary font-semibold cursor-default">
                      {displayName}
                    </span>
                  ) : (
                    <Link
                      to={to}
                      className="hover:text-primary transition-colors"
                    >
                      {displayName}
                    </Link>
                  )}
                </li>
              </React.Fragment>
            );
          })}

          {/* FINAL CRUMB FOR GATE PAGE */}
          {isGatePage && state?.from && (
            <>
              <li>
                <span className="mx-2 text-gray-400">/</span>
              </li>
              <li>
                <span className="text-primary font-semibold cursor-default">
                  Private Access
                </span>
              </li>
            </>
          )}
        </ol>
      </div>
    </nav>
  );
};

export default Breadcrumbs;
