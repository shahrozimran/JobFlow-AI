// Resume data store — Supabase backend (production-ready)

export interface GeneratedResume {
  id: string;
  targetRole: string;
  company: string;
  jobDescription: string;
  optimizationType: "ats" | "creative";
  atsScore: number | null;
  status: "draft" | "active" | "complete";
  templateId?: string;
  generatedContent?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ResumeStats {
  totalResumes: number;
  avgAtsScore: number;
  atsResumes: number;
  creativeResumes: number;
  activeResumes: number;
  completedResumes: number;
}

// DB row shape (snake_case) → frontend shape (camelCase) mapping
interface DbResume {
  id: string;
  user_id: string;
  target_role: string;
  company: string | null;
  job_description: string | null;
  optimization_type: string;
  ats_score: number | null;
  status: string;
  template_id: string | null;
  generated_content: any;
  created_at: string;
  updated_at: string;
}

function mapDbToFrontend(row: DbResume): GeneratedResume {
  return {
    id: row.id,
    targetRole: row.target_role,
    company: row.company || "",
    jobDescription: row.job_description || "",
    optimizationType: row.optimization_type as "ats" | "creative",
    atsScore: row.ats_score,
    status: (row.status as "draft" | "active" | "complete") || "draft",
    templateId: row.template_id || undefined,
    generatedContent: row.generated_content
      ? (typeof row.generated_content === "string"
          ? row.generated_content
          : JSON.stringify(row.generated_content))
      : undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

/**
 * Fetches all resumes for the authenticated user from Supabase.
 */
export async function getResumes(): Promise<GeneratedResume[]> {
  try {
    const res = await fetch("/api/resumes", { credentials: "include" });
    if (!res.ok) return [];
    const data: DbResume[] = await res.json();
    return data.map(mapDbToFrontend);
  } catch {
    return [];
  }
}

/**
 * Fetches a single resume by ID from Supabase.
 */
export async function getResumeById(id: string): Promise<GeneratedResume | null> {
  try {
    const res = await fetch(`/api/resumes/${id}`, { credentials: "include" });
    if (!res.ok) return null;
    const data: DbResume = await res.json();
    return mapDbToFrontend(data);
  } catch {
    return null;
  }
}

/**
 * Saves (upserts) a resume to Supabase.
 */
export async function saveResume(resume: GeneratedResume): Promise<boolean> {
  try {
    const res = await fetch("/api/resumes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(resume),
    });
    return res.ok;
  } catch {
    return false;
  }
}

/**
 * Deletes a resume from Supabase.
 */
export async function deleteResume(id: string): Promise<boolean> {
  try {
    const res = await fetch(`/api/resumes/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    return res.ok;
  } catch {
    return false;
  }
}

/**
 * Computes stats from already-fetched resumes (client-side helper).
 */
export function getResumeStatsFromList(resumes: GeneratedResume[]): ResumeStats {
  const atsResumes = resumes.filter((r) => r.optimizationType === "ats");
  const atsScores = atsResumes
    .map((r) => r.atsScore)
    .filter((s): s is number => s !== null);

  return {
    totalResumes: resumes.length,
    avgAtsScore:
      atsScores.length > 0
        ? Math.round(atsScores.reduce((a, b) => a + b, 0) / atsScores.length)
        : 0,
    atsResumes: atsResumes.length,
    creativeResumes: resumes.filter((r) => r.optimizationType === "creative")
      .length,
    activeResumes: resumes.filter((r) => r.status === "active").length,
    completedResumes: resumes.filter((r) => r.status === "complete").length,
  };
}

export function generateResumeId(): string {
  return `resume_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
}
