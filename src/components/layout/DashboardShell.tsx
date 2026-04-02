"use client";

import { usePathname } from "next/navigation";
import AppSidebar from "@/components/layout/AppSidebar";
import TopBar from "@/components/layout/TopBar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";

export default function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isOnboarding = pathname === "/dashboard/onboarding";

  if (isOnboarding) {
    return (
      <div className="min-h-screen bg-background overflow-hidden flex flex-col">
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <TopBar />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 pt-0">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
