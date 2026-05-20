import { redirect } from "next/navigation";
import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";
import { getCurrentUser } from "@/lib/auth";
import { getDashboardData } from "@/lib/data/platform";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const sessionUser = await getCurrentUser();
  if (!sessionUser) {
    redirect("/auth/login");
  }
  const { org, live } = await getDashboardData();

  return (
    <div className="min-h-screen lg:flex">
      <Sidebar org={org} />
      <div className="min-w-0 flex-1">
        <Topbar live={live} />
        <main className="mx-auto max-w-[1400px] px-4 py-8 md:px-8 md:py-10">{children}</main>
      </div>
    </div>
  );
}
