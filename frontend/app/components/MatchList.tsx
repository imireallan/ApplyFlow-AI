import type { CVMatch } from "~/types/ai";
import { Match } from "./Match";
import { motion } from "motion/react";

interface MatchListProp {
  results: {
    content: string;
    score: number;
  }[];
  setSelectedMatch: (value: React.SetStateAction<CVMatch | null>) => void;
  selectedMatch: CVMatch | null;
}

const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.5 },
  },
};
const item = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export function MatchList({
  results,
  selectedMatch,
  setSelectedMatch,
}: MatchListProp) {
  return (
    <motion.ul
      initial="hidden"
      animate="visible"
      variants={container}
      className="flex-1 overflow-y-auto bg-gray-50/50 p-4 space-y-3"
    >
      {results.length > 0 ? (
        results.map((match, idx) => (
          <motion.li variants={item} key={idx}>
            <Match
              match={match}
              selectedMatch={selectedMatch}
              setSelectedMatch={setSelectedMatch}
            />
          </motion.li>
        ))
      ) : (
        <div className="text-center py-10 text-gray-400 text-sm italic">
          No matches found. Try a different description.
        </div>
      )}
    </motion.ul>
  );
}
