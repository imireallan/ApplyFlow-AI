import { motion } from "motion/react";
import { cn } from "~/lib/utils";
import type { CVMatch } from "~/types/ai";
import { Score } from "./Score";

interface MatchProps {
  setSelectedMatch: (value: React.SetStateAction<CVMatch | null>) => void;
  match: CVMatch;
  selectedMatch: CVMatch | null;
}

export function Match({ match, selectedMatch, setSelectedMatch }: MatchProps) {
  const isSelected = selectedMatch?.content === match.content;

  return (
    <motion.div
      whileHover={{ y: -4 }}
      onClick={() => setSelectedMatch(match)}
      className={cn(
        "relative cursor-pointer p-6 rounded-[2rem] border transition-all duration-300",
        isSelected
          ? "bg-white border-blue-500 shadow-2xl shadow-blue-500/10"
          : "bg-white border-gray-100 hover:border-blue-200 shadow-sm",
      )}
    >
      <Score score={match.score} />
      <div className="pr-12 space-y-3">
        <div className="flex items-center gap-2">
          <span className="flex h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
            Context Analysis
          </span>
        </div>
        <p className="text-[15px] font-bold text-slate-700 leading-snug line-clamp-3">
          {match.content}
        </p>
      </div>
    </motion.div>
  );
}
