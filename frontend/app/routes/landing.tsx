import { Hero } from "~/components/marketing/Hero";
import { UseCases } from "~/components/marketing/UseCases";
import { StatsSection } from "~/components/marketing/StatsSection";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <Hero />
      <StatsSection />
      <UseCases />
      <footer className="py-12 border-t border-slate-100 text-center text-slate-400 text-sm">
        © 2026 ApplyFlow. All rights reserved.
      </footer>
    </div>
  );
}
