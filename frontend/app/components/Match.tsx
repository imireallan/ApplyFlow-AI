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
  const isSelected = selectedMatch?.id === match.id;

  return (
    <motion.div
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => setSelectedMatch(match)}
      className={cn(
        "relative cursor-pointer p-6 rounded-4xl border transition-all duration-300",
        isSelected
          ? "bg-white border-blue-500 shadow-2xl shadow-blue-500/10 ring-1 ring-blue-500/20"
          : "bg-white border-gray-100 hover:border-blue-200 shadow-sm",
      )}
    >
      <Score score={match.match_score} />

      <div className="pr-12 space-y-3">
        <div className="flex items-center gap-2">
          <span
            className={cn(
              "flex h-1.5 w-1.5 rounded-full transition-colors",
              isSelected ? "bg-blue-500 animate-pulse" : "bg-slate-300",
            )}
          />
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
            {isSelected ? "Selected" : "Match"}
          </span>
        </div>

        {/* Displaying Reasoning briefly in the card */}
        <p className="text-[13px] text-blue-600/80 font-semibold italic leading-tight">
          {match.reasoning}
        </p>

        <p className="text-[15px] font-medium text-slate-600 leading-snug line-clamp-2">
          {match.content}
        </p>
      </div>
    </motion.div>
  );
}
