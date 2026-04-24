import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const GalleryGuard = () => {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/gallery-gate" state={{ from: location }} replace />;
  }

  if (!user) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-sm font-medium uppercase tracking-[0.2em] text-gray-500">
        Checking access...
      </div>
    );
  }

  if (!user.can_access_gallery) {
    return <Navigate to="/gallery-gate" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default GalleryGuard;
