import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UserProfile, Experience } from "../data/types";
import { Check, Plus, X, Camera } from "lucide-react";

interface OnboardingScreenProps {
  onComplete: (profile: UserProfile) => void;
}

const INDUSTRIES = ["Tech", "Finance", "Healthcare", "Education", "E-commerce", "Gaming", "Consulting", "Media"];
const JOB_TYPES = ["Internship", "Part-time", "Full-time"];
const LOCATION_PREFS = ["On-site", "Remote", "Hybrid"];

const OnboardingScreen = ({ onComplete }: OnboardingScreenProps) => {
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [university, setUniversity] = useState("");
  const [year, setYear] = useState("");
  const [major, setMajor] = useState("");
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [expRole, setExpRole] = useState("");
  const [expCompany, setExpCompany] = useState("");
  const [expDuration, setExpDuration] = useState("");
  const [expBullets, setExpBullets] = useState("");
  const [technicalSkills, setTechnicalSkills] = useState<string[]>([]);
  const [softSkills, setSoftSkills] = useState<string[]>([]);
  const [tools, setTools] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState("");
  const [activeSkillCategory, setActiveSkillCategory] = useState<"technical" | "soft" | "tools">("technical");
  const [jobTypes, setJobTypes] = useState<string[]>([]);
  const [industries, setIndustries] = useState<string[]>([]);
  const [locationPref, setLocationPref] = useState("");

  const steps = ["Identity", "Experience", "Skills", "Preferences"];
  const totalSteps = steps.length;

  const addExperience = () => {
    if (!expRole || !expCompany) return;
    setExperiences([...experiences, {
      id: Date.now().toString(),
      role: expRole,
      company: expCompany,
      duration: expDuration,
      bullets: expBullets.split("\n").filter(Boolean),
    }]);
    setExpRole("");
    setExpCompany("");
    setExpDuration("");
    setExpBullets("");
  };

  const removeExperience = (id: string) => {
    setExperiences(experiences.filter(e => e.id !== id));
  };

  const addSkill = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && skillInput.trim()) {
      e.preventDefault();
      const skill = skillInput.trim();
      if (activeSkillCategory === "technical" && !technicalSkills.includes(skill)) {
        setTechnicalSkills([...technicalSkills, skill]);
      } else if (activeSkillCategory === "soft" && !softSkills.includes(skill)) {
        setSoftSkills([...softSkills, skill]);
      } else if (activeSkillCategory === "tools" && !tools.includes(skill)) {
        setTools([...tools, skill]);
      }
      setSkillInput("");
    }
  };

  const removeSkill = (skill: string, category: "technical" | "soft" | "tools") => {
    if (category === "technical") setTechnicalSkills(technicalSkills.filter(s => s !== skill));
    else if (category === "soft") setSoftSkills(softSkills.filter(s => s !== skill));
    else setTools(tools.filter(s => s !== skill));
  };

  const toggleChip = (value: string, arr: string[], setArr: (v: string[]) => void) => {
    setArr(arr.includes(value) ? arr.filter(v => v !== value) : [...arr, value]);
  };

  const handleComplete = () => {
    onComplete({
      name: name || "Alex Nguyen",
      university: university || "RMIT University",
      year: year || "3rd Year",
      major: major || "Computer Science",
      photo: "",
      experiences: experiences.length > 0 ? experiences : [
        { id: "1", role: "Software Dev Intern", company: "TechCorp", duration: "3 months", bullets: ["Built REST APIs with Python", "Wrote SQL queries for analytics"] },
      ],
      technicalSkills: technicalSkills.length > 0 ? technicalSkills : ["Python", "SQL", "React", "TypeScript"],
      softSkills: softSkills.length > 0 ? softSkills : ["Communication", "Teamwork"],
      tools: tools.length > 0 ? tools : ["Figma", "Git", "Docker"],
      jobTypes: jobTypes.length > 0 ? jobTypes : ["Internship"],
      industries: industries.length > 0 ? industries : ["Tech"],
      locationPref: locationPref || "Hybrid",
    });
  };

  const canNext = () => {
    if (step === 0) return true; // allow skip with defaults
    return true;
  };

  return (
    <div className="relative z-10 flex flex-col min-h-screen px-6 py-8 max-w-lg mx-auto">
      {/* Progress bar */}
      <div className="mb-8">
        <div className="flex justify-between mb-3">
          {steps.map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-display font-semibold transition-all duration-300 ${
                i < step ? "bg-primary text-primary-foreground glow-primary" :
                i === step ? "bg-primary text-primary-foreground animate-pulse" :
                "bg-muted text-muted-foreground"
              }`}>
                {i < step ? <Check className="w-4 h-4" /> : i + 1}
              </div>
            </div>
          ))}
        </div>
        <div className="h-1.5 rounded-full bg-muted overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ background: "linear-gradient(90deg, #0E56FA, #17CAFA)" }}
            animate={{ width: `${((step + 1) / totalSteps) * 100}%` }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -60 }}
          transition={{ duration: 0.3 }}
          className="flex-1"
        >
          {step === 0 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-display font-bold text-gradient">Who are you?</h2>
              <div className="flex justify-center mb-4">
                <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center border-2 border-border">
                  <Camera className="w-8 h-8 text-muted-foreground" />
                </div>
              </div>
              {[
                { label: "Full Name", value: name, set: setName, placeholder: "Alex Nguyen" },
                { label: "University", value: university, set: setUniversity, placeholder: "RMIT University" },
                { label: "Year of Study", value: year, set: setYear, placeholder: "3rd Year" },
                { label: "Major", value: major, set: setMajor, placeholder: "Computer Science" },
              ].map(({ label, value, set, placeholder }) => (
                <div key={label}>
                  <label className="block text-sm text-muted-foreground mb-1.5 font-body">{label}</label>
                  <input
                    value={value}
                    onChange={e => set(e.target.value)}
                    placeholder={placeholder}
                    className="w-full px-4 py-3 rounded-xl bg-muted border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all font-body"
                  />
                </div>
              ))}
            </div>
          )}

          {step === 1 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-display font-bold text-gradient">Your Experience</h2>
              
              {experiences.map(exp => (
                <div key={exp.id} className="glass p-4 relative">
                  <button onClick={() => removeExperience(exp.id)} className="absolute top-3 right-3 text-muted-foreground hover:text-foreground">
                    <X className="w-4 h-4" />
                  </button>
                  <p className="font-display font-semibold">{exp.role}</p>
                  <p className="text-sm text-muted-foreground">{exp.company} · {exp.duration}</p>
                  <ul className="mt-2 space-y-1">
                    {exp.bullets.map((b, i) => <li key={i} className="text-sm text-muted-foreground">• {b}</li>)}
                  </ul>
                </div>
              ))}

              <div className="glass p-4 space-y-3">
                <input value={expRole} onChange={e => setExpRole(e.target.value)} placeholder="Role Title" className="w-full px-3 py-2 rounded-lg bg-muted border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm font-body" />
                <input value={expCompany} onChange={e => setExpCompany(e.target.value)} placeholder="Company / Organization" className="w-full px-3 py-2 rounded-lg bg-muted border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm font-body" />
                <input value={expDuration} onChange={e => setExpDuration(e.target.value)} placeholder="Duration (e.g., 3 months)" className="w-full px-3 py-2 rounded-lg bg-muted border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm font-body" />
                <textarea value={expBullets} onChange={e => setExpBullets(e.target.value)} placeholder="Key achievements (one per line)" rows={3} className="w-full px-3 py-2 rounded-lg bg-muted border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm font-body resize-none" />
                <button onClick={addExperience} className="flex items-center gap-2 text-sm text-accent font-semibold hover:underline">
                  <Plus className="w-4 h-4" /> Add Experience
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-display font-bold text-gradient">Skills & Tools</h2>
              
              <div className="flex gap-2">
                {(["technical", "soft", "tools"] as const).map(cat => (
                  <button
                    key={cat}
                    onClick={() => setActiveSkillCategory(cat)}
                    className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                      activeSkillCategory === cat ? "bg-primary text-primary-foreground glow-primary" : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {cat === "technical" ? "Technical" : cat === "soft" ? "Soft Skills" : "Tools"}
                  </button>
                ))}
              </div>

              <input
                value={skillInput}
                onChange={e => setSkillInput(e.target.value)}
                onKeyDown={addSkill}
                placeholder="Type a skill and press Enter"
                className="w-full px-4 py-3 rounded-xl bg-muted border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary font-body"
              />

              {[
                { label: "Technical", skills: technicalSkills, cat: "technical" as const },
                { label: "Soft Skills", skills: softSkills, cat: "soft" as const },
                { label: "Tools", skills: tools, cat: "tools" as const },
              ].map(({ label, skills, cat }) => skills.length > 0 && (
                <div key={label}>
                  <p className="text-xs text-muted-foreground mb-2 uppercase tracking-wider">{label}</p>
                  <div className="flex flex-wrap gap-2">
                    {skills.map(s => (
                      <span key={s} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-primary/20 text-accent text-sm font-medium border border-accent/30">
                        {s}
                        <button onClick={() => removeSkill(s, cat)} className="hover:text-foreground"><X className="w-3 h-3" /></button>
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-display font-bold text-gradient">Your Preferences</h2>
              
              <div>
                <p className="text-sm text-muted-foreground mb-3">Job Type</p>
                <div className="flex flex-wrap gap-2">
                  {JOB_TYPES.map(t => (
                    <button key={t} onClick={() => toggleChip(t, jobTypes, setJobTypes)}
                      className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                        jobTypes.includes(t) ? "bg-primary text-primary-foreground glow-primary" : "bg-muted text-muted-foreground hover:bg-muted/80"
                      }`}
                    >{t}</button>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-3">Industries</p>
                <div className="flex flex-wrap gap-2">
                  {INDUSTRIES.map(ind => (
                    <button key={ind} onClick={() => toggleChip(ind, industries, setIndustries)}
                      className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                        industries.includes(ind) ? "bg-accent text-accent-foreground glow-accent" : "bg-muted text-muted-foreground hover:bg-muted/80"
                      }`}
                    >{ind}</button>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-3">Location</p>
                <div className="flex flex-wrap gap-2">
                  {LOCATION_PREFS.map(loc => (
                    <button key={loc} onClick={() => setLocationPref(loc)}
                      className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                        locationPref === loc ? "bg-primary text-primary-foreground glow-primary" : "bg-muted text-muted-foreground hover:bg-muted/80"
                      }`}
                    >{loc}</button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex gap-3 mt-8">
        {step > 0 && (
          <button onClick={() => setStep(step - 1)} className="flex-1 py-3 rounded-2xl border border-border text-foreground font-display font-semibold transition-all hover:bg-muted">
            Back
          </button>
        )}
        <button
          onClick={() => step < totalSteps - 1 ? setStep(step + 1) : handleComplete()}
          className="flex-1 py-3 rounded-2xl bg-primary text-primary-foreground font-display font-semibold glow-primary transition-all hover:scale-105 active:scale-95"
        >
          {step < totalSteps - 1 ? "Continue" : "Start Swiping"}
        </button>
      </div>
    </div>
  );
};

export default OnboardingScreen;
