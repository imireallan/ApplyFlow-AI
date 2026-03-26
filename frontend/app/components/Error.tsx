import { AlertCircle } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

type Error = {
  title: string;
  message: string;
};

export function ErrorComponent(error: Error) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="mt-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex gap-3"
      >
        <AlertCircle className="text-red-500 shrink-0" size={18} />
        <div>
          <h3 className="text-[11px] font-bold text-red-900 uppercase tracking-tight">
            {error.title}
          </h3>
          <p className="text-[11px] text-red-700/80 leading-relaxed mt-0.5">
            {error.message}
          </p>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
