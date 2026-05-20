import { AuthForm } from "@/components/auth-form";

export default function LoginPage() {
  return (
    <main className="grid min-h-screen place-items-center px-6">
      <section className="w-full max-w-md rounded-xl border border-white/10 bg-[#111111] p-6">
        <h1 className="text-2xl font-semibold text-white">Sign in to Announcements</h1>
        <p className="mt-2 text-sm text-zinc-500">
          Enter your phone number. We will text you a one-time code. New numbers create a workspace automatically.
        </p>
        <div className="mt-6">
          <AuthForm />
        </div>
      </section>
    </main>
  );
}
