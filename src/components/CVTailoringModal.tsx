import { motion } from "framer-motion";
import { Job, UserProfile } from "../data/types";
import { X } from "lucide-react";

interface CVTailoringModalProps {
  job: Job;
  profile: UserProfile;
  onSend: () => void;
  onClose: () => void;
}

const CVTailoringModal = ({ job, profile, onSend, onClose }: CVTailoringModalProps) => {
  // Simple keyword matching for "tailoring"
  const jobKeywords = [
    ...job.title.toLowerCase().split(" "),
    ...job.whyMatch.join(" ").toLowerCase().split(" "),
  ].filter(w => w.length > 3);

  const isRelevantSkill = (skill: string) =>
    jobKeywords.some(kw => skill.toLowerCase().includes(kw) || kw.includes(skill.toLowerCase()));

  const isRelevantExp = (exp: { role: string; bullets: string[] }) =>
    jobKeywords.some(kw =>
      exp.role.toLowerCase().includes(kw) ||
      exp.bullets.some(b => b.toLowerCase().includes(kw))
    );

  const sortedExperiences = [...profile.experiences].sort((a, b) =>
    (isRelevantExp(b) ? 1 : 0) - (isRelevantExp(a) ? 1 : 0)
  );

  const allSkills = [...profile.technicalSkills, ...profile.tools];

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-end justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        className="relative w-full max-w-lg glass rounded-t-3xl p-6 pb-8 max-h-[85vh] overflow-y-auto"
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground">
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-lg font-display font-bold mb-1">
          Your application for <span className="text-gradient">{job.title}</span>
        </h3>
        <p className="text-sm text-muted-foreground mb-6">
          at {job.company} · We've tailored your profile for this role.
        </p>

        {/* CV Preview */}
        <div className="glass p-5 space-y-4 mb-6">
          <div>
            <h4 className="font-display font-bold text-lg">{profile.name}</h4>
            <p className="text-sm text-muted-foreground">{profile.university} · {profile.year} · {profile.major}</p>
          </div>

          <div className="border-t border-border pt-3">
            <p className="text-xs text-accent uppercase tracking-wider font-semibold mb-1">Summary</p>
            <p className="text-sm text-muted-foreground italic">
              Motivated {profile.major} student with hands-on experience in {profile.technicalSkills.slice(0, 2).join(" and ")}, 
              seeking to contribute to {job.company}'s {job.title.toLowerCase()} team.
            </p>
          </div>

          <div className="border-t border-border pt-3">
            <p className="text-xs text-accent uppercase tracking-wider font-semibold mb-2">Experience</p>
            {sortedExperiences.map(exp => {
              const relevant = isRelevantExp(exp);
              return (
                <div key={exp.id} className={`mb-3 transition-opacity ${relevant ? "opacity-100" : "opacity-40"}`}>
                  <p className="text-sm font-semibold flex items-center gap-2">
                    {exp.role}
                    {relevant && <span className="text-[10px] px-1.5 py-0.5 rounded bg-accent/20 text-accent">Relevant</span>}
                  </p>
                  <p className="text-xs text-muted-foreground">{exp.company} · {exp.duration}</p>
                  <ul className="mt-1 space-y-0.5">
                    {exp.bullets.map((b, i) => (
                      <li key={i} className="text-xs text-muted-foreground">• {b}</li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>

          <div className="border-t border-border pt-3">
            <p className="text-xs text-accent uppercase tracking-wider font-semibold mb-2">Skills</p>
            <div className="flex flex-wrap gap-1.5">
              {allSkills.map(skill => {
                const relevant = isRelevantSkill(skill);
                return (
                  <span key={skill} className={`px-2.5 py-1 rounded-full text-xs font-medium transition-all ${
                    relevant
                      ? "bg-accent/20 text-accent border border-accent/40 glow-accent"
                      : "bg-muted text-muted-foreground opacity-40"
                  }`}>
                    {skill}
                  </span>
                );
              })}
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <button onClick={onClose} className="glass3d flex-1 py-3 rounded-2xl text-white/80 font-display font-semibold transition-all hover:scale-105 active:scale-95">
            Edit Profile
          </button>
          <button onClick={onSend} className="glass3d flex-1 py-3 rounded-2xl text-white font-display font-semibold transition-all hover:scale-105 active:scale-95">
            Send Application
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default CVTailoringModal;
