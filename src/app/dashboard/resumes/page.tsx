"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  Plus,
  Search,
  Trash2,
  Download,
  Edit3,
  Clock,
  CheckCircle2,
  FileCheck,
  Layers,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  getResumes,
  getResumeById,
  deleteResume,
  getResumeStatsFromList,
  GeneratedResume,
} from "@/lib/resume-store";


export default function MyResumesPage() {
  const router = useRouter();
  const [resumes, setResumes] = useState<GeneratedResume[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [exportingId, setExportingId] = useState<string | null>(null);

  useEffect(() => {
    loadResumes();
  }, []);

  const loadResumes = async () => {
    setLoading(true);
    const data = await getResumes();
    setResumes(data);
    setLoading(false);
  };

  const stats = getResumeStatsFromList(resumes);

  const filteredResumes = resumes.filter((r) => {
    const q = searchQuery.toLowerCase();
    return (
      r.targetRole.toLowerCase().includes(q) ||
      r.company.toLowerCase().includes(q) ||
      r.optimizationType.toLowerCase().includes(q)
    );
  });

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    const success = await deleteResume(id);
    if (success) {
      setResumes((prev) => prev.filter((r) => r.id !== id));
      toast.success("Resume deleted");
    } else {
      toast.error("Failed to delete resume");
    }
    setDeletingId(null);
  };

  const handleExport = async (resume: GeneratedResume) => {
    setExportingId(resume.id);
    try {
      let content = resume.generatedContent;
      if (!content) {
        const fullResume = await getResumeById(resume.id);
        if (!fullResume || !fullResume.generatedContent) {
          throw new Error("No content payload found");
        }
        content = fullResume.generatedContent;
      }

      const data = JSON.parse(content);
      const { pdf } = await import("@react-pdf/renderer");
      const { AtsPdfTemplate } = await import("@/components/resume-templates/AtsPdfTemplate");
      
      let pdfComponent = <AtsPdfTemplate data={data} />;
      if (
        resume.optimizationType === "creative" &&
        resume.templateId === "modern-split"
      ) {
        const { ModernSplitPdfTemplate } = await import("@/components/resume-templates/ModernSplitPdfTemplate");
        pdfComponent = <ModernSplitPdfTemplate data={data} />;
      }
      const rawBlob = await pdf(pdfComponent).toBlob();
      // Ensure the blob has the correct MIME type for PDF
      const pdfBlob = new Blob([rawBlob], { type: "application/pdf" });
      const url = URL.createObjectURL(pdfBlob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `JobFlow_Resume_${resume.targetRole.replace(/\s+/g, "_")}.pdf`;
      link.type = "application/pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      toast.success("Resume exported!");
    } catch (err) {
      console.error("PDF export error:", err);
      toast.error("Failed to export resume.");
    } finally {
      setExportingId(null);
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            My Resumes
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            View, edit, and manage all your AI-generated resumes.
          </p>
        </div>
        <Button
          onClick={() => router.push("/dashboard/resume-workspace")}
          className="gap-2 rounded-xl shadow-sm px-6"
        >
          <Plus className="w-4 h-4" />
          Create New Resume
        </Button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total", value: stats.totalResumes, icon: FileText },
          {
            label: "Avg ATS Score",
            value: stats.avgAtsScore > 0 ? `${stats.avgAtsScore}%` : "—",
            icon: CheckCircle2,
          },
          { label: "ATS", value: stats.atsResumes, icon: FileCheck },
          { label: "Visual", value: stats.creativeResumes, icon: Layers },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="p-4 rounded-xl bg-card border border-border/40 hover:border-border/60 transition-all"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                {stat.label}
              </span>
              <stat.icon className="w-4 h-4 text-muted-foreground/50" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-foreground">
              {stat.value}
            </span>
          </motion.div>
        ))}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search by role, company, or type…"
          className="pl-11 h-11 rounded-xl bg-muted/30 border-border/50 text-sm"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Resume Cards */}
      <div className="space-y-4">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground mb-4" />
            <p className="text-sm text-muted-foreground">
              Loading your resumes…
            </p>
          </div>
        ) : filteredResumes.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-20 bg-muted/20 rounded-xl border border-dashed border-border/50"
          >
            <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center mb-4">
              <FileText className="w-7 h-7 text-muted-foreground/30" />
            </div>
            <h3 className="text-lg font-semibold text-foreground">
              {searchQuery ? "No matching resumes" : "No resumes yet"}
            </h3>
            <p className="text-sm text-muted-foreground max-w-sm mt-2 text-center">
              {searchQuery
                ? "Try adjusting your search query."
                : "Create your first AI-optimized resume to get started."}
            </p>
            {!searchQuery && (
              <Button
                onClick={() => router.push("/dashboard/resume-workspace")}
                className="mt-6 gap-2 rounded-xl"
              >
                <Plus className="w-4 h-4" />
                Create Resume
              </Button>
            )}
          </motion.div>
        ) : (
          <AnimatePresence mode="popLayout">
            {filteredResumes.map((resume, index) => (
              <motion.div
                key={resume.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ delay: index * 0.03 }}
                className="group p-5 rounded-xl bg-card border border-border/40 hover:border-border/60 hover:shadow-sm transition-all"
              >
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div
                    className={cn(
                      "w-11 h-11 rounded-xl flex items-center justify-center shrink-0",
                      resume.optimizationType === "ats"
                        ? "bg-foreground/5 text-foreground"
                        : "bg-primary/10 text-primary"
                    )}
                  >
                    {resume.optimizationType === "ats" ? (
                      <FileCheck className="w-5 h-5" />
                    ) : (
                      <Layers className="w-5 h-5" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-sm text-foreground truncate">
                          {resume.targetRole}
                        </h3>
                        {resume.atsScore !== null && (
                          <span className="text-[10px] font-semibold uppercase tracking-wider bg-foreground/5 px-2 py-0.5 rounded text-foreground/70">
                            ATS {resume.atsScore}%
                          </span>
                        )}
                      </div>
                      <span
                        className={cn(
                          "text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded",
                          resume.optimizationType === "ats"
                            ? "bg-muted text-muted-foreground"
                            : "bg-primary/10 text-primary"
                        )}
                      >
                        {resume.optimizationType === "ats"
                          ? "ATS"
                          : "Visual"}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mb-3">
                      {resume.company ? `${resume.company} · ` : ""}
                      {formatDate(resume.createdAt)}
                    </p>

                    {/* Actions */}
                    <div className="flex items-center gap-2 flex-wrap">
                      <Button
                        size="sm"
                        variant="outline"
                        className="gap-1.5 rounded-lg text-xs h-8"
                        onClick={() =>
                          router.push(`/dashboard/resumes/${resume.id}`)
                        }
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        Open & Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="gap-1.5 rounded-lg text-xs h-8"
                        onClick={() => handleExport(resume)}
                        disabled={exportingId === resume.id}
                      >
                        <Download
                          className={cn(
                            "w-3.5 h-3.5",
                            exportingId === resume.id && "animate-bounce"
                          )}
                        />
                        {exportingId === resume.id
                          ? "Exporting…"
                          : "Export PDF"}
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="gap-1.5 rounded-lg text-xs h-8 text-destructive hover:bg-destructive/10 hover:text-destructive"
                        onClick={() => handleDelete(resume.id)}
                        disabled={deletingId === resume.id}
                      >
                        {deletingId === resume.id ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Trash2 className="w-3.5 h-3.5" />
                        )}
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>

      {/* Footer count */}
      {!loading && filteredResumes.length > 0 && (
        <div className="flex justify-center">
          <p className="text-xs text-muted-foreground">
            Showing {filteredResumes.length} of {resumes.length} resumes
          </p>
        </div>
      )}
    </div>
  );
}
