import {
  Form,
  useActionData,
  useLoaderData,
  useNavigation,
} from "react-router";
import { useState } from "react";
import {
  Search as SearchIcon,
  MapPin,
  CheckCircle,
  Target,
  Sparkles,
} from "lucide-react";
import type { Route } from "./+types/search";
import type { CVMatch } from "~/types/ai";

const API_URL = `${import.meta.env.VITE_AI_API_URL}/cv/search-cv`;

export async function loader() {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      job_description: "General professional experience",
      top_k: 3,
    }),
  });
  const data = await response.json();
  return { initialMatches: data.matches as CVMatch[] };
}

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const query = formData.get("job_description");

  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ job_description: query, top_k: 5 }),
  });

  const data = await response.json();
  return { results: data.matches as CVMatch[] };
}

export default function CVSearch({
  loaderData,
  actionData,
}: Route.ComponentProps) {
  const { initialMatches } = loaderData;
  const results = actionData?.results ?? initialMatches;

  const navigation = useNavigation();
  const isSearching = navigation.state === "submitting";

  const [selectedMatch, setSelectedMatch] = useState<CVMatch | null>(null);

  return (
    <div className="flex h-full bg-white">
      <div className="w-[450px] border-r border-gray-100 flex flex-col bg-white">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-sm font-black uppercase tracking-widest text-gray-400 mb-4">
            Search Experience
          </h2>
          <Form method="post" className="space-y-4">
            <div className="relative">
              <textarea
                name="job_description"
                rows={4}
                placeholder="Paste a job description or specific skill set to search against your CV..."
                className="w-full text-gray-600 bg-gray-50 border border-transparent rounded-2xl py-3 px-4 text-sm focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all resize-none"
                required
              />
            </div>
            <button
              type="submit"
              disabled={isSearching}
              className="w-full bg-[#1a1d23] text-white py-3 rounded-xl font-bold text-xs uppercase tracking-tighter flex items-center justify-center gap-2 hover:bg-black transition-all"
            >
              {isSearching ? (
                "Scanning Vectors..."
              ) : (
                <>
                  <Sparkles size={14} /> Compare against CV
                </>
              )}
            </button>
          </Form>
        </div>
        {/* RESULT CARDS */}
        <div className="flex-1 overflow-y-auto bg-gray-50/50 p-4 space-y-3">
          {results.length > 0 ? (
            results.map((match, idx) => (
              <button
                key={idx}
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
            ))
          ) : (
            <div className="text-center py-10 text-gray-400 text-sm italic">
              No matches found. Try a different description.
            </div>
          )}
        </div>
      </div>

      {/* DETAIL & ANALYSIS COLUMN */}
      <div className="flex-1 bg-white overflow-y-auto">
        {selectedMatch ? (
          <div className="p-10 max-w-4xl mx-auto space-y-10">
            <div className="bg-[#10b981] text-white p-6 rounded-2xl flex justify-between items-center shadow-md">
              <div>
                <h3 className="font-bold text-lg">
                  Tailor resume for this job
                </h3>
                <p className="text-emerald-50 opacity-90 text-sm">
                  Stand out with a tailored CV.
                </p>
              </div>
              <button className="bg-white text-emerald-700 px-5 py-2 rounded-lg font-bold text-sm shadow-sm hover:bg-emerald-50">
                Tailor Resume
              </button>
            </div>

            <section>
              <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">
                Full Context
              </h4>
              <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100 text-gray-700 leading-loose italic">
                "{selectedMatch.content}"
              </div>
            </section>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-gray-300">
            <SearchIcon size={48} strokeWidth={1} className="mb-4 opacity-20" />
            <p className="italic">
              Paste a description on the left to analyze match
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
