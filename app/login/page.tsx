import type { Metadata } from "next";
import { LoginView } from "@/components/auth/login-view";

export const metadata: Metadata = {
  title: "Login | Med Jordan Law",
  description: "Administrative access for Med Jordan Law.",
};

export default function LoginPage() {
  return <LoginView />;
}
