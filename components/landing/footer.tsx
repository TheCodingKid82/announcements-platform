import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-white/10 px-6 py-10">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 text-sm text-zinc-500 md:flex-row md:items-center md:justify-between">
        <span>Built by Vertigo Apps</span>
        <div className="flex gap-5">
          <Link href="/auth/login" className="hover:text-white">Sign in</Link>
        </div>
      </div>
    </footer>
  );
}
