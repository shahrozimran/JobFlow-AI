import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "dummy",
});

export interface RewriteData {
  jd: string;
  userProfile: any;
  optimizedKeywords: {
    skills: string[];
    experience: string[];
  };
}

/**
 * Step 5: LLM Resume Rewriting Engine
 * Uses structured prompt engineering for high-end ATS-optimized rewriting.
 */
export async function rewriteResume(data: RewriteData): Promise<string> {
  const { jd, userProfile, optimizedKeywords } = data;

const prompt = `
    Create a high-end, ATS-optimized resume based on the user's profile and the job description (JD) below.

    Job Description:
    """
    ${jd}
    """

    User Current Profile:
    ${JSON.stringify(userProfile, null, 2)}

    Target Keywords to Incorporate:
    Skills: ${optimizedKeywords.skills.join(", ")}
    Concepts/Experience: ${optimizedKeywords.experience.join(", ")}

    CRITICAL INSTRUCTION: You MUST return your response as a valid JSON object.
    The JSON object MUST EXACTLY MATCH the following structure and keys:
    {
      "personalInfo": {
        "name": "Extract or infer from profile",
        "email": "Extract or infer",
        "phone": "Extract or infer",
        "location": "Extract or infer",
        "linkedin": "Extract or infer",
        "github": "Extract or infer"
      },
      "summary": "3-4 sentence impactful professional summary highlighting match for the role and top keywords.",
      "experience": [
        {
          "title": "Job Title",
          "company": "Company Name",
          "location": "Location",
          "dates": "Start Date – End Date",
          "bullets": [
            "Quantifiable, action-oriented bullet point naturally integrating keywords...",
            "Another impact-driven bullet point..."
          ]
        }
      ],
      "education": [
        {
          "degree": "Degree Name",
          "school": "University Name",
          "location": "Location",
          "dates": "Dates or Graduation Year"
        }
      ],
      "skills": [
        "Include ALL target skill keywords here, grouped if necessary", "Skill 2"
      ],
      "certifications": [
        "Certifications if any"
      ]
    }

    WRITING RULES:
    1. Professional Experience: Tailor bullet points to the JD. Focus on quantifiable achievements.
    2. Use strong active verbs (e.g., Developed, Orchestrated, Optimized).
    3. Output valid JSON only, no markdown wrapping.
  `;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      response_format: { type: "json_object" },
      messages: [{ role: "user", content: prompt }],
      temperature: 0.5,
    });

    const content = response.choices[0].message.content;
    if (!content) throw new Error("Empty response from OpenAI");

    // The content is now guaranteed to be a JSON string by OpenAI
    return content;
  } catch (error) {
    console.error("Error rewriting resume:", error);
    throw new Error("Failed to rewrite the resume into JSON format.");
  }
}
