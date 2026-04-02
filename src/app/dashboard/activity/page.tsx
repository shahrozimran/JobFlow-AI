"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  History, 
  Search, 
  Filter, 
  Check, 
  Clock, 
  Briefcase, 
  FileText, 
  Shield, 
  ChevronRight,
  TrendingUp,
  Zap,
  CreditCard,
  ArrowUpRight,
  ArrowDownRight,
  Loader2,
  User
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { getResumes } from "@/lib/resume-store";
import { getProfile } from "@/lib/profile-store";

const categories = ["All", "Resume", "Profile"];

const creditStats = [
  { label: "Active Plans", value: "Pro", sub: "Unlimited Resumes", icon: Zap, color: "text-gold" },
  { label: "Storage", value: "Cloud", sub: "Encrypted & Synced", icon: Shield, color: "text-primary" },
  { label: "ATS Scans", value: "Unlimited", sub: "Included in plan", icon: FileText, color: "text-success" },
];

export default function ActivityPage() {
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    async function loadActivityData() {
      setLoading(true);
      const [resumes, profile] = await Promise.all([getResumes(), getProfile()]);
      
      const mappedActivities: any[] = [];
      
      // Map resumes to activities
      resumes.forEach((r) => {
        mappedActivities.push({
          id: r.id,
          title: `Resume Generated: ${r.targetRole}`,
          description: `Successfully generated a ${r.optimizationType === 'ats' ? 'high-ATS' : 'visual'} optimized resume${r.company ? ` for ${r.company}` : ''}.`,
          dateObject: new Date(r.createdAt),
          time: new Date(r.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          date: new Date(r.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
          unread: false,
          category: "Resume",
          type: "success"
        });
      });

      // Add profile interaction as an activity if it has been updated recently
      if (profile.lastUpdated) {
        mappedActivities.push({
          id: "profile-update",
          title: "Profile Data Saved",
          description: "Your master profile configuration was saved and synchronized.",
          dateObject: new Date(profile.lastUpdated),
          time: new Date(profile.lastUpdated).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          date: new Date(profile.lastUpdated).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
          unread: false,
          category: "Profile",
          type: "info"
        });
      }

      // Sort newest first
      mappedActivities.sort((a, b) => b.dateObject.getTime() - a.dateObject.getTime());

      setActivities(mappedActivities);
      setLoading(false);
    }
    
    loadActivityData();
  }, []);

  const filteredActivities = activities.filter(activity => {
    const matchesSearch = activity.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         activity.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === "All" || activity.category === activeCategory;
    return matchesSearch && matchesCategory;
  });


  const getIcon = (category: string) => {
    switch (category) {
      case "Resume": return <FileText className="w-4 h-4" />;
      case "Profile": return <User className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto space-y-8 pb-20 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Activity History
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Detailed log of your activities and credit consumption.</p>
        </div>
        <Button variant="outline" className="gap-2 rounded-xl h-10 self-start md:self-auto border-border/50">
          <Filter className="w-4 h-4" />
          More Filters
        </Button>
      </div>

      {/* Credit Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {creditStats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="p-5 rounded-xl bg-card border border-border/40 hover:border-border/60 hover:shadow-sm transition-all flex items-start justify-between"
          >
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-1">{stat.label}</p>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold tracking-tight text-foreground">{stat.value}</span>
                <span className="text-xs text-muted-foreground">{stat.sub}</span>
              </div>
            </div>
            <div className={cn("w-8 h-8 rounded-lg bg-muted flex items-center justify-center", stat.color)}>
              <stat.icon className="w-4 h-4" />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col gap-4 mb-2">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Search transactions, activities, keywords..." 
            className="pl-11 h-11 rounded-xl bg-muted/30 border-border/50 text-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                "px-4 py-2 rounded-lg text-xs font-medium transition-all",
                activeCategory === cat
                  ? "bg-foreground text-background shadow-sm"
                  : "bg-muted/50 border border-border/30 text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Activity Feed */}
      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-muted-foreground mb-4" />
              <p className="text-sm text-muted-foreground">Loading activity history...</p>
            </div>
          ) : filteredActivities.length > 0 ? (
            filteredActivities.map((activity, index) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className={cn(
                  "group relative p-5 rounded-xl bg-card border border-border/40 hover:border-border/60 hover:shadow-sm transition-all",
                  activity.unread && "border-primary/30"
                )}
              >
                <div className="flex items-start gap-4">
                  <div className={cn(
                    "w-10 h-10 rounded-lg flex items-center justify-center shrink-0",
                    activity.type === "success" 
                      ? "bg-success/10 text-success" 
                      : "bg-primary/10 text-primary"
                  )}>
                    {getIcon(activity.category)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <h3 className={cn("font-semibold text-sm", activity.unread ? "text-foreground" : "text-muted-foreground")}>
                          {activity.title}
                        </h3>
                        {activity.unread && (
                          <span className="w-2 h-2 rounded-full bg-primary" />
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        {activity.credits !== undefined && (
                          <div className={cn(
                            "flex items-center gap-1 font-semibold text-xs px-2 py-0.5 rounded-lg",
                            activity.credits > 0 
                              ? "bg-success/10 text-success" 
                              : "bg-destructive/10 text-destructive"
                          )}>
                            {activity.credits > 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                            {Math.abs(activity.credits)}
                          </div>
                        )}
                        <span className="text-[11px] text-muted-foreground hidden sm:block">
                          {activity.date}
                        </span>
                      </div>
                    </div>
                    
                    <p className="text-sm text-muted-foreground leading-relaxed mb-2">
                      {activity.description}
                    </p>

                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        {activity.time}
                      </div>
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60 bg-muted/50 px-2 py-0.5 rounded">
                        {activity.category}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <motion.div
              className="py-16 flex flex-col items-center justify-center text-center bg-muted/20 rounded-xl border border-dashed border-border/50"
            >
              <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center mb-4">
                <Search className="w-7 h-7 text-muted-foreground/30" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">No records found</h3>
              <p className="text-sm text-muted-foreground max-w-sm mt-2">
                We couldn't find any activities matching your selection.
              </p>
              <Button 
                variant="outline" 
                className="mt-6 rounded-xl border-border/50"
                onClick={() => { setSearchQuery(""); setActiveCategory("All"); }}
              >
                Clear Filters
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {!loading && activities.length > 0 && (
        <div className="flex flex-col items-center gap-3 pt-4">
          <p className="text-xs text-muted-foreground">Showing {" "}{filteredActivities.length} logs</p>
          <Button 
            variant="ghost" 
            disabled={true}
            className="text-primary font-medium hover:bg-primary/10 rounded-xl px-8 h-10"
          >
            End of History
          </Button>
        </div>
      )}
    </div>
  );
}
