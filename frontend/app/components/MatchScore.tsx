interface MatchScoreProps {
  score: number;
}

export function MatchScore({ score }: MatchScoreProps) {
  return (
    <div className="xl:col-span-4 bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm flex flex-col justify-center relative min-h-[160px]">
      <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">
        Fit Score
      </h3>
      <div className="flex items-baseline gap-2">
        <span className="text-6xl font-black text-blue-600 leading-none">
          {score}
        </span>
        <span className="text-gray-300 text-2xl font-bold">/ 10</span>
      </div>
    </div>
  );
}
