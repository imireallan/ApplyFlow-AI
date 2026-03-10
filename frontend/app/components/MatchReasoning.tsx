interface MatchReasoningProps {
  reasoning: string;
}

export function MatchReasoning({ reasoning }: MatchReasoningProps) {
  return (
    <div className="xl:col-span-8 bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm flex flex-col justify-center min-w-0">
      <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3">
        Why This Fits You
      </h3>
      <p className="text-lg md:text-xl text-gray-700 font-medium italic leading-relaxed border-l-4 border-blue-100 pl-6 break-words">
        "{reasoning}"
      </p>
    </div>
  );
}
