import { redirect } from "next/navigation";

export default function ForgotPasswordPage() {
  // Phone OTP means there is no password to recover. Send the user back to
  // the sign-in page where they can request a fresh code.
  redirect("/auth/login");
}
