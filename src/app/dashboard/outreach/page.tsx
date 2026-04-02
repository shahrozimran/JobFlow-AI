"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  Send,
  X,
  Briefcase,
  Users,
  Clock,
  Sparkles,
  Loader2,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
} from "lucide-react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";

interface OutreachLog {
  id: string;
  user_id: string;
  company: string;
  target_role: string;
  contact_email: string | null;
  subject: string;
  body: string;
  status: "draft" | "sent";
  created_at: string;
  sent_at: string | null;
}

export default function OutreachPage() {
  const supabase = createClient();

  const [logs, setLogs] = useState<OutreachLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modal / Generation State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Draft Data State
  const [draftId, setDraftId] = useState<string | null>(null);
  const [targetRole, setTargetRole] = useState("");
  const [company, setCompany] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [emailSubject, setEmailSubject] = useState("");
  const [emailBody, setEmailBody] = useState("");

  useEffect(() => {
    fetchLogs();
    
    // Check if coming from Resume Workspace
    const storedContext = sessionStorage.getItem("jobflow_outreach_context");
    if (storedContext) {
      try {
        const { targetRole, company, jobDescription, resumeContent } = JSON.parse(storedContext);
        setTargetRole(targetRole || "");
        setCompany(company || "");
        
        // Open modal and immediately start generation
        setIsModalOpen(true);
        generateOutreach(company, targetRole, jobDescription, resumeContent);
        
        sessionStorage.removeItem("jobflow_outreach_context");
      } catch (e) {
        console.error("Context parse error", e);
      }
    }
  }, []);

  const fetchLogs = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("outreach_logs")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setLogs(data || []);
    } catch (error) {
      toast.error("Failed to load outreach history.");
    } finally {
      setIsLoading(false);
    }
  };

  const generateOutreach = async (
    targetCompany: string,
    role: string,
    jobDescription?: string,
    resumeContent?: string
  ) => {
    setIsGenerating(true);
    setContactEmail("");
    
    try {
      const res = await fetch("/api/outreach/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          company: targetCompany,
          targetRole: role,
          jobDescription,
          resumeContent,
        }),
      });

      if (!res.ok) throw new Error("Failed to generate outreach");

      const data = await res.json();
      
      setEmailSubject(data.subject);
      setEmailBody(data.body);
      
      if (data.contact_email) {
        setContactEmail(data.contact_email);
      }
      if (data.id) {
        setDraftId(data.id);
        fetchLogs(); // Reload list to show the new draft
      }
      
      toast.success("Outreach email drafted successfully!");
    } catch (error) {
      toast.error("Failed to generate outreach email.");
      setIsModalOpen(false);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleMarkAsSent = async (id: string) => {
    try {
      const { error } = await supabase
        .from("outreach_logs")
        .update({ status: "sent", sent_at: new Date().toISOString() })
        .eq("id", id);
        
      if (error) throw error;
      fetchLogs();
      setIsModalOpen(false);
      toast.success("Marked as sent!");
    } catch (error) {
      toast.error("Failed to update status.");
    }
  };

  const openDraft = (log: OutreachLog) => {
    setDraftId(log.id);
    setCompany(log.company);
    setTargetRole(log.target_role);
    setContactEmail(log.contact_email || "");
    setEmailSubject(log.subject);
    setEmailBody(log.body);
    setIsModalOpen(true);
  };

  const sendWithGmail = () => {
    if (!contactEmail.trim()) {
      toast.error("Please enter a contact email address first.");
      return;
    }

    // Opens a secure native Gmail composer tab pre-filled with the data
    const url = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
      contactEmail
    )}&su=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(
      emailBody
    )}`;
    
    window.open(url, "_blank");
    
    toast.success("Opened in Gmail! Once you send it, mark it as sent here.");
  };

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto space-y-6 animate-in fade-in duration-500 pb-16">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Outreach Hub</h1>
          <p className="text-muted-foreground mt-1">
            Generate and manage personalized networking and cold emails.
          </p>
        </div>
        <button
          onClick={() => {
            setDraftId(null);
            setCompany("");
            setTargetRole("");
            setContactEmail("");
            setEmailSubject("");
            setEmailBody("");
            setIsModalOpen(true);
          }}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity gap-2 flex items-center"
        >
          <Mail className="w-4 h-4" /> New Outreach
        </button>
      </div>

      <div className="space-y-4 pt-4">
        <h3 className="font-semibold px-1">Recent Outreach</h3>
        
        {isLoading ? (
          <div className="flex justify-center p-8">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        ) : logs.length === 0 ? (
          <div className="text-center py-16 border-2 border-dashed border-border/40 rounded-2xl">
            <Mail className="w-10 h-10 text-muted-foreground/40 mx-auto mb-3" />
            <h3 className="font-semibold text-foreground mb-1">No outreach yet</h3>
            <p className="text-sm text-muted-foreground">Generate a resume and click "Write Outreach Email" to start.</p>
          </div>
        ) : (
          <div className="grid gap-3">
            {logs.map((log, i) => (
              <motion.div
                key={log.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="rounded-xl bg-card border border-border/40 p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:shadow-sm transition-shadow"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1.5">
                    <h3 className="font-semibold text-foreground truncate">
                      {log.target_role} at {log.company}
                    </h3>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-wider ${
                        log.status === "sent"
                          ? "bg-emerald-500/10 text-emerald-600"
                          : "bg-amber-500/10 text-amber-600"
                      }`}
                    >
                      {log.status}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <Briefcase className="w-3.5 h-3.5" />
                      {log.company}
                    </span>
                    {log.contact_email && (
                      <span className="flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5" />
                        {log.contact_email}
                      </span>
                    )}
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      {new Date(log.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => openDraft(log)}
                  className="w-full sm:w-auto flex justify-center items-center gap-2 px-5 py-2.5 rounded-xl bg-secondary text-secondary-foreground text-sm font-semibold hover:bg-muted transition-colors flex-shrink-0"
                >
                  {log.status === "sent" ? "View Email" : "Continue Draft"}
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Outreach Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-background/60 backdrop-blur-sm"
              onClick={() => !isGenerating && setIsModalOpen(false)}
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-2xl bg-card border border-border shadow-2xl rounded-2xl flex flex-col z-10 overflow-hidden"
              style={{ maxHeight: "calc(100vh - 4rem)" }}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-border/40 bg-muted/20 shrink-0">
                <div className="flex items-center gap-2 text-foreground font-semibold">
                  <Sparkles className="w-4 h-4 text-primary" />
                  {isGenerating ? "AI is drafting your email..." : "Outreach Draft"}
                </div>
                {!isGenerating && (
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Content */}
              <div className="p-6 overflow-y-auto space-y-5">
                {isGenerating ? (
                  <div className="py-20 flex flex-col items-center justify-center text-center space-y-4">
                    <div className="relative">
                      <div className="w-16 h-16 border-[3px] border-muted rounded-full border-t-primary animate-spin" />
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <Mail className="w-5 h-5 text-primary animate-pulse" />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">Crafting your cover letter</h3>
                      <p className="text-sm text-muted-foreground">Reading your resume and analyzing the target role.</p>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">
                          Target Role
                        </label>
                        <input
                          type="text"
                          value={targetRole}
                          onChange={(e) => setTargetRole(e.target.value)}
                          placeholder="e.g. Frontend Engineer"
                          className="w-full text-sm bg-muted/40 border border-border/60 rounded-lg px-3 py-2.5 outline-none focus:border-primary/50"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">
                          Company
                        </label>
                        <input
                          type="text"
                          value={company}
                          onChange={(e) => setCompany(e.target.value)}
                          placeholder="e.g. Stripe"
                          className="w-full text-sm bg-muted/40 border border-border/60 rounded-lg px-3 py-2.5 outline-none focus:border-primary/50"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-primary" /> Contact Email
                      </label>
                      <input
                        type="email"
                        value={contactEmail}
                        onChange={(e) => setContactEmail(e.target.value)}
                        placeholder={contactEmail ? "" : "No email detected. Enter HR/Recruiter email here..."}
                        className={`w-full text-sm bg-muted/40 border ${!contactEmail ? 'border-amber-500/50 focus:border-amber-500' : 'border-border/60 focus:border-primary/50'} rounded-lg px-3 py-2.5 outline-none`}
                      />
                      {!contactEmail && (
                        <p className="text-[11px] text-amber-600 mt-1.5 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" /> An email address is required to send via Gmail.
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">
                        Subject Line
                      </label>
                      <input
                        type="text"
                        value={emailSubject}
                        onChange={(e) => setEmailSubject(e.target.value)}
                        className="w-full text-sm font-medium bg-muted/40 border border-border/60 rounded-lg px-3 py-2.5 outline-none focus:border-primary/50"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">
                        Email Body
                      </label>
                      <textarea
                        value={emailBody}
                        onChange={(e) => setEmailBody(e.target.value)}
                        className="w-full h-56 text-sm bg-muted/40 border border-border/60 rounded-lg px-3 py-3 outline-none focus:border-primary/50 resize-none leading-relaxed"
                      />
                    </div>
                    
                    {!draftId && targetRole && company && (
                      <div className="flex justify-end pt-2">
                         <button
                           onClick={() => generateOutreach(company, targetRole)}
                           className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg text-xs font-semibold hover:bg-muted transition-colors"
                         >
                           Re-generate AI Draft
                         </button>
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Footer */}
              {!isGenerating && (
                <div className="px-6 py-4 border-t border-border/40 bg-muted/10 shrink-0 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    {draftId && (
                      <button
                        onClick={() => handleMarkAsSent(draftId)}
                        className="px-4 py-2.5 text-sm font-semibold rounded-xl border border-border/60 bg-card hover:bg-muted transition-colors flex items-center gap-1.5 text-foreground"
                      >
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        Mark as Sent
                      </button>
                    )}
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => setIsModalOpen(false)}
                      className="px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-muted transition-colors"
                    >
                      Close
                    </button>
                    <button
                      onClick={sendWithGmail}
                      disabled={!contactEmail.trim()}
                      className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      <ExternalLink className="w-4 h-4" /> Open in Gmail
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
