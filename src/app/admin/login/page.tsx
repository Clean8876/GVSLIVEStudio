import type { Metadata } from "next";
import { AdminLoginPage } from "@/features/auth/components/AdminLoginPage";

export const metadata: Metadata = { title: "Admin sign in", robots: { index: false, follow: false } };

export default function Page() {
  return <AdminLoginPage />;
}
