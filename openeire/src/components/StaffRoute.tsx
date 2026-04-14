import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface StaffRouteProps {
  children: React.ReactElement;
}

const StaffRoute: React.FC<StaffRouteProps> = ({ children }) => {
  const { isAuthenticated, user, refreshUser } = useAuth();
  const location = useLocation();
  const [isCheckingAccess, setIsCheckingAccess] = useState(false);

  useEffect(() => {
    if (!isAuthenticated || user) {
      setIsCheckingAccess(false);
      return;
    }

    let isMounted = true;
    setIsCheckingAccess(true);

    refreshUser().finally(() => {
      if (isMounted) {
        setIsCheckingAccess(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [isAuthenticated, user, refreshUser]);

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (isCheckingAccess) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="animate-pulse text-gray-500 font-medium tracking-widest uppercase">
          Checking access...
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!user.is_staff) {
    return <Navigate to="/403" replace />;
  }

  return children;
};

export default StaffRoute;
