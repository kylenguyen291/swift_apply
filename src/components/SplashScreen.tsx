import { motion } from "framer-motion";

interface SplashScreenProps {
  onGetStarted: () => void;
  onSignIn: () => void;
}

const SplashScreen = ({ onGetStarted, onSignIn }: SplashScreenProps) => {
  return (
    <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6">
      <motion.h1
        className="text-5xl md:text-7xl font-display font-bold text-gradient mb-4"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        SwipeHire
      </motion.h1>

      <motion.p
        className="text-lg md:text-xl text-muted-foreground mb-12 text-center"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
      >
        Find your fit. One swipe at a time.
      </motion.p>

      <motion.div
        className="flex flex-col gap-4 w-full max-w-xs"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.6 }}
      >
        <button
          onClick={onGetStarted}
          className="glass3d w-full py-4 rounded-2xl font-display font-semibold text-lg text-white transition-all duration-300 hover:scale-105 active:scale-95"
        >
          Get Started
        </button>
        <button
          onClick={onSignIn}
          className="glass3d w-full py-4 rounded-2xl font-display font-semibold text-lg text-white/80 transition-all duration-300 hover:scale-105 active:scale-95"
        >
          Sign In
        </button>
      </motion.div>
    </div>
  );
};

export default SplashScreen;
