import { redirect } from "next/navigation";

export default function RegisterPage() {
  // Phone OTP collapses sign-up and sign-in into a single flow. The login
  // page creates a workspace automatically on first verification.
  redirect("/auth/login");
}
