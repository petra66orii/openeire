"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { useAuth } from "@/components/auth/AuthProvider";

export function ProtectedRoute({
  children,
  staffOnly = false,
}: {
  children: ReactNode;
  staffOnly?: boolean;
}) {
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isLoading) return;

    const currentPath = `${pathname}${window.location.search}`;

    if (!isAuthenticated) {
      router.replace(`/login?next=${encodeURIComponent(currentPath)}`);
      return;
    }

    if (staffOnly && !user?.is_staff) {
      router.replace("/403");
    }
  }, [isAuthenticated, isLoading, pathname, router, staffOnly, user]);

  if (isLoading || !isAuthenticated || (staffOnly && !user?.is_staff)) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center bg-black text-gray-500">
        <div className="animate-pulse font-medium uppercase tracking-widest">
          Checking access...
        </div>
      </div>
    );
  }

  return children;
}
