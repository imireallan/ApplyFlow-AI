import { motion, AnimatePresence } from "motion/react";
import { useNavigation } from "react-router";

export function GlobalSpinner() {
  const navigation = useNavigation();
  const isLoading = navigation.state === "loading";

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center backdrop-blur-md"
        >
          <div className="absolute w-64 h-64 bg-blue-500/10 blur-[100px] rounded-full" />

          <div className="relative h-24 w-24 flex items-center justify-center">
            {/* Outer Orbit Ring */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
              className="absolute inset-0 border-2 border-dashed border-blue-200/50 rounded-full"
            />

            {/* Inner "Core" - Pulsing Brand Logo/Shape */}
            <motion.div
              animate={{ scale: [1, 1.1, 1], opacity: [0.7, 1, 0.7] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
              className="w-10 h-10 bg-blue-600 rounded-2xl shadow-[0_0_30px_rgba(37,99,235,0.4)] flex items-center justify-center"
            >
              <div className="w-4 h-4 bg-white rounded-full animate-pulse" />
            </motion.div>

            {/* Orbiting Data Nodes */}
            {[0, 120, 240].map((angle, i) => (
              <motion.div
                key={i}
                className="absolute w-3 h-3 bg-blue-400 rounded-full shadow-[0_0_15px_rgba(96,165,250,0.6)]"
                animate={{
                  rotate: [angle, angle + 360],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 2,
                  ease: "easeInOut",
                  delay: i * 0.1,
                }}
                style={{
                  originX: "50%",
                  originY: "50%",
                  transform: `rotate(${angle}deg) translate(40px)`,
                }}
              />
            ))}
          </div>
          <div className="mt-12 flex flex-col items-center gap-1">
            <motion.span
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-600"
            >
              Analyzing Profile
            </motion.span>
            <span className="text-[9px] font-medium text-slate-400 uppercase tracking-widest">
              Contextualizing Skills...
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
