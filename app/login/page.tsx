import type { Metadata } from "next";
import { LoginView } from "@/components/auth/login-view";

export const metadata: Metadata = {
  title: "Partner & Counsel Portal Access | Med Jordan Law",
  description:
    "Restricted administrative authentication gateway for Med Jordan Law partners, advocates, and authorized practice personnel.",
};

export default function LoginPage() {
  return <LoginView />;
}
