import { motion } from "framer-motion";
import { Zap, ArrowRight } from "lucide-react";
import { Button } from "~/components/Button";
import { HeroAnimation } from "./HeroAnimation";
import { useNavigate } from "react-router";

export function Hero() {
  let navigate = useNavigate();
  return (
    <section className="relative bg-white overflow-hidden">
      <div className="absolute top-[5%] left-[10%] w-[40%] h-[40%] bg-blue-50/50 rounded-full blur-[120px] -z-10" />

      <div className="max-w-[1400px] mx-auto px-6 pt-12 pb-16 lg:pt-2 lg:pb-32 flex flex-col lg:flex-row items-center gap-12">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex-1 space-y-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-[11px] font-black uppercase tracking-widest">
            <Zap size={14} fill="currentColor" /> AI-Powered Career Revolution
          </div>

          <h1 className="text-5xl lg:text-7xl font-black tracking-tighter leading-[0.95] text-slate-900">
            Let AI handle your <br />
            <span className="text-blue-600 italic">Job Search.</span>
          </h1>

          <p className="text-lg text-slate-500 max-w-xl leading-relaxed">
            Transform your job search with an AI coach that identifies skills
            gaps, tailors your CV contextually, and builds your outreach
            strategy automatically.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Button
              onClick={() => navigate("/app")}
              stiffness={300}
              damping={15}
              className="rounded-2xl px-10 h-14 bg-blue-600 hover:bg-blue-700 shadow-xl shadow-blue-500/20 group"
            >
              Get Started{" "}
              <ArrowRight
                className="ml-2 group-hover:translate-x-1 transition-transform"
                size={18}
              />
            </Button>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex-1 relative w-64 md:w-[450px] lg:w-[600px] aspect-square flex justify-center lg:justify-end"
        >
          <HeroAnimation />
        </motion.div>
      </div>
    </section>
  );
}
