import { Hero } from "~/components/marketing/Hero";
import { UseCases } from "~/components/marketing/UseCases";
import { StatsSection } from "~/components/marketing/StatsSection";
import { ApplyFlowLogo } from "~/components/Logo";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      <header className="flex items-center px-4 sm:px-6 lg:px-8 h-14 sm:h-16 bg-white">
        <ApplyFlowLogo />
      </header>

      <Hero />
      <StatsSection />
      <UseCases />

      <footer className="py-10 border-t border-slate-100 text-center text-slate-400 text-sm px-4">
        {`© ${new Date().getFullYear()} ApplyFlow. All rights reserved`}
      </footer>
    </div>
  );
}
