import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const url = new URL(req.url);
    const isLite = url.searchParams.get("lite") === "true";

    // Omit massive text columns (job_description, generated_content) for lightweight dashboard renders
    const selectStr = isLite 
      ? "id, user_id, target_role, company, optimization_type, ats_score, status, template_id, created_at, updated_at"
      : "*";

    const { data, error } = await supabase
      .from("user_resumes")
      .select(selectStr)
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const json = await req.json();

    // Map frontend fields (camelCase) to DB fields (snake_case)
    const payload = {
      id: json.id,
      user_id: user.id,
      target_role: json.targetRole,
      company: json.company,
      job_description: json.jobDescription,
      optimization_type: json.optimizationType,
      ats_score: json.atsScore,
      status: json.status || 'draft',
      template_id: json.templateId,
      generated_content: typeof json.generatedContent === 'string' 
        ? JSON.parse(json.generatedContent) 
        : json.generatedContent,
      updated_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from("user_resumes")
      .upsert(payload, { onConflict: "id" })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
