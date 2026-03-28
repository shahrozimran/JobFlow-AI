"use client";

import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, FileText, Briefcase, Mail, Settings, CreditCard, Zap, ChevronLeft, ChevronRight, History } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const navItems = [
  { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { path: "/dashboard/resume-workspace", label: "Resume AI", icon: FileText },
  { path: "/dashboard/outreach", label: "Outreach Hub", icon: Mail },
  { path: "/dashboard/activity", label: "Activity", icon: History },
  { path: "/dashboard/settings", label: "Settings", icon: Settings },
];

export default function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <motion.aside
      animate={{ width: collapsed ? 80 : 260 }}
      transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1.0] }}
      className="fixed left-0 top-0 h-screen bg-background border-r border-border/50 flex flex-col z-50 shadow-[4px_0_24px_-15px_rgba(0,0,0,0.1)]"
    >
      {/* Logo Area */}
      <div className="flex items-center gap-3 px-6 h-16 border-b border-border/30">
        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center flex-shrink-0 shadow-sm shadow-primary/20">
          <Zap className="w-4 h-4 text-primary-foreground fill-primary-foreground" />
        </div>
        <AnimatePresence>
          {!collapsed && (
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10, transition: { duration: 0.1 } }}
              className="text-foreground font-black text-lg tracking-tight whitespace-nowrap"
            >
              JobFlow AI
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const active = item.path === '/dashboard' 
            ? pathname === '/dashboard' 
            : pathname.startsWith(item.path);
            
          return (
            <button
              key={item.path}
              onClick={() => router.push(item.path)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 group ${
                active 
                  ? "bg-secondary text-foreground shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1)] ring-1 ring-border/50" 
                  : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
              }`}
            >
              <item.icon className={`w-[18px] h-[18px] flex-shrink-0 transition-colors ${active ? "text-primary" : "text-muted-foreground group-hover:text-foreground"}`} />
              <AnimatePresence>
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "auto" }}
                    exit={{ opacity: 0, width: 0 }}
                    className="whitespace-nowrap overflow-hidden"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          );
        })}
      </nav>

      {/* Credit Summary Box */}
      <AnimatePresence>
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="mx-4 mb-4 p-4 rounded-xl bg-secondary/30 border border-border/50 shadow-sm"
          >
            <div className="flex items-center gap-2 mb-3">
              <CreditCard className="w-3.5 h-3.5 text-muted-foreground" />
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Credits</span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-black tracking-tighter text-foreground">145</span>
              <span className="text-xs font-bold text-muted-foreground">/ 200</span>
            </div>
            <div className="w-full h-1.5 bg-background border border-border/50 rounded-full mt-3 overflow-hidden">
              <div className="h-full bg-primary rounded-full" style={{ width: "72%" }} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Collapse Toggle Handle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="flex items-center justify-center h-12 border-t border-border/30 text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors"
        aria-label="Toggle Sidebar"
      >
        {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
      </button>
    </motion.aside>
  );
}
