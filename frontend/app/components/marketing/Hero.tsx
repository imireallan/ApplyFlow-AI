import { AnimatePresence, motion, useSpring, useTransform } from "motion/react";
import { Button } from "~/components/Button";
import { HeroAnimation } from "./HeroAnimation";
import { useNavigate } from "react-router";
import { useMousePosition } from "~/hooks/useMousePosition";
import { ScanningLine } from "~/components/ScanningLine";
import { MagneticWrapper } from "~/components/MagneticWrapper";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export function Hero() {
  const navigate = useNavigate();
  const { x, y } = useMousePosition();

  // 1. Create smoothed springs from the raw motion values
  const springConfig = { damping: 25, stiffness: 150 };
  const smoothX = useSpring(x, springConfig);
  const smoothY = useSpring(y, springConfig);

  // 2. Transform the smooth values into pixel offsets for each layer
  // Background Glow: subtle movement
  const glowX = useTransform(smoothX, [-1, 1], [-20, 20]);
  const glowY = useTransform(smoothY, [-1, 1], [-20, 20]);

  // Robot: inverse movement for depth (Parallax)
  const robotX = useTransform(smoothX, [-1, 1], [40, -40]);
  const robotY = useTransform(smoothY, [-1, 1], [40, -40]);

  // Digital Dust: high intensity movement
  const dustX = useTransform(smoothX, [-1, 1], [-60, 60]);
  const dustY = useTransform(smoothY, [-1, 1], [-60, 60]);

  return (
    <section className="relative min-h-[90vh] flex flex-col lg:flex-row items-center justify-center px-6 py-12 lg:py-0 overflow-hidden bg-white">
      {/* 1. Content Block: Priority on Mobile */}
      <div className="w-full lg:w-1/2 flex flex-col items-center lg:items-start text-center lg:text-left z-20 space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="px-4 py-1.5 rounded-full bg-blue-50 text-blue-600 text-xs font-bold uppercase tracking-widest mb-4 inline-block">
            Powered by Llama 3.3
          </span>
        </motion.div>
        <motion.h1
          className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter leading-[0.9] text-gray-900"
          variants={container}
          initial="hidden"
          animate="show"
        >
          <motion.span variants={item}>Precision</motion.span>{" "}
          <motion.span variants={item}>AI</motion.span>
          <br />
          <motion.span className="text-blue-600" variants={item}>
            CV Analysis.
          </motion.span>
        </motion.h1>

        <p className="max-w-md text-gray-500 text-lg md:text-xl font-medium leading-relaxed">
          The ultimate RAG-powered engine to tailor your experience for the
          world's most competitive roles.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <MagneticWrapper>
            <Button
              onClick={() => navigate("/app")}
              stiffness={300}
              damping={15}
              className="px-8 shadow-2xl shadow-blue-500/20"
            >
              Get Started
            </Button>
          </MagneticWrapper>
          <Button variant="outline">View Demo</Button>
        </div>
      </div>

      <div className="w-full lg:w-1/2 relative flex items-center justify-center">
        {/* Layer 1: Background Glow */}
        <motion.div
          style={{ x: glowX, y: glowY }}
          className="absolute w-full max-w-[400px] h-[300px] bg-blue-500/10 blur-[100px] rounded-full"
        />

        {/* Layer 2: The Robot */}
        <motion.div style={{ x: robotX, y: robotY }} className="relative z-10">
          <ScanningLine />
          <HeroAnimation />
          {/* Subtle "Data Points" appearing during scan */}
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="absolute -right-4 top-1/4"
            >
              <div className="flex flex-col gap-1">
                <div className="h-1 w-4 bg-blue-400/40 rounded-full" />
                <div className="h-1 w-6 bg-blue-400/20 rounded-full" />
              </div>
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* Layer 3: Floating Particles */}
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
