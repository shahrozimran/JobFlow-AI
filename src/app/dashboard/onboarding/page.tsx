"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { User, Briefcase, GraduationCap, Zap, ChevronRight, ChevronLeft, CheckCircle2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

const steps = [
  { id: "personal", label: "Personal Info", icon: User },
  { id: "experience", label: "Experience", icon: Briefcase },
  { id: "education", label: "Education", icon: GraduationCap },
  { id: "skills", label: "Skills", icon: Zap },
];

export default function Onboarding() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [mounted, setMounted] = useState(false);

  // Resume Data State
  const [resumeData, setResumeData] = useState({
    personal: { firstName: "", lastName: "", email: "", phone: "", location: "", summary: "" },
    experience: [{ id: "1", company: "", role: "", duration: "", description: "" }],
    education: [{ id: "1", school: "", degree: "", duration: "", grade: "" }],
    skills: [] as string[],
  });
  const [newSkill, setNewSkill] = useState("");

  useEffect(() => {
    setMounted(true);
    // In a real app, check if user is already onboarded via an API here.
    const hasOnboarded = localStorage.getItem("onboarded");
    if (hasOnboarded) {
      router.replace("/dashboard");
    }
  }, [router]);

  if (!mounted) return null;

  const handleUpdatePersonal = (field: string, value: string) => {
    setResumeData(prev => ({ ...prev, personal: { ...prev.personal, [field]: value } }));
  };

  const handleAddExperience = () => {
    setResumeData(prev => ({
      ...prev,
      experience: [...prev.experience, { id: Math.random().toString(), company: "", role: "", duration: "", description: "" }]
    }));
  };

  const handleUpdateExperience = (id: string, field: string, value: string) => {
    setResumeData(prev => ({
      ...prev,
      experience: prev.experience.map(exp => exp.id === id ? { ...exp, [field]: value } : exp)
    }));
  };

  const handleAddEducation = () => {
    setResumeData(prev => ({
      ...prev,
      education: [...prev.education, { id: Math.random().toString(), school: "", degree: "", duration: "", grade: "" }]
    }));
  };

  const handleUpdateEducation = (id: string, field: string, value: string) => {
    setResumeData(prev => ({
      ...prev,
      education: prev.education.map(edu => edu.id === id ? { ...edu, [field]: value } : edu)
    }));
  };

  const handleAddSkill = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && newSkill.trim()) {
      e.preventDefault();
      if (!resumeData.skills.includes(newSkill.trim())) {
        setResumeData(prev => ({ ...prev, skills: [...prev.skills, newSkill.trim()] }));
      }
      setNewSkill("");
    }
  };

  const handleComplete = () => {
    localStorage.setItem("onboarded", "true");
    localStorage.setItem("masterProfile", JSON.stringify(resumeData));
    toast.success("Master Profile setup complete! Welcome to JobFlow AI.");
    router.push("/dashboard");
  };

  const currentStepData = steps[currentStep];
  const StepIcon = currentStepData.icon;

  return (
    <div className="min-h-[calc(100vh-6rem)] flex items-center justify-center p-4">
      <div className="max-w-3xl w-full bg-background/60 backdrop-blur-xl border border-border/50 rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row min-h-[600px]">
        {/* Sidebar Progress */}
        <div className="md:w-64 bg-secondary/30 p-8 border-r border-border/50 flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center mb-8 shadow-lg shadow-primary/20">
              <Zap className="w-5 h-5 text-primary-foreground" />
            </div>
            <h2 className="text-xl font-bold tracking-tight mb-2 text-foreground">Master Profile</h2>
            <p className="text-sm text-muted-foreground mb-8">Let's set up your core professional identity.</p>
            
            <div className="space-y-6 relative">
              <div className="absolute left-3.5 top-4 bottom-4 w-px bg-border/50 -z-10" />
              {steps.map((step, index) => {
                const isActive = index === currentStep;
                const isPassed = index < currentStep;
                const Icon = step.icon;
                
                return (
                  <div key={step.id} className="flex items-center gap-4 group">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                      isActive ? "bg-primary text-primary-foreground shadow-md shadow-primary/20 scale-110" :
                      isPassed ? "bg-primary/20 text-primary border border-primary/30" :
                      "bg-secondary/80 text-muted-foreground"
                    }`}>
                      {isPassed ? <CheckCircle2 className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                    </div>
                    <span className={`text-sm font-medium transition-colors ${
                      isActive ? "text-foreground font-bold" :
                      isPassed ? "text-foreground/80" : "text-muted-foreground"
                    }`}>
                      {step.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 flex flex-col p-8 md:p-12 relative overflow-hidden bg-background">
          <div className="flex-1">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="flex items-center gap-3 mb-8 pb-4 border-b border-border/50">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <StepIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold tracking-tight text-foreground">{currentStepData.label}</h3>
                    <p className="text-sm text-muted-foreground">Fill in the details to generate tailored resumes later.</p>
                  </div>
                </div>

                {/* Step 1: Personal */}
                {currentStep === 0 && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                         <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground opacity-70">First Name</label>
                         <Input placeholder="John" value={resumeData.personal.firstName} onChange={(e) => handleUpdatePersonal("firstName", e.target.value)} className="bg-secondary/20 h-12" />
                      </div>
                      <div className="space-y-2">
                         <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground opacity-70">Last Name</label>
                         <Input placeholder="Doe" value={resumeData.personal.lastName} onChange={(e) => handleUpdatePersonal("lastName", e.target.value)} className="bg-secondary/20 h-12" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                         <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground opacity-70">Email Address</label>
                         <Input placeholder="john@example.com" value={resumeData.personal.email} onChange={(e) => handleUpdatePersonal("email", e.target.value)} className="bg-secondary/20 h-12" />
                      </div>
                      <div className="space-y-2">
                         <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground opacity-70">Phone Number</label>
                         <Input placeholder="+1 234 567 890" value={resumeData.personal.phone} onChange={(e) => handleUpdatePersonal("phone", e.target.value)} className="bg-secondary/20 h-12" />
                      </div>
                    </div>
                     <div className="space-y-2">
                         <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground opacity-70">Location</label>
                         <Input placeholder="San Francisco, CA" value={resumeData.personal.location} onChange={(e) => handleUpdatePersonal("location", e.target.value)} className="bg-secondary/20 h-12" />
                      </div>
                    <div className="space-y-2">
                         <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground opacity-70">Executive Summary</label>
                         <Textarea placeholder="Result-oriented professional with 5+ years of experience..." className="min-h-[120px] bg-secondary/20 resize-none" value={resumeData.personal.summary} onChange={(e) => handleUpdatePersonal("summary", e.target.value)} />
                      </div>
                  </div>
                )}

                {/* Step 2: Experience */}
                {currentStep === 1 && (
                  <div className="space-y-6 max-h-[400px] overflow-y-auto pr-2 pb-10">
                    {resumeData.experience.map((exp, index) => (
                      <div key={exp.id} className="p-5 rounded-2xl border border-border/60 bg-secondary/10 space-y-4">
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="text-sm font-semibold text-foreground">Role {index + 1}</h4>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <Input placeholder="Company Name" value={exp.company} onChange={(e) => handleUpdateExperience(exp.id, "company", e.target.value)} className="bg-background h-11" />
                          <Input placeholder="Job Title" value={exp.role} onChange={(e) => handleUpdateExperience(exp.id, "role", e.target.value)} className="bg-background h-11" />
                        </div>
                        <Input placeholder="Duration (e.g. Jan 2020 - Present)" value={exp.duration} onChange={(e) => handleUpdateExperience(exp.id, "duration", e.target.value)} className="bg-background h-11" />
                        <Textarea placeholder="Key responsibilities and achievements..." className="bg-background min-h-[100px]" value={exp.description} onChange={(e) => handleUpdateExperience(exp.id, "description", e.target.value)} />
                      </div>
                    ))}
                    <Button variant="outline" onClick={handleAddExperience} className="w-full border-dashed h-12 rounded-xl text-primary hover:text-primary hover:bg-primary/5 transition-colors">
                      + Add Another Role
                    </Button>
                  </div>
                )}

                {/* Step 3: Education */}
                {currentStep === 2 && (
                  <div className="space-y-6 max-h-[400px] overflow-y-auto pr-2 pb-10">
                    {resumeData.education.map((edu, index) => (
                      <div key={edu.id} className="p-5 rounded-2xl border border-border/60 bg-secondary/10 space-y-4">
                         <div className="flex justify-between items-center mb-2">
                          <h4 className="text-sm font-semibold text-foreground">Institution {index + 1}</h4>
                        </div>
                        <Input placeholder="School / University" value={edu.school} onChange={(e) => handleUpdateEducation(edu.id, "school", e.target.value)} className="bg-background h-11" />
                        <div className="grid grid-cols-2 gap-4">
                          <Input placeholder="Degree (e.g. B.S. CS)" value={edu.degree} onChange={(e) => handleUpdateEducation(edu.id, "degree", e.target.value)} className="bg-background h-11" />
                          <Input placeholder="Grade / GPA" value={edu.grade} onChange={(e) => handleUpdateEducation(edu.id, "grade", e.target.value)} className="bg-background h-11" />
                        </div>
                        <Input placeholder="Duration (e.g. 2016 - 2020)" value={edu.duration} onChange={(e) => handleUpdateEducation(edu.id, "duration", e.target.value)} className="bg-background h-11" />
                      </div>
                    ))}
                    <Button variant="outline" onClick={handleAddEducation} className="w-full border-dashed h-12 rounded-xl text-primary hover:text-primary hover:bg-primary/5 transition-colors">
                      + Add Education
                    </Button>
                  </div>
                )}

                {/* Step 4: Skills */}
                {currentStep === 3 && (
                  <div className="space-y-6">
                    <div className="p-6 rounded-2xl bg-secondary/10 border border-border/50 text-center space-y-3">
                      <Zap className="w-8 h-8 text-primary mx-auto mb-2 opacity-50" />
                      <h4 className="font-semibold text-foreground">Add Your Skills</h4>
                      <p className="text-sm text-muted-foreground max-w-[250px] mx-auto">Type a skill and press Enter to add it to your master profile.</p>
                      <Input 
                        placeholder="e.g. React, Python, Project Management..." 
                        className="h-12 text-center text-lg mt-4 max-w-sm mx-auto bg-background" 
                        value={newSkill} 
                        onChange={e => setNewSkill(e.target.value)} 
                        onKeyDown={handleAddSkill} 
                      />
                    </div>
                    
                    <div className="flex flex-wrap gap-2 justify-center pt-4">
                      {resumeData.skills.length === 0 ? (
                        <p className="text-sm text-muted-foreground italic">No skills added yet.</p>
                      ) : (
                        resumeData.skills.map((skill) => (
                          <Badge key={skill} variant="secondary" className="px-4 py-2 text-sm bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition-colors cursor-default gap-2 rounded-full">
                            {skill}
                            <button onClick={() => setResumeData(p => ({ ...p, skills: p.skills.filter(s => s !== skill) }))} className="hover:text-destructive opacity-70 hover:opacity-100 transition-opacity">&times;</button>
                          </Badge>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Footer Controls */}
          <div className="pt-6 border-t border-border/50 flex items-center justify-between mt-8">
            <Button
              variant="outline"
              size="lg"
              onClick={() => setCurrentStep(prev => Math.max(0, prev - 1))}
              disabled={currentStep === 0}
              className="gap-2 rounded-full px-6"
            >
              <ChevronLeft className="w-4 h-4" /> Back
            </Button>

            {currentStep < steps.length - 1 ? (
              <Button
                size="lg"
                onClick={() => setCurrentStep(prev => Math.min(steps.length - 1, prev + 1))}
                className="gap-2 rounded-full px-8 shadow-md shadow-primary/20"
              >
                Continue <ChevronRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button
                size="lg"
                onClick={handleComplete}
                className="gap-2 rounded-full px-8 bg-success hover:bg-success/90 text-success-foreground shadow-md shadow-success/20"
              >
                Complete Setup <CheckCircle2 className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
