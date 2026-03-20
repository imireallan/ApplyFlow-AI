import { useState } from "react";

interface CVContextBlockProps {
  content: string;
  highlights?: string[];
  insight?: string; // short, punchy (replaces long explanation)
  missingSkills?: string[];
  improvedContent?: string;
}

function highlightText(text: string, highlights: string[] = []) {
  if (!highlights.length) return text;

  const regex = new RegExp(`(${highlights.join("|")})`, "gi");

  return text.split(regex).map((part, i) =>
    highlights.some((h) => h.toLowerCase() === part.toLowerCase()) ? (
      <span
        key={i}
        className="bg-blue-100 text-blue-700 px-1 rounded font-semibold"
      >
        {part}
      </span>
    ) : (
      part
    ),
  );
}

export function CVContextBlock({
  content,
  highlights = [],
  insight,
  missingSkills = [],
  improvedContent,
}: CVContextBlockProps) {
  const [showImproved, setShowImproved] = useState(false);

  return (
    <section className="space-y-4">
      {/* HEADER */}
      <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em] ml-2">
        Resume Evidence
      </h4>

      <div className="p-6 sm:p-8 bg-white rounded-[2rem] border border-gray-100 shadow-sm space-y-6">
        {/* 🧠 INSIGHT */}
        {insight && (
          <div className="space-y-1">
            <p className="text-[10px] uppercase tracking-wide text-gray-400">
              Insight
            </p>
            <p className="text-sm text-gray-800">{insight}</p>
          </div>
        )}

        {/* ⚠️ GAPS */}
        {missingSkills.length > 0 && (
          <div className="space-y-2">
            <p className="text-[10px] uppercase tracking-wide text-gray-400">
              Gaps
            </p>
            <div className="flex flex-wrap gap-2">
              {missingSkills.map((skill) => (
                <span
                  key={skill}
                  className="px-2 py-1 text-xs rounded-full bg-red-50 text-red-600 font-medium"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* 📄 EVIDENCE */}
        <div className="space-y-2">
          <p className="text-[10px] uppercase tracking-wide text-gray-400">
            Evidence
          </p>
          <p className="text-sm text-gray-600 leading-relaxed italic break-words">
            {highlightText(content, highlights)}
          </p>
        </div>

        {/* 🚀 CTA */}
        {improvedContent && (
          <div className="pt-2 flex justify-end">
            <button
              onClick={() => setShowImproved((prev) => !prev)}
              className="text-sm font-semibold text-blue-600 hover:underline"
            >
              ✨{" "}
              {showImproved
                ? "Hide improved version"
                : "Boost this section score"}
            </button>
          </div>
        )}

        {/* 🚀 IMPROVED VERSION */}
        {showImproved && improvedContent && (
          <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl">
            <p className="text-[10px] uppercase tracking-wide text-blue-700 mb-2">
              Improved Version
            </p>
            <p className="text-sm text-gray-700 leading-relaxed">
              {improvedContent}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
