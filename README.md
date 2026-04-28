# ⚡ SwiftApply

**SwiftApply** is a mobile-first job application app that turns internship hunting into a swipe-based experience — think Tinder, but for your career. Built for university students in Southeast Asia, it matches candidates to relevant opportunities and auto-tailors their CV before sending.

---

## 🚀 Features

### 🎬 Splash Screen
A polished entry screen with animated floating orbs and a dark glassmorphism aesthetic, greeting users before they jump in.

### 🧑‍🎓 Onboarding Flow (4-step wizard)
Users build their profile across four guided steps:
| Step | Content |
|------|---------|
| **Identity** | Name, university, year of study, and major |
| **Experience** | Past roles with achievements (bullet points) |
| **Skills & Tools** | Technical skills, soft skills, and tools — added via tag input |
| **Preferences** | Preferred job type (internship / part-time / full-time), industries, and work location (on-site / remote / hybrid) |

All fields are optional with smart defaults, so users can dive straight into swiping.

### 💼 Swipe Feed
The core loop — a Tinder-style card deck of curated job listings:
- **Swipe right** (or tap ❤️) → triggers CV tailoring before applying
- **Swipe left** (or tap ✕) → passes the job
- Each card displays company, job title, type, location, duration, a **match score (%)**, and personalised "Why You Match" reasons
- Dynamic edge glow (green = apply, red = pass) with spring-physics animations via **Framer Motion**
- **Daily cap**: 10 applications per day to encourage thoughtful applying

### 📄 CV Tailoring Modal
Before each application is sent, a bottom-sheet modal auto-generates a tailored CV preview:
- Highlights the most **relevant experiences** for the role
- Surfaces the most **relevant skills** based on job keywords
- Generates a personalised **summary paragraph** on the fly
- User can review and send, or go back to edit their profile

### 🎉 Match Screen
When a recruiter "matches" back (simulated at ~30% probability), a celebratory full-screen animation fires — reinforcing the gamified feedback loop.

### 📊 Dashboard
A personal applications tracker with tabs:
- **Applied** — all submitted applications with statuses (`sent`, `viewed`, `matched`, `closed`)
- **Matched** — filtered view of successful matches
- **Saved** — reserved for future bookmarking

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | [React 18](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/) |
| Build Tool | [Vite](https://vitejs.dev/) |
| Styling | [Tailwind CSS v3](https://tailwindcss.com/) + custom glassmorphism tokens |
| Animations | [Framer Motion](https://www.framer.com/motion/) |
| UI Primitives | [Radix UI](https://www.radix-ui.com/) + [shadcn/ui](https://ui.shadcn.com/) |
| Icons | [Lucide React](https://lucide.dev/) |
| Forms | [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/) |
| Routing | [React Router v6](https://reactrouter.com/) |
| Data Fetching | [TanStack Query](https://tanstack.com/query) |
| Testing | [Vitest](https://vitest.dev/) + [Testing Library](https://testing-library.com/) + [Playwright](https://playwright.dev/) |

---

## 📁 Project Structure

```
src/
├── components/
│   ├── SplashScreen.tsx       # Entry animation screen
│   ├── OnboardingScreen.tsx   # 4-step profile builder
│   ├── SwipeFeed.tsx          # Core swipe card experience
│   ├── CVTailoringModal.tsx   # Auto CV preview before applying
│   ├── MatchScreen.tsx        # Celebration screen on match
│   ├── Dashboard.tsx          # Application tracker
│   ├── FloatingOrbs.tsx       # Animated background decoration
│   └── ui/                    # shadcn/ui base components
├── data/
│   ├── types.ts               # TypeScript interfaces (Job, UserProfile, etc.)
│   └── mockJobs.ts            # Seed data — 8 real-world style job listings
├── hooks/
│   ├── use-mobile.tsx         # Responsive breakpoint hook
│   └── use-toast.ts           # Toast notification hook
├── pages/
│   ├── Index.tsx              # Root page — app state machine
│   └── NotFound.tsx           # 404 page
└── main.tsx                   # App entry point
```

---

## ⚙️ Getting Started

### Prerequisites
- Node.js 18+ or [Bun](https://bun.sh/)

### Install dependencies

```bash
npm install
# or
bun install
```

### Run the dev server

```bash
npm run dev
# or
bun run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Other scripts

```bash
npm run build       # Production build
npm run preview     # Preview production build locally
npm run lint        # ESLint check
npm run test        # Run unit tests (Vitest)
npm run test:watch  # Watch mode
```

---

## 🎨 Design System

The UI is built on a custom dark theme (`#01001F` base) with:
- **Glassmorphism cards** (`.glass`, `.glass3d` utilities)
- **Glow accents** in blue (`#0E56FA`) and cyan (`#17CAFA`)
- **Framer Motion** spring physics for all card interactions
- **Floating orbs** background for depth and atmosphere

---

## 📌 Notes

- Job data is currently mocked in `src/data/mockJobs.ts`. The match scores and "Why You Match" reasons are pre-authored to demonstrate the concept.
- The CV tailoring is client-side keyword matching — a simplified simulation of what a backend AI model would do.
- The "match" event is randomly triggered (~30% probability) to simulate recruiter interest.
