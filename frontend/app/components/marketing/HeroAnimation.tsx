import Lottie from "lottie-react";
import { motion } from "motion/react";

import robotAnimation from "~/assets/chatbot.json";

export function HeroAnimation() {
  return (
    <div className="relative w-full h-[400px] md:h-[600px] flex items-center justify-center">
      <div className="absolute w-2/3 h-2/3 bg-blue-500/10 blur-[120px] rounded-full" />

      <div className="relative z-10 w-full h-full max-w-[500px]">
        <Lottie
          animationData={robotAnimation}
          loop={true}
          className="w-full h-full"
          style={{
            width: "100%",
            height: "100%",
            filter: "hue-rotate(433deg) saturate(30)",
          }}
        />
      </div>

      {/* TODO: Add this section later */}

      {/* <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{
          opacity: 1,
          y: [0, -15, 0],
        }}
        transition={{
          y: { repeat: Infinity, duration: 4, ease: "easeInOut" },
        }}
        className="absolute top-[30%] right-4 md:right-10 z-20 flex items-center gap-3 bg-white/80 backdrop-blur-xl border border-white/40 p-3 pr-5 rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.1)]"
      >
        <div className="bg-blue-600 rounded-full p-2 text-white shadow-lg shadow-blue-500/40">
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>
        <div className="flex flex-col">
          <span className="text-[11px] font-black text-slate-800 uppercase tracking-tight">
            Try Interactive Demo
          </span>
          <span className="text-[10px] text-slate-400 font-bold">
            2:33 / 5:00
          </span>
        </div>
      </motion.div> */}
    </div>
  );
}
