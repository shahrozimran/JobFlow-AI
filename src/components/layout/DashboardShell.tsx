"use client";

import { usePathname } from "next/navigation";
import AppSidebar from "@/components/layout/AppSidebar";
import TopBar from "@/components/layout/TopBar";

export default function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isOnboarding = pathname === "/dashboard/onboarding";

  if (isOnboarding) {
    return (
     <div className="min-h-screen bg-background overflow-hidden flex flex-col">
       <main className="flex-1 overflow-y-auto">
         {children}
       </main>
     </div>
    );
  }

  return (
    <div className="min-h-screen bg-background overflow-hidden flex">
      <AppSidebar />
      <div className="flex-1 flex flex-col md:ml-[260px] transition-all duration-300 h-screen overflow-hidden">
        <TopBar />
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
