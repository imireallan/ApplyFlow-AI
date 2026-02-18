import type { CVMatch } from "~/types/ai";

interface MatchProps {
  setSelectedMatch: (value: React.SetStateAction<CVMatch | null>) => void;
  match: CVMatch;
  selectedMatch: CVMatch | null;
}

export function Match({ match, selectedMatch, setSelectedMatch }: MatchProps) {
  return (
      <button
        onClick={() => setSelectedMatch(match)}
        className={`w-full text-left p-5 rounded-2xl border transition-all duration-200 ${
          selectedMatch === match
            ? "bg-white border-blue-500 shadow-md ring-1 ring-blue-500/20"
            : "bg-white border-gray-100 hover:border-gray-200"
        }`}
      >
        <div className="flex justify-between items-center mb-3">
          <span className="text-[10px] font-bold uppercase tracking-widest text-blue-600 bg-blue-50 px-2 py-1 rounded">
            Match
          </span>

          <span className="text-xs font-medium text-gray-400">
            {(match.score * 100).toFixed(0)}%
          </span>
        </div>

        <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed font-medium">
          {match.content}
        </p>
      </button>
  );
}
