import { useState, useCallback, useRef } from "react";
import { motion, useMotionValue, useTransform, animate, AnimatePresence } from "framer-motion";
import { Job, UserProfile, Application } from "../data/types";
import { X, Heart, Briefcase, MapPin, Clock, Flame } from "lucide-react";
import CVTailoringModal from "./CVTailoringModal";
import MatchScreen from "./MatchScreen";

interface SwipeFeedProps {
  jobs: Job[];
  profile: UserProfile;
  applications: Application[];
  onApply: (job: Job) => void;
  onPass: (job: Job) => void;
  swipesLeft: number;
  onOpenDashboard: () => void;
}

const SWIPE_THRESHOLD = 80;
const FLY_OUT_DISTANCE = 600;

const SwipeFeed = ({ jobs, profile, applications, onApply, onPass, swipesLeft, onOpenDashboard }: SwipeFeedProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showCVModal, setShowCVModal] = useState(false);
  const [showMatch, setShowMatch] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isAnimatingOut, setIsAnimatingOut] = useState(false);

  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-18, 18]);
  const applyOpacity = useTransform(x, [0, SWIPE_THRESHOLD], [0, 1]);
  const passOpacity = useTransform(x, [-SWIPE_THRESHOLD, 0], [1, 0]);

  // Green/red edge glows
  const rightGlow = useTransform(x, [0, 150], ["rgba(34,197,94,0)", "rgba(34,197,94,0.3)"]);
  const leftGlow = useTransform(x, [-150, 0], ["rgba(239,68,68,0.3)", "rgba(239,68,68,0)"]);

  const currentJob = jobs[currentIndex];
  const capReached = swipesLeft <= 0;
  const noMoreJobs = currentIndex >= jobs.length;

  const flyCardOut = useCallback((dir: "left" | "right", onComplete: () => void) => {
    setIsAnimatingOut(true);
    const targetX = dir === "right" ? FLY_OUT_DISTANCE : -FLY_OUT_DISTANCE;
    animate(x, targetX, {
      type: "spring",
      stiffness: 300,
      damping: 30,
      velocity: dir === "right" ? 800 : -800,
      onComplete: () => {
        x.set(0);
        setIsAnimatingOut(false);
        onComplete();
      },
    });
  }, [x]);

  const advanceCard = useCallback(() => {
    setCurrentIndex(i => i + 1);
  }, []);

  const handleSwipeRight = useCallback(() => {
    if (capReached || !currentJob || isAnimatingOut) return;
    setSelectedJob(currentJob);
    setShowCVModal(true);
  }, [capReached, currentJob, isAnimatingOut]);

  const handleSwipeLeft = useCallback(() => {
    if (!currentJob || isAnimatingOut) return;
    onPass(currentJob);
    flyCardOut("left", advanceCard);
  }, [currentJob, onPass, flyCardOut, advanceCard, isAnimatingOut]);

  const handleDragEnd = (_: any, info: { offset: { x: number }; velocity: { x: number } }) => {
    if (isAnimatingOut) return;
    const swipeRight = info.offset.x > SWIPE_THRESHOLD || info.velocity.x > 400;
    const swipeLeft = info.offset.x < -SWIPE_THRESHOLD || info.velocity.x < -400;

    if (swipeRight) {
      handleSwipeRight();
    } else if (swipeLeft) {
      handleSwipeLeft();
    } else {
      // Snap back
      animate(x, 0, { type: "spring", stiffness: 500, damping: 30 });
    }
  };

  const handleSendApplication = () => {
    if (!selectedJob) return;
    setShowCVModal(false);
    onApply(selectedJob);
    // 30% chance of match for demo
    if (Math.random() < 0.3) {
      flyCardOut("right", () => {
        advanceCard();
        setTimeout(() => setShowMatch(true), 300);
      });
    } else {
      flyCardOut("right", advanceCard);
    }
  };

  const handleMatchDismiss = () => {
    setShowMatch(false);
  };

  return (
    <div className="relative z-10 flex flex-col min-h-screen max-w-lg mx-auto">
      {/* Top bar */}
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-2">
          <Flame className="w-5 h-5 text-accent" />
          <span className="text-sm font-display font-semibold">
            {swipesLeft} swipe{swipesLeft !== 1 ? "s" : ""} left today
          </span>
        </div>
        <button
          onClick={onOpenDashboard}
          className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-sm font-display font-bold border border-border hover:glow-accent transition-all"
        >
          {profile.name.charAt(0) || "A"}
        </button>
      </div>

      {/* Card stack */}
      <div className="flex-1 flex items-center justify-center px-6 relative">
        {capReached ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass p-8 text-center max-w-sm"
          >
            <div className="text-5xl mb-4">🔒</div>
            <h3 className="text-xl font-display font-bold mb-2">You've used your 10 applications today</h3>
            <p className="text-muted-foreground text-sm">Come back tomorrow — quality {">"} quantity.</p>
          </motion.div>
        ) : noMoreJobs ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass p-8 text-center max-w-sm"
          >
            <div className="text-5xl mb-4">✨</div>
            <h3 className="text-xl font-display font-bold mb-2">You've seen all jobs</h3>
            <p className="text-muted-foreground text-sm">Check back later for new opportunities!</p>
          </motion.div>
        ) : (
          <div className="relative w-full" style={{ height: 480 }}>
            {/* Background cards (peek behind) */}
            {jobs.slice(currentIndex + 1, currentIndex + 3).reverse().map((job, i) => {
              const stackIndex = 1 - i; // 0 = furthest, 1 = closest
              return (
                <motion.div
                  key={job.id}
                  className="absolute inset-0 glass pointer-events-none"
                  initial={false}
                  animate={{
                    scale: 0.92 + stackIndex * 0.04,
                    y: (2 - stackIndex) * 14,
                    opacity: 0.4 + stackIndex * 0.2,
                  }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  style={{ zIndex: stackIndex }}
                />
              );
            })}

            {/* Active card */}
            {currentJob && (
              <motion.div
                key={currentJob.id}
                className="absolute inset-0 glass p-6 cursor-grab active:cursor-grabbing select-none overflow-hidden touch-none"
                style={{
                  x,
                  rotate,
                  zIndex: 10,
                  boxShadow: useTransform(
                    x,
                    [-150, 0, 150],
                    [
                      "0 8px 32px rgba(239,68,68,0.25), 0 0 60px rgba(239,68,68,0.1)",
                      "0 8px 32px rgba(14,86,250,0.15)",
                      "0 8px 32px rgba(34,197,94,0.25), 0 0 60px rgba(34,197,94,0.1)",
                    ]
                  ),
                }}
                drag={isAnimatingOut ? false : "x"}
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.9}
                onDragEnd={handleDragEnd}
                initial={{ scale: 0.9, opacity: 0, y: 30 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              >
                {/* APPLY stamp */}
                <motion.div
                  className="absolute top-8 right-6 z-20 border-[3px] rounded-lg px-4 py-1.5 rotate-12"
                  style={{
                    opacity: applyOpacity,
                    borderColor: "rgb(34, 197, 94)",
                  }}
                >
                  <span className="font-display font-bold text-2xl" style={{ color: "rgb(34, 197, 94)" }}>APPLY</span>
                </motion.div>

                {/* PASS stamp */}
                <motion.div
                  className="absolute top-8 left-6 z-20 border-[3px] rounded-lg px-4 py-1.5 -rotate-12"
                  style={{
                    opacity: passOpacity,
                    borderColor: "rgb(239, 68, 68)",
                  }}
                >
                  <span className="font-display font-bold text-2xl" style={{ color: "rgb(239, 68, 68)" }}>PASS</span>
                </motion.div>

                {/* Card content */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{currentJob.logo}</span>
                    <div>
                      <p className="text-sm text-muted-foreground font-body">{currentJob.company}</p>
                      <h3 className="text-lg font-display font-bold leading-tight">{currentJob.title}</h3>
                    </div>
                  </div>
                  <div className="px-3 py-1.5 rounded-full bg-accent/20 border border-accent/40 glow-accent">
                    <span className="text-sm font-display font-bold text-accent">{currentJob.matchScore}%</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {[
                    { icon: Briefcase, text: currentJob.type },
                    { icon: MapPin, text: currentJob.location },
                    { icon: Clock, text: currentJob.duration },
                  ].map(({ icon: Icon, text }) => (
                    <span key={text} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-muted text-xs font-medium text-muted-foreground">
                      <Icon className="w-3 h-3" /> {text}
                    </span>
                  ))}
                </div>

                <div className="mb-4">
                  <p className="text-xs text-accent uppercase tracking-wider font-semibold mb-2">Why You Match</p>
                  <ul className="space-y-2">
                    {currentJob.whyMatch.map((reason, i) => (
                      <li key={i} className="text-sm text-muted-foreground flex gap-2">
                        <span className="text-accent mt-0.5">✦</span>
                        {reason}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="absolute bottom-0 left-0 right-0 px-6 py-4 rounded-b-[20px]" style={{ background: "linear-gradient(to top, rgba(1,0,31,0.8), transparent)" }}>
                  <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-warning/10 border border-warning/30">
                    <span className="text-xs text-warning font-medium">⚠ {currentJob.hardRequirement}</span>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        )}
      </div>

      {/* Action buttons */}
      {!capReached && !noMoreJobs && (
        <div className="flex justify-center gap-8 pb-8">
          <motion.button
            onClick={handleSwipeLeft}
            className="w-16 h-16 rounded-full bg-muted border border-border flex items-center justify-center transition-colors hover:border-destructive/50"
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.85 }}
          >
            <X className="w-7 h-7 text-destructive" />
          </motion.button>
          <motion.button
            onClick={handleSwipeRight}
            className="w-16 h-16 rounded-full bg-primary border border-primary flex items-center justify-center glow-primary"
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.85 }}
          >
            <Heart className="w-7 h-7 text-primary-foreground" />
          </motion.button>
        </div>
      )}

      {/* CV Modal */}
      <AnimatePresence>
        {showCVModal && selectedJob && (
          <CVTailoringModal
            job={selectedJob}
            profile={profile}
            onSend={handleSendApplication}
            onClose={() => setShowCVModal(false)}
          />
        )}
      </AnimatePresence>

      {/* Match Screen */}
      <AnimatePresence>
        {showMatch && selectedJob && (
          <MatchScreen
            job={selectedJob}
            profile={profile}
            onMessage={handleMatchDismiss}
            onKeepSwiping={handleMatchDismiss}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default SwipeFeed;
