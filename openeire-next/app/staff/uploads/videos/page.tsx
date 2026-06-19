import type { Metadata } from "next";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { StaffVideoUploadsClient } from "@/components/staff/StaffVideoUploadsClient";

export const metadata: Metadata = {
  title: "Staff Video Uploads | OpenÉire Studios",
  robots: { index: false, follow: false },
};

export default function StaffVideoUploadsPage() {
  return (
    <ProtectedRoute staffOnly>
      <StaffVideoUploadsClient />
    </ProtectedRoute>
  );
}
