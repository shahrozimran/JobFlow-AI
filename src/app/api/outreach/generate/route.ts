import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { OpenAI } from "openai";

export const dynamic = "force-dynamic";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "dummy",
});

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Authentication required." },
        { status: 401 }
      );
    }

    const { company, targetRole, contactEmail, jobDescription, resumeContent } = await req.json();

    if (!company || !targetRole) {
      return NextResponse.json(
        { error: "Company and Target Role are required." },
        { status: 400 }
      );
    }

    // Use OpenAI to draft the email
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === "dummy") {
      // Mock response for development
      return NextResponse.json({
        subject: `Application: ${targetRole} - Experienced Professional`,
        body: `Dear Hiring Team at ${company},\n\nI am writing to express my strong interest in the ${targetRole} position. With my background in this field, I believe my skills closely align with the requirements of this role.\n\nI have attached my resume for your review. I would welcome the opportunity to discuss how my experience can contribute to your team.\n\nLooking forward to hearing from you.\n\nBest regards,\n[Your Name]`
      });
    }

    const prompt = `You are an expert career coach writing a highly compelling outreach cold email / cover letter.
    
Write a concise, professional, and confident email applying for the role of "${targetRole}" at "${company}".

${jobDescription ? `Here is the Job Description:\n"""\n${jobDescription}\n"""\n` : ""}
${resumeContent ? `Here is the applicant's tailored resume:\n"""\n${resumeContent}\n"""\n` : ""}

Guidelines:
1. Keep it under 200 words. Start strong.
2. Focus on the value the applicant brings based on their resume experience.
3. If an explicit contact name is not provided, use "Dear Hiring Team at ${company}".
4. DO NOT use generic placeholders like [Insert Link here]. Use standard sign-offs like "Best regards, [Your Name]".
5. Make the Subject line compelling but professional.

Respond in exact JSON format:
{
  "subject": "The email subject line",
  "body": "The plain text body of the email. Use \n for line breaks."
}`;

    const aiResponse = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
      temperature: 0.3,
    });

    const content = aiResponse.choices[0].message.content;
    if (!content) {
      throw new Error("Empty response from AI");
    }

    const emailDraft = JSON.parse(content);
    
    // Save as draft in Supabase
    const { data: outreach, error } = await supabase
      .from("outreach_logs")
      .insert({
        user_id: user.id,
        company,
        target_role: targetRole,
        contact_email: contactEmail || null,
        subject: emailDraft.subject,
        body: emailDraft.body,
        status: "draft"
      })
      .select()
      .single();

    if (error) {
      console.error("Failed to save outreach draft:", error);
    }

    return NextResponse.json(outreach || emailDraft);
  } catch (error: any) {
    console.error("Outreach generation error:", error);
    return NextResponse.json({ error: error.message || "An unexpected error occurred." }, { status: 500 });
  }
}
