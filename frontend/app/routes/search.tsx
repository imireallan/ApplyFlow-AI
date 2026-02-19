import { Form, useNavigation } from "react-router";
import { useState, useEffect } from "react";
import { Search as SearchIcon, Sparkles } from "lucide-react";
import type { Route } from "./+types/search";
import type { CVMatch } from "~/types/ai";
import { Button } from "~/components/Button";
import { MatchList } from "~/components/MatchList";
import { cn } from "~/lib/utils";
import { AnimatePresence, motion } from "motion/react";
import { PageWrapper } from "~/components/PageWrapper";

const API_URL = `${import.meta.env.VITE_AI_API_URL}/cv/search-cv`;

export async function loader() {
  // await delay(5000)
  return { initialMatches: [] as CVMatch[] };
}

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const query = formData.get("job_description");

  if (!query || query.toString().trim() === "") {
    return { results: [] };
  }

  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ job_description: query, top_k: 5 }),
  });

  const data = await response.json();
  return { results: data.matches as CVMatch[] };
}

export default function CVSearch({ actionData }: Route.ComponentProps) {
  const results = actionData?.results ?? [];

  const navigation = useNavigation();
  const isSearching = navigation.state === "submitting";

  // Track if a search has ever been performed to show/hide the results area
  const hasSearched = !!actionData;

  const [selectedMatch, setSelectedMatch] = useState<CVMatch | null>(null);

  useEffect(() => {
    if (results.length > 0) {
      setSelectedMatch(results[0]);
    } else {
      setSelectedMatch(null);
    }
  }, [results]);

  return (
    <PageWrapper>
      <div className="flex flex-col lg:flex-row min-h-screen bg-white overflow-hidden">
        {/* LEFT COLUMN: Fixed width on desktop, full width on mobile */}
        <div
          className={cn(
            "w-full lg:w-[450px] border-r border-gray-100 flex flex-col bg-white shrink-0",
            // Hide sidebar on mobile if a match is selected (optional: for a focused mobile detail view)
            selectedMatch ? "hidden lg:flex" : "flex",
          )}
        >
          {/* FORM SECTION */}
          <div className="p-4 md:p-6 border-b border-gray-100">
            <h2 className="text-sm font-black uppercase tracking-[0.2em] text-gray-400 mb-4 md:mb-6">
              Search Experience
            </h2>
            <Form method="post" className="space-y-4">
              <textarea
                name="job_description"
                rows={3}
                placeholder="Paste a job description to search..."
                className="w-full text-gray-700 bg-gray-50 border border-gray-100 rounded-2xl py-4 px-5 text-sm outline-none transition-all resize-none shadow-inner"
                required
              />
              <Button
                isLoading={isSearching}
                variant="primary"
                icon={<Sparkles size={16} />}
                className="w-full"
              >
                Compare against CV
              </Button>
            </Form>
          </div>

          {/* RESULTS LIST */}
          <div className="flex-1 overflow-y-auto">
            <AnimatePresence>
              {hasSearched && !isSearching ? (
                <MatchList
                  results={results}
                  setSelectedMatch={setSelectedMatch}
                  selectedMatch={selectedMatch}
                />
              ) : isSearching ? (
                <div className="p-6 space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="h-24 bg-gray-50 animate-pulse rounded-2xl"
                    />
                  ))}
                </div>
              ) : (
                <div className="p-10 text-center text-gray-300">
                  <p className="text-xs font-bold uppercase tracking-widest">
                    No results yet
                  </p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* RIGHT COLUMN: DETAIL & ANALYSIS */}
        <main
          className={cn(
            "flex-1 bg-[#fafafa] overflow-y-auto relative transition-all duration-300",
            // On mobile, if no match is selected, hide the main area or show empty state
            !selectedMatch ? "hidden lg:flex lg:flex-col" : "flex flex-col",
          )}
        >
          {/* Mobile Back Button (Visible only on small screens when a match is selected) */}
          {selectedMatch && (
            <div className="lg:hidden p-4 bg-white border-b border-gray-100 flex items-center">
              <button
                onClick={() => setSelectedMatch(null)}
                className="text-sm font-bold text-blue-600 flex items-center gap-2"
              >
                ← Back to results
              </button>
            </div>
          )}

          <AnimatePresence mode="wait">
            {selectedMatch ? (
              <motion.div
                key={JSON.stringify(selectedMatch.content)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="p-6 md:p-10 max-w-4xl mx-auto space-y-6 md:space-y-8 w-full"
              >
                {/* Call to Action Card - Stack items on mobile */}
                <div className="bg-emerald-500 text-white p-6 md:p-8 rounded-[2rem] flex flex-col md:flex-row gap-6 justify-between items-start md:items-center shadow-2xl shadow-emerald-500/20">
                  <div className="space-y-1">
                    <h3 className="font-black text-lg md:text-xl tracking-tight">
                      Tailor resume for this job
                    </h3>
                    <p className="text-emerald-50 opacity-90 text-sm font-medium">
                      Boost your match rate using this context.
                    </p>
                  </div>
                  <Button
                    className="w-full md:w-auto px-6 bg-white text-emerald-700 hover:bg-emerald-50 border-none shadow-lg"
                    size="compact"
                  >
                    Tailor Now
                  </Button>
                </div>

                {/* Analysis Section */}
                <section className="space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="h-1 w-8 bg-blue-500 rounded-full" />
                    <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">
                      Vector Context Match
                    </h4>
                  </div>

                  <div className="p-6 md:p-8 bg-white rounded-[2rem] border border-gray-100 shadow-sm text-gray-700 leading-relaxed relative">
                    <span className="hidden md:block absolute top-4 left-4 text-4xl text-blue-100 font-serif">
                      “
                    </span>
                    <p className="relative z-10 text-base md:text-lg font-medium text-gray-600 italic md:px-4">
                      {selectedMatch.content}
                    </p>
                    <span className="hidden md:block absolute bottom-4 right-4 text-4xl text-blue-100 font-serif rotate-180">
                      “
                    </span>
                  </div>
                </section>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="h-full flex flex-col items-center justify-center text-gray-400 p-10 text-center"
              >
                <div className="p-6 bg-white rounded-full shadow-xl shadow-gray-200/50 mb-6">
                  <SearchIcon
                    size={40}
                    strokeWidth={1.5}
                    className="text-blue-500 animate-pulse"
                  />
                </div>
                <p className="text-sm font-bold uppercase tracking-widest text-gray-300">
                  Ready for Analysis
                </p>
                <p className="text-sm text-gray-400 mt-2 max-w-[200px]">
                  Paste a description to find relevant CV matches.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </PageWrapper>
  );
}
