export interface ResumeData {
  personalInfo?: {
    name?: string;
    email?: string;
    phone?: string;
    location?: string;
    linkedin?: string;
    github?: string;
  };
  summary?: string;
  experience?: Array<{
    title?: string;
    company?: string;
    location?: string;
    dates?: string;
    bullets?: string[];
  }>;
  education?: Array<{
    degree?: string;
    school?: string;
    location?: string;
    dates?: string;
  }>;
  skills?: string[];
  certifications?: string[];
}

interface AtsTemplateProps {
  content: string | ResumeData;
  className?: string; // Forward ref to capture for PDF not needed if we render on screen 
}

export function AtsTemplate({ content, className = "" }: AtsTemplateProps) {
  let data: ResumeData | null = null;
  let rawTextFallback = "";

  if (typeof content === "string") {
    try {
      data = JSON.parse(content);
    } catch (e) {
      rawTextFallback = content;
    }
  } else {
    data = content;
  }

  // Fallback to old pure-text view if JSON parsing fails
  if (!data || rawTextFallback) {
    return (
      <div className={`whitespace-pre-wrap text-sm leading-relaxed text-foreground font-[system-ui] ${className}`}>
        {rawTextFallback || JSON.stringify(data)}
      </div>
    );
  }

  // Premium ATS Layout Styling
  // Strictly clean, bordered sections, centered header, professional serif typography
  return (
    <div className={`font-serif text-gray-900 bg-white leading-normal text-[11pt] max-w-[850px] mx-auto p-8 md:p-12 ${className}`} style={{ fontFamily: "Georgia, 'Times New Roman', Times, serif" }}>
      
      {/* 1. Header (Centered) */}
      <header className="text-center mb-6">
        <h1 className="text-3xl font-bold uppercase tracking-wider mb-2 text-black">
          {data.personalInfo?.name || "YOUR NAME"}
        </h1>
        
        <div className="flex flex-wrap justify-center items-center gap-2 text-[10pt] text-gray-800">
          {[
            data.personalInfo?.location,
            data.personalInfo?.email,
            data.personalInfo?.phone,
            data.personalInfo?.linkedin,
            data.personalInfo?.github
          ].filter(Boolean).map((item, i, arr) => (
            <span key={i} className="flex items-center">
              <span>{item}</span>
              {i < arr.length - 1 && <span className="mx-2 text-gray-400">|</span>}
            </span>
          ))}
        </div>
      </header>

      {/* 2. Professional Summary */}
      {data.summary && (
        <section className="mb-5">
          <h2 className="text-sm font-bold uppercase tracking-widest text-black border-b border-black pb-1 mb-2">
            Professional Summary
          </h2>
          <p className="text-justify">{data.summary}</p>
        </section>
      )}

      {/* 3. Skills */}
      {data.skills && data.skills.length > 0 && (
        <section className="mb-5">
          <h2 className="text-sm font-bold uppercase tracking-widest text-black border-b border-black pb-1 mb-3">
            Core Competencies
          </h2>
          <div className="flex flex-wrap gap-x-6 gap-y-1">
            {data.skills.map((skill, index) => (
              <span key={index} className="flex items-center">
                <span className="mr-1 text-gray-500">•</span> {skill}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* 4. Professional Experience */}
      {data.experience && data.experience.length > 0 && (
        <section className="mb-5">
          <h2 className="text-sm font-bold uppercase tracking-widest text-black border-b border-black pb-1 mb-3">
            Professional Experience
          </h2>
          <div className="space-y-4">
            {data.experience.map((exp, index) => (
              <div key={index}>
                <div className="flex justify-between items-baseline font-bold text-black mb-0.5">
                  <h3 className="text-[11pt]">{exp.title}</h3>
                  <span className="text-[10pt] font-normal">{exp.dates}</span>
                </div>
                {(exp.company || exp.location) && (
                  <div className="flex justify-between items-baseline text-black italic text-[10pt] mb-2">
                    <span>{exp.company}</span>
                    <span>{exp.location}</span>
                  </div>
                )}
                {exp.bullets && exp.bullets.length > 0 && (
                  <ul className="list-disc list-outside ml-4 space-y-1 text-justify">
                    {exp.bullets.map((bullet, bIndex) => (
                      <li key={bIndex} className="pl-1">
                        {bullet}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 5. Education */}
      {data.education && data.education.length > 0 && (
        <section className="mb-5">
          <h2 className="text-sm font-bold uppercase tracking-widest text-black border-b border-black pb-1 mb-3">
            Education
          </h2>
          <div className="space-y-2">
            {data.education.map((edu, index) => (
              <div key={index} className="flex justify-between items-baseline">
                <div>
                  <h3 className="font-bold text-black text-[11pt]">{edu.degree}</h3>
                  <p className="text-[10pt] italic text-black">{edu.school}{edu.location ? `, ${edu.location}` : ""}</p>
                </div>
                <span className="text-[10pt]">{edu.dates}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 6. Certifications */}
      {data.certifications && data.certifications.length > 0 && (
        <section>
          <h2 className="text-sm font-bold uppercase tracking-widest text-black border-b border-black pb-1 mb-3">
            Certifications
          </h2>
          <div className="space-y-1">
            {data.certifications.map((cert, index) => (
              <div key={index} className="text-[11pt] flex items-center">
                <span className="mr-2 text-gray-500">•</span> {cert}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
