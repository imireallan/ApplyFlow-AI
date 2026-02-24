import { Hero } from "~/components/marketing/Hero";
import { UseCases } from "~/components/marketing/UseCases";
import { StatsSection } from "~/components/marketing/StatsSection";
import { HowItWorks } from "~/components/marketing/HowItWorks";
import { Testimonials } from "~/components/marketing/Testimonials";
import { FAQ } from "~/components/marketing/FAQ";
import { TrustSection } from "~/components/marketing/TrustSection";
import { FinalCTA } from "~/components/marketing/FinalCTA";
import { ApplyFlowLogo } from "~/components/Logo";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      <header className="flex items-center justify-between px-4 sm:px-6 lg:px-8 h-14 sm:h-16 bg-white border-b border-slate-100">
        <ApplyFlowLogo />

        <nav className="hidden md:flex items-center gap-8">
          <a
            href="#how-it-works"
            className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
          >
            How It Works
          </a>
          <a
            href="#features"
            className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
          >
            Features
          </a>
          <a
            href="#testimonials"
            className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
          >
            Success Stories
          </a>
          <a
            href="#faq"
            className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
          >
            FAQ
          </a>
        </nav>
      </header>

      <Hero />
      <StatsSection />
      <HowItWorks />
      <UseCases />
      <Testimonials />
      <FAQ />
      <TrustSection />
      <FinalCTA />

      <footer className="py-10 bg-slate-900 text-center text-slate-400 text-sm px-4">
        <p className="mb-4">
          &copy; {new Date().getFullYear()} ApplyFlow. All rights reserved.
        </p>
        <div className="flex justify-center gap-6 text-xs">
          <a href="#" className="hover:text-white transition-colors">
            Privacy Policy
          </a>
          <a href="#" className="hover:text-white transition-colors">
            Terms of Service
          </a>
          <a href="#" className="hover:text-white transition-colors">
            Contact
          </a>
        </div>
      </footer>
    </div>
  );
}
