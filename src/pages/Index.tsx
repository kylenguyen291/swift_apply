import { useState, useCallback } from "react";
import FloatingOrbs from "../components/FloatingOrbs";
import SplashScreen from "../components/SplashScreen";
import OnboardingScreen from "../components/OnboardingScreen";
import SwipeFeed from "../components/SwipeFeed";
import Dashboard from "../components/Dashboard";
import { AppScreen, UserProfile, Application, Job } from "../data/types";
import { mockJobs } from "../data/mockJobs";

const DAILY_SWIPE_CAP = 10;

const Index = () => {
  const [screen, setScreen] = useState<AppScreen>("splash");
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [swipesLeft, setSwipesLeft] = useState(DAILY_SWIPE_CAP);

  const handleOnboardingComplete = useCallback((p: UserProfile) => {
    setProfile(p);
    setScreen("swipe");
  }, []);

  const handleApply = useCallback((job: Job) => {
    const statuses: Application["status"][] = ["sent", "viewed", "matched"];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    setApplications(prev => [
      ...prev,
      { job, status, dateApplied: new Date().toLocaleDateString() },
    ]);
    setSwipesLeft(prev => Math.max(0, prev - 1));
  }, []);

  const handlePass = useCallback((_job: Job) => {
    // Just move to next card
  }, []);

  return (
    <div className="min-h-screen relative" style={{ backgroundColor: "#01001F" }}>
      <FloatingOrbs />

      {screen === "splash" && (
        <SplashScreen
          onGetStarted={() => setScreen("onboarding")}
          onSignIn={() => setScreen("onboarding")}
        />
      )}

      {screen === "onboarding" && (
        <OnboardingScreen onComplete={handleOnboardingComplete} />
      )}

      {screen === "swipe" && profile && (
        <SwipeFeed
          jobs={mockJobs}
          profile={profile}
          applications={applications}
          onApply={handleApply}
          onPass={handlePass}
          swipesLeft={swipesLeft}
          onOpenDashboard={() => setScreen("dashboard")}
        />
      )}

      {screen === "dashboard" && (
        <Dashboard
          applications={applications}
          onBack={() => setScreen("swipe")}
        />
      )}
    </div>
  );
};

export default Index;
