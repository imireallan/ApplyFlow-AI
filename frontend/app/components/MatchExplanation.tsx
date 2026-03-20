import { motion } from "motion/react";

interface MatchExplanationPanelProps {
  score: number;
  reasoning: string;
}

export function MatchExplanationPanel({
  score,
  reasoning,
}: MatchExplanationPanelProps) {
  return (
    <section className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-6 sm:p-8 space-y-4">
      {/* SCORE */}
      <div className="flex items-center justify-between">
        <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em]">
          Match Score
        </h4>
        <div>
          <span className="text-4xl font-black text-blue-600 leading-none">
            {score}
          </span>
          <span className="text-gray-300 text-2xl font-bold">/ 10</span>
        </div>
      </div>

      {/* DIVIDER */}
      <div className="h-px bg-gray-100" />

      {/* WHY THIS SCORED */}
      <div className="space-y-2">
        <p className="text-xs font-bold uppercase tracking-wide text-gray-400">
          Why this scored {score} /10
        </p>

        <motion.p
          key={reasoning}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm sm:text-base text-gray-700 leading-relaxed"
        >
          {reasoning}
        </motion.p>
      </div>
    </section>
  );
}
