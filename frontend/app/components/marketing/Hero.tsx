import { AnimatePresence, motion, useSpring, useTransform } from "motion/react";
import { Button } from "~/components/Button";
import { HeroAnimation } from "./HeroAnimation";
import { useNavigate } from "react-router";
import { useMousePosition } from "~/hooks/useMousePosition";
import { ScanningLine } from "~/components/ScanningLine";
import { MagneticWrapper } from "~/components/MagneticWrapper";
import { Typewriter } from "../TypeWriter";

const phrases = [
  "Resume Analysis.",
  "Job Matching.",
  "Recruiter Messages.",
  "Fit Score.",
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.3 },
  },
};

const item = {
  hidden: { y: 20, opacity: 0 },
  show: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 300, damping: 24 },
  },
} as const;

export function Hero() {
  const navigate = useNavigate();
  const { x, y } = useMousePosition();

  const springConfig = { damping: 25, stiffness: 150 };
  const smoothX = useSpring(x, springConfig);
  const smoothY = useSpring(y, springConfig);

  const glowX = useTransform(smoothX, [-1, 1], [-10, 10]);
  const glowY = useTransform(smoothY, [-1, 1], [-10, 10]);

  const robotX = useTransform(smoothX, [-1, 1], [20, -20]);
  const robotY = useTransform(smoothY, [-1, 1], [20, -20]);

  const dustX = useTransform(smoothX, [-1, 1], [-30, 30]);
  const dustY = useTransform(smoothY, [-1, 1], [-30, 30]);

  return (
    <section className="relative min-h-[85vh] flex flex-col lg:flex-row items-center justify-center px-4 sm:px-6 py-16 lg:py-0 overflow-hidden bg-white">
      {/* Content */}
      <div className="w-full lg:w-1/2 flex flex-col items-center lg:items-start text-center lg:text-left z-20 space-y-5">
        <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-[10px] sm:text-xs font-bold uppercase tracking-widest">
          AI-Powered Career Assistant
        </span>

        <motion.h1
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-[1] text-gray-900"
          variants={container}
          initial="hidden"
          animate="show"
        >
          <motion.span variants={item}>ApplyFlow</motion.span>{" "}
          <motion.span variants={item}>AI</motion.span>
          <br />
          <Typewriter phrases={phrases} variants={item} />
        </motion.h1>

        <p className="max-w-sm sm:max-w-md text-gray-500 text-base sm:text-lg font-medium leading-relaxed px-2 sm:px-0">
          Upload your resume, paste a job description, and get instant insights
          on how well you fit the role - plus a ready-to-send message for the
          recruiter.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <Button
            onClick={() => navigate("/login")}
            className="w-full sm:w-auto px-6 shadow-xl shadow-blue-500/20"
          >
            Start Now - It's Free
          </Button>

          <Button variant="outline" className="w-full sm:w-auto">
            See How It Works
          </Button>
        </div>
      </div>

      {/* Animation Side */}
      <div className="w-full lg:w-1/2 relative flex items-center justify-center mt-10 lg:mt-0">
        {/* Glow */}
        <motion.div
          style={{ x: glowX, y: glowY }}
          className="absolute w-[280px] sm:w-[350px] h-[220px] bg-blue-500/10 blur-[80px] rounded-full"
        />

        {/* Robot */}
        <motion.div style={{ x: robotX, y: robotY }} className="relative z-10">
          <ScanningLine />
          <HeroAnimation />
        </motion.div>

        {/* Particles */}
        <motion.div
          style={{ x: dustX, y: dustY }}
          className="absolute inset-0 pointer-events-none"
        >
          <div className="absolute top-1/4 right-1/4 w-2 h-2 bg-blue-400/40 rounded-full blur-[1px]" />
          <div className="absolute bottom-1/3 left-1/4 w-1.5 h-1.5 bg-blue-300/30 rounded-full blur-[1px]" />
        </motion.div>
      </div>
    </section>
  );
}
