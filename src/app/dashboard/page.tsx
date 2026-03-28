"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Search, Filter, ArrowUpDown, MoreHorizontal, 
  FileText, CheckCircle2, Clock, Zap, Download
} from "lucide-react";
import { ResumeCreationModal } from "@/components/ResumeCreationModal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// Dummy data matching Image 2 table layout intent
const tableData = [
  { id: 1, target: "Senior Frontend Engineer", company: "Stripe", status: "Active", optimization: "ATS", score: "88%", start: "28 Mar 2026", end: "Forever" },
  { id: 2, target: "Full Stack Developer", company: "Vercel", status: "Active", optimization: "ATS", score: "92%", start: "28 Mar 2026", end: "10 Jun 2026" },
  { id: 3, target: "React Developer", company: "Linear", status: "Draft", optimization: "Non-ATS", score: "—", start: "25 Mar 2026", end: "10 Jun 2026" },
  { id: 4, target: "Software Engineer II", company: "Notion", status: "Complete", optimization: "ATS", score: "95%", start: "20 Mar 2026", end: "10 Jun 2026" },
  { id: 5, target: "Frontend Architect", company: "Airbnb", status: "Active", optimization: "ATS", score: "81%", start: "18 Mar 2026", end: "Forever" },
  { id: 6, target: "UI Engineer", company: "Figma", status: "Active", optimization: "Non-ATS", score: "—", start: "15 Mar 2026", end: "10 Jun 2026" },
  { id: 7, target: "Creative Developer", company: "Apple", status: "Draft", optimization: "Non-ATS", score: "—", start: "10 Mar 2026", end: "Forever" },
  { id: 8, target: "Web Developer", company: "Shopify", status: "Complete", optimization: "ATS", score: "89%", start: "05 Mar 2026", end: "10 Jun 2026" },
];

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("All");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredData = activeTab === "All" 
    ? tableData 
    : tableData.filter(item => item.status === activeTab);

  return (
    <div className="min-h-[calc(100vh-4rem)] p-6 md:p-10 bg-background text-foreground animate-in fade-in duration-500">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Resumes</h1>
          <p className="text-sm text-muted-foreground mt-1">Application Status and Target Matches</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2 bg-background border-border shadow-sm">
            <Download className="w-4 h-4" /> Export
          </Button>
          <Button onClick={() => setIsModalOpen(true)} className="bg-primary text-primary-foreground shadow-sm px-6">
            Create resume
          </Button>
        </div>
      </div>

      {/* Controls Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        {/* Tabs */}
        <div className="flex p-1 bg-secondary/30 border border-border/50 rounded-xl overflow-hidden self-start">
          {["All", "Active", "Complete", "Draft"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2 text-sm font-semibold rounded-lg transition-all ${
                activeTab === tab 
                  ? "bg-background text-foreground shadow-sm" 
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/40"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Filters & Search */}
        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2 bg-background border-border/60 text-muted-foreground hover:text-foreground">
            <Filter className="w-4 h-4" /> Filters
          </Button>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search..." 
              className="w-64 pl-9 pr-4 py-2 text-sm rounded-lg border border-border/60 bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium placeholder:font-normal"
            />
          </div>
          <Button variant="outline" className="gap-2 bg-background border-border/60 text-muted-foreground hover:text-foreground">
            <ArrowUpDown className="w-4 h-4" /> Sort order
          </Button>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-background border border-border/60 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left whitespace-nowrap">
            <thead className="text-xs text-muted-foreground uppercase tracking-widest bg-secondary/20 border-b border-border/60 font-bold">
              <tr>
                <th className="px-6 py-4 font-semibold w-12">
                  <input type="checkbox" className="rounded border-border/50 bg-background text-primary focus:ring-primary" />
                </th>
                <th className="px-6 py-4 font-semibold">Target Role</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold">Optimization</th>
                <th className="px-6 py-4 font-semibold">Fit Score</th>
                <th className="px-6 py-4 font-semibold">Created Date</th>
                <th className="px-6 py-4 font-semibold">Expiry</th>
                <th className="px-6 py-4 font-semibold w-12"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {filteredData.map((row, idx) => (
                <motion.tr 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  key={row.id} 
                  className="hover:bg-secondary/20 transition-colors group cursor-pointer"
                >
                  <td className="px-6 py-4">
                    <input type="checkbox" className="rounded border-border/50 bg-background text-primary focus:ring-primary cursor-pointer" />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center font-bold text-foreground text-xs font-serif uppercase tracking-widest">
                        {row.company.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-foreground">{row.target}</p>
                        <p className="text-xs text-muted-foreground">{row.company}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                      row.status === 'Active' ? 'bg-primary/10 text-primary border border-primary/20' :
                      row.status === 'Complete' ? 'bg-success/10 text-success border border-success/20' :
                      'bg-muted/40 text-muted-foreground border border-border'
                    }`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${
                        row.status === 'Active' ? 'bg-primary animate-pulse' :
                        row.status === 'Complete' ? 'bg-success' :
                        'bg-muted-foreground border border-background'
                      }`} />
                      {row.status}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-foreground font-medium">
                    {row.optimization === 'ATS' ? (
                      <span className="flex items-center gap-1">
                        <FileText className="w-3.5 h-3.5 text-muted-foreground" /> ATS Parser
                      </span>
                    ) : (
                      <span className="flex items-center gap-1">
                        <Zap className="w-3.5 h-3.5 text-gold" /> Visual Design
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-foreground font-semibold font-mono tracking-tight">
                    {row.score}
                  </td>
                  <td className="px-6 py-4 text-muted-foreground text-sm">
                    {row.start}
                  </td>
                  <td className="px-6 py-4 text-muted-foreground text-sm">
                    {row.end}
                  </td>
                  <td className="px-6 py-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-1.5 hover:bg-secondary rounded-md text-muted-foreground transition-colors">
                      <MoreHorizontal className="w-5 h-5" />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination/Footer */}
        <div className="px-6 py-4 border-t border-border/40 flex items-center justify-between text-sm text-muted-foreground font-medium bg-secondary/10">
          <div>
            1-10 of 240 • Results per page <select className="bg-background border border-border rounded px-2 py-1 ml-1 outline-none font-bold text-foreground shadow-sm"><option>10</option></select>
          </div>
          <div className="flex gap-2">
            <button className="px-3 py-1.5 rounded border border-border bg-background hover:bg-secondary transition-colors">&lt;</button>
            <span className="px-4 py-1.5 rounded text-foreground font-bold shadow-sm border border-border">1 / 9</span>
            <button className="px-3 py-1.5 rounded border border-border bg-background hover:bg-secondary transition-colors">&gt;</button>
          </div>
        </div>
      </div>

      <ResumeCreationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
