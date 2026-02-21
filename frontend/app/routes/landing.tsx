import { Hero } from "~/components/marketing/Hero";
import { UseCases } from "~/components/marketing/UseCases";
import { StatsSection } from "~/components/marketing/StatsSection";
import { ApplyFlowLogo } from "~/components/Logo";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <header className="flex items-center px-4 sm:px-6 lg:px-8 h-14 sm:h-16 md:h-18 bg-white">
        <ApplyFlowLogo />
      </header>
      <Hero />
      <StatsSection />
      <UseCases />
      <footer className="py-12 border-t border-slate-100 text-center text-slate-400 text-sm">
        {`© ${new Date().getFullYear()} ApplyFlow. All rights reserved`}
      </footer>
    </div>
  );
}
