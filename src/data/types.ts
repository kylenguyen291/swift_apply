export interface Job {
  id: number;
  company: string;
  logo: string;
  title: string;
  type: string;
  location: string;
  duration: string;
  matchScore: number;
  whyMatch: string[];
  hardRequirement: string;
}

export interface UserProfile {
  name: string;
  university: string;
  year: string;
  major: string;
  photo: string;
  experiences: Experience[];
  technicalSkills: string[];
  softSkills: string[];
  tools: string[];
  jobTypes: string[];
  industries: string[];
  locationPref: string;
}

export interface Experience {
  id: string;
  role: string;
  company: string;
  duration: string;
  bullets: string[];
}

export interface Application {
  job: Job;
  status: "sent" | "viewed" | "matched" | "closed";
  dateApplied: string;
}

export type AppScreen = "splash" | "onboarding" | "swipe" | "dashboard";
