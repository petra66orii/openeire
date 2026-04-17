import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { trackPageView } from "../lib/analytics";

const AnalyticsListener: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    const fullPath = `${location.pathname}${location.search}${location.hash}`;
    const frameId = window.requestAnimationFrame(() => {
      trackPageView(fullPath, document.title);
    });

    return () => window.cancelAnimationFrame(frameId);
  }, [location.hash, location.pathname, location.search]);

  return null;
};

export default AnalyticsListener;
