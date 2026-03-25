import { useState, useCallback } from "react";
import { motion, useMotionValue, useTransform, AnimatePresence } from "framer-motion";
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

const SWIPE_THRESHOLD = 100;

const SwipeFeed = ({ jobs, profile, applications, onApply, onPass, swipesLeft, onOpenDashboard }: SwipeFeedProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showCVModal, setShowCVModal] = useState(false);
  const [showMatch, setShowMatch] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [direction, setDirection] = useState<"left" | "right" | null>(null);

  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-15, 15]);
  const applyOpacity = useTransform(x, [0, SWIPE_THRESHOLD], [0, 1]);
  const passOpacity = useTransform(x, [-SWIPE_THRESHOLD, 0], [1, 0]);

  const currentJob = jobs[currentIndex];
  const capReached = swipesLeft <= 0;

  const handleSwipeRight = useCallback(() => {
    if (capReached || !currentJob) return;
    setSelectedJob(currentJob);
    setShowCVModal(true);
  }, [capReached, currentJob]);

  const handleSwipeLeft = useCallback(() => {
    if (!currentJob) return;
    setDirection("left");
    onPass(currentJob);
    setTimeout(() => {
      setCurrentIndex(i => i + 1);
      setDirection(null);
    }, 300);
  }, [currentJob, onPass]);

  const handleDragEnd = (_: any, info: { offset: { x: number }; velocity: { x: number } }) => {
    if (info.offset.x > SWIPE_THRESHOLD || info.velocity.x > 500) {
      handleSwipeRight();
    } else if (info.offset.x < -SWIPE_THRESHOLD || info.velocity.x < -500) {
      handleSwipeLeft();
    }
  };

  const handleSendApplication = () => {
    if (!selectedJob) return;
    setShowCVModal(false);
    onApply(selectedJob);
    // 30% chance of match for demo
    if (Math.random() < 0.3) {
      setTimeout(() => setShowMatch(true), 500);
    } else {
      setDirection("right");
      setTimeout(() => {
        setCurrentIndex(i => i + 1);
        setDirection(null);
      }, 300);
    }
  };

  const handleMatchDismiss = () => {
    setShowMatch(false);
    setDirection("right");
    setTimeout(() => {
      setCurrentIndex(i => i + 1);
      setDirection(null);
    }, 200);
  };

  const noMoreJobs = currentIndex >= jobs.length;

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
            {/* Background cards */}
            {jobs.slice(currentIndex + 1, currentIndex + 3).reverse().map((job, i) => (
              <div
                key={job.id}
                className="absolute inset-0 glass"
                style={{
                  transform: `scale(${0.95 - i * 0.03}) translateY(${(2 - i) * 12}px)`,
                  opacity: 0.6 - i * 0.2,
                  zIndex: i,
                }}
              />
            ))}

            {/* Active card */}
            <AnimatePresence>
              {currentJob && !direction && (
                <motion.div
                  key={currentJob.id}
                  className="absolute inset-0 glass p-6 cursor-grab active:cursor-grabbing select-none overflow-hidden"
                  style={{ x, rotate, zIndex: 10 }}
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.8}
                  onDragEnd={handleDragEnd}
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ 
                    x: direction === "right" ? 300 : -300,
                    opacity: 0,
                    transition: { duration: 0.3 }
                  }}
                >
                  {/* APPLY / PASS stamps */}
                  <motion.div className="absolute top-6 right-6 z-20 border-4 border-green-500 rounded-lg px-3 py-1 rotate-12" style={{ opacity: applyOpacity }}>
                    <span className="text-green-500 font-display font-bold text-xl">APPLY</span>
                  </motion.div>
                  <motion.div className="absolute top-6 left-6 z-20 border-4 border-red-500 rounded-lg px-3 py-1 -rotate-12" style={{ opacity: passOpacity }}>
                    <span className="text-red-500 font-display font-bold text-xl">PASS</span>
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
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Action buttons */}
      {!capReached && !noMoreJobs && (
        <div className="flex justify-center gap-8 pb-8">
          <button
            onClick={handleSwipeLeft}
            className="w-16 h-16 rounded-full bg-muted border border-border flex items-center justify-center transition-all hover:scale-110 hover:border-red-500/50 active:scale-90"
          >
            <X className="w-7 h-7 text-red-400" />
          </button>
          <button
            onClick={handleSwipeRight}
            className="w-16 h-16 rounded-full bg-primary border border-primary flex items-center justify-center glow-primary transition-all hover:scale-110 active:scale-90"
          >
            <Heart className="w-7 h-7 text-primary-foreground" />
          </button>
        </div>
      )}

      {/* CV Modal */}
      {showCVModal && selectedJob && (
        <CVTailoringModal
          job={selectedJob}
          profile={profile}
          onSend={handleSendApplication}
          onClose={() => setShowCVModal(false)}
        />
      )}

      {/* Match Screen */}
      {showMatch && selectedJob && (
        <MatchScreen
          job={selectedJob}
          profile={profile}
          onMessage={handleMatchDismiss}
          onKeepSwiping={handleMatchDismiss}
        />
      )}
    </div>
  );
};

export default SwipeFeed;
