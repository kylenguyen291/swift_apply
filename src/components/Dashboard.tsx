import { motion } from "framer-motion";
import { Application } from "../data/types";
import { ArrowLeft, Briefcase } from "lucide-react";
import { useState } from "react";

interface DashboardProps {
  applications: Application[];
  onBack: () => void;
}

const STATUS_COLORS: Record<string, string> = {
  sent: "bg-primary/20 text-primary border-primary/40",
  viewed: "bg-accent/20 text-accent border-accent/40",
  matched: "bg-green-500/20 text-green-400 border-green-500/40 glow-match",
  closed: "bg-muted text-muted-foreground border-border",
};

const Dashboard = ({ applications, onBack }: DashboardProps) => {
  const [tab, setTab] = useState<"applied" | "matched" | "saved">("applied");

  const filtered = tab === "matched"
    ? applications.filter(a => a.status === "matched")
    : applications;

  return (
    <div className="relative z-10 min-h-screen max-w-lg mx-auto px-6 py-6">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={onBack} className="glass3d w-10 h-10 rounded-full flex items-center justify-center text-white transition-all hover:scale-110">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h2 className="text-2xl font-display font-bold text-gradient">Applications</h2>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {(["applied", "matched", "saved"] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`glass3d px-4 py-2 rounded-full text-sm font-semibold capitalize transition-all duration-300 ${
              tab === t ? "text-white" : "text-white/50"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass p-8 text-center">
          <Briefcase className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
          <p className="text-muted-foreground">No applications yet. Start swiping!</p>
        </motion.div>
      ) : (
        <div className="space-y-3">
          {filtered.map((app, i) => (
            <motion.div
              key={app.job.id}
              className="glass p-4 flex items-center gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <span className="text-2xl">{app.job.logo}</span>
              <div className="flex-1 min-w-0">
                <p className="font-display font-semibold text-sm truncate">{app.job.title}</p>
                <p className="text-xs text-muted-foreground">{app.job.company}</p>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold capitalize border ${STATUS_COLORS[app.status]}`}>
                  {app.status}
                </span>
                <span className="text-[10px] text-muted-foreground">{app.dateApplied}</span>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
