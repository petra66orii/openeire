import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const GalleryGuard = () => {
  // 1. Check local storage for the ticket
  const storedSession = localStorage.getItem("gallery_access");

  if (!storedSession) {
    // No ticket? Go to the Gate.
    return <Navigate to="/gallery-gate" replace />;
  }

  // 2. Check expiration (Optional but recommended)
  const { expiresAt } = JSON.parse(storedSession);
  const now = new Date();
  const expiration = new Date(expiresAt);

  if (now > expiration) {
    // Ticket expired? Clear it and kick them out.
    localStorage.removeItem("gallery_access");
    return <Navigate to="/gallery-gate" replace />;
  }

  // 3. Valid ticket? Let them in.
  return <Outlet />;
};

export default GalleryGuard;
