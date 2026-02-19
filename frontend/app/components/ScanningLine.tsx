import { motion } from "motion/react";

export function ScanningLine() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-[3rem]">
      {/* The Moving Line */}
      <motion.div
        initial={{ top: "-10%" }}
        animate={{ top: "110%" }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute left-0 w-full h-20 bg-gradient-to-b from-transparent via-blue-500/20 to-transparent z-20"
      >
        {/* The Bright Leading Edge */}
        <div className="w-full h-[1px] bg-blue-400/50 shadow-[0_0_15px_rgba(96,165,250,0.5)]" />
      </motion.div>
    </div>
  );
}