import { CheckCircle, ClipboardIcon, MessageSquare } from "lucide-react";
import { useState } from "react";
import { cn } from "~/helpers/utils";

interface NudgeCardProps {
  nudge: string;
}

export function NudgeCard({ nudge }: NudgeCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(nudge);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="bg-[#1a1d23] text-white p-8 md:p-12 rounded-[3rem] shadow-2xl relative overflow-hidden border border-white/5 flex flex-col">
      <div className="flex md:flex-col gap-4 mb-8 relative z-10">
        <div className="flex items-center gap-3 w-1/2 md:w-full">
          <div className="p-2.5 bg-blue-500/20 rounded-xl text-blue-400">
            <MessageSquare size={20} />
          </div>
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400">
            Message to Recruiter
          </h3>
        </div>
      </div>
      <p className="text-xl md:text-2xl font-bold leading-relaxed text-gray-100 relative z-10 break-words">
        {nudge}
      </p>
      <button
        onClick={handleCopy}
        className={cn(
          "flex items-center gap-2 px-4 py-2 mt-6 rounded-full font-black transition-all active:scale-95 shadow-lg self-end",
          "text-[11px] sm:text-xs",
          "px-3 sm:px-6 py-1.5 sm:py-3",
          copied
            ? "bg-emerald-500 text-white"
            : "bg-white text-black hover:bg-blue-50",
        )}
      >
        {copied ? <CheckCircle size={14} /> : <ClipboardIcon size={14} />}
        <span className="leading-none">
          {copied ? "Copied!" : "Copy Ready Message"}
        </span>
      </button>
      <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />
    </section>
  );
}
