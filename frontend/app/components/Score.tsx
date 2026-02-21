import { motion } from "motion/react";

export function Score({ score }: { score: number }) {
  const percentage = Math.round(score * 100);
  const radius = 18;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const getColor = (s: number) => {
    if (s >= 0.8) return "text-emerald-500";
    if (s >= 0.5) return "text-blue-500";
    return "text-amber-500";
  };

  const colorClass = getColor(score);

  return (
    <div className="absolute top-3 right-3 flex items-center justify-center w-14 h-14">
      <div
        className={`absolute inset-0 opacity-20 blur-xl rounded-full ${colorClass.replace("text", "bg")}`}
      />

      <svg className="absolute w-full h-full -rotate-90">
        <circle
          cx="28"
          cy="28"
          r={radius}
          stroke="currentColor"
          strokeWidth="4"
          fill="transparent"
          className="text-slate-100"
        />
        <motion.circle
          cx="28"
          cy="28"
          r={radius}
          stroke="currentColor"
          strokeWidth="4"
          fill="transparent"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.5, ease: "circOut", delay: 0.5 }}
          strokeLinecap="round"
          className={colorClass}
        />
      </svg>

      <div className="relative flex flex-col items-center">
        <span className="text-[12px] font-black text-slate-900 tabular-nums">
          {percentage}
        </span>
        <span
          className={`text-[8px] font-bold uppercase tracking-tighter -mt-1 ${colorClass}`}
        >
          %
        </span>
      </div>
    </div>
  );
}
