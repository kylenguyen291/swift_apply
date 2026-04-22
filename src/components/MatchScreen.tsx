import { motion } from "framer-motion";
import { Job, UserProfile } from "../data/types";

interface MatchScreenProps {
  job: Job;
  profile: UserProfile;
  onMessage: () => void;
  onKeepSwiping: () => void;
}

const MatchScreen = ({ job, profile, onMessage, onKeepSwiping }: MatchScreenProps) => {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center px-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="absolute inset-0 bg-background/95 backdrop-blur-md" />
      
      {/* Light ring */}
      <motion.div
        className="absolute w-64 h-64 rounded-full border-2 border-accent/30"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 3, opacity: [0, 0.5, 0] }}
        transition={{ duration: 1.5, ease: "easeOut" }}
      />

      <div className="relative z-10 flex flex-col items-center">
        {/* Avatars */}
        <div className="flex items-center gap-6 mb-8">
          <motion.div
            className="w-20 h-20 rounded-full bg-muted border-2 border-accent flex items-center justify-center text-3xl glow-match"
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3, type: "spring" }}
          >
            {job.logo}
          </motion.div>

          <motion.div
            className="w-4 h-4 rounded-full bg-accent"
            initial={{ scale: 0 }}
            animate={{ scale: [0, 1.5, 1] }}
            transition={{ delay: 0.6, duration: 0.4 }}
            style={{ boxShadow: "0 0 20px rgba(23,202,250,0.8)" }}
          />

          <motion.div
            className="w-20 h-20 rounded-full bg-muted border-2 border-primary flex items-center justify-center font-display font-bold text-2xl glow-primary"
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3, type: "spring" }}
          >
            {profile.name.charAt(0)}
          </motion.div>
        </div>

        <motion.h2
          className="text-4xl font-display font-bold text-gradient mb-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          It's a Match!
        </motion.h2>

        <motion.p
          className="text-muted-foreground text-center mb-10"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          {job.company} wants to connect with you.
        </motion.p>

        <motion.div
          className="flex flex-col gap-3 w-full max-w-xs"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
        >
          <button onClick={onMessage} className="glass3d w-full py-3 rounded-2xl text-white font-display font-semibold transition-all hover:scale-105 active:scale-95">
            Message Now
          </button>
          <button onClick={onKeepSwiping} className="glass3d w-full py-3 rounded-2xl text-white/80 font-display font-semibold transition-all hover:scale-105 active:scale-95">
            Keep Swiping
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default MatchScreen;
