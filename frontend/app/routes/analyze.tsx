import { Form, useNavigation } from "react-router";
import { useState, useEffect } from "react";
import {
  Search as SearchIcon,
  Sparkles,
  Target,
  ArrowLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "~/lib/utils"; // Assuming your utility helper is here

import type { Route } from "./+types/search";
import type { CVMatch } from "~/types/ai";
import { Button } from "~/components/Button";
import { MatchList } from "~/components/MatchList";
import { AnimatePresence, motion } from "motion/react";
import { PageWrapper } from "~/components/PageWrapper";

export async function loader() {
  return { initialMatches: [] as CVMatch[] };
}

export async function action({ request }: Route.ActionArgs) {
  const API_URL = `${import.meta.env.VITE_AI_API_URL}/cv/search-cv`;
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
  const hasSearched = !!actionData;

  const [selectedMatch, setSelectedMatch] = useState<CVMatch | null>(null);

  // Reset selection when new search results arrive to prevent "stale" details
  useEffect(() => {
    setSelectedMatch(null);
  }, [results]);

  return (
    <PageWrapper>
      <div className="flex flex-col lg:flex-row min-h-screen w-full bg-white overflow-hidden">
        {/* LEFT COLUMN: SEARCH & LIST */}
        <div
          className={cn(
            "w-full lg:w-[450px] border-r border-gray-100 flex flex-col bg-white shrink-0 transition-all duration-300",
            selectedMatch ? "hidden lg:flex" : "flex",
          )}
        >
          {/* Header & Form */}
          <div className="p-6 border-b border-gray-100 bg-white/80 backdrop-blur-md sticky top-0 z-10">
            <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 mb-6">
              Search Experience
            </h2>

            <Form method="post" className="space-y-4">
              <textarea
                name="job_description"
                rows={4}
                placeholder="Paste a job description to analyze..."
                className="w-full text-gray-700 bg-gray-50 border border-gray-100 rounded-2xl py-4 px-5 text-sm focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all resize-none shadow-inner"
                required
              />

              <Button
                type="submit"
                isLoading={isSearching}
                loadingText="Scanning Vectors..."
                variant="primary"
                icon={<Sparkles size={16} />}
                className="shadow-xl shadow-blue-500/10"
              >
                Compare against CV
              </Button>
            </Form>
          </div>

          {/* Results Area */}
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            <AnimatePresence mode="wait">
              {isSearching ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="p-6 space-y-4"
                >
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="h-32 bg-gray-50 animate-pulse rounded-2xl border border-gray-100"
                    />
                  ))}
                </motion.div>
              ) : hasSearched && results.length > 0 ? (
                <motion.div
                  key="results"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col"
                >
                  <div className="px-6 py-3 bg-blue-50/50 border-b border-blue-100/50 flex justify-between items-center">
                    <span className="text-[10px] font-black uppercase tracking-widest text-blue-600">
                      {results.length} Potential Matches
                    </span>
                    <span className="text-[10px] font-bold text-blue-400 flex items-center gap-1">
                      Select one <ChevronRight size={10} />
                    </span>
                  </div>

                  <MatchList
                    results={results}
                    setSelectedMatch={setSelectedMatch}
                    selectedMatch={selectedMatch}
                  />
                </motion.div>
              ) : hasSearched && results.length === 0 ? (
                <div className="p-12 text-center">
                  <p className="text-sm font-bold text-gray-400">
                    No relevant matches found.
                  </p>
                </div>
              ) : (
                <div className="p-12 text-center opacity-40">
                  <SearchIcon
                    size={32}
                    className="mx-auto mb-4 text-gray-300"
                  />
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                    Awaiting Input
                  </p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* RIGHT COLUMN: DETAIL & ANALYSIS */}
        <main
          className={cn(
            "flex-1 bg-[#fafafa] relative transition-all duration-300 flex flex-col",
            selectedMatch
              ? "overflow-y-auto flex"
              : "overflow-hidden hidden lg:flex",
          )}
        >
          <AnimatePresence mode="wait">
            {selectedMatch ? (
              <motion.div
                key={JSON.stringify(selectedMatch.content)}
                initial={{ opacity: 0, x: 20, scale: 0.99 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: -20, scale: 0.99 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="p-6 md:p-10 max-w-4xl mx-auto space-y-8 w-full"
              >
                {/* Mobile Navigation */}
                <button
                  onClick={() => setSelectedMatch(null)}
                  className="lg:hidden flex items-center gap-2 text-blue-600 font-bold text-sm mb-4"
                >
                  <ArrowLeft size={16} /> Back to Matches
                </button>

                {/* Call to Action Card */}
                <div className="bg-emerald-500 text-white p-8 rounded-[2.5rem] flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-2xl shadow-emerald-500/20">
                  <div className="space-y-1">
                    <h3 className="font-black text-xl tracking-tight">
                      Tailor resume for this job
                    </h3>
                    <p className="text-emerald-50 opacity-90 text-sm font-medium">
                      Optimize your impact using this vector context.
                    </p>
                  </div>
                  <Button
                    className="w-full md:w-auto px-8 bg-white text-emerald-700 hover:bg-emerald-50 border-none shadow-lg"
                    size="compact"
                  >
                    Tailor Now
                  </Button>
                </div>

                {/* Analysis Section */}
                <section className="space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="h-1 w-10 bg-blue-500 rounded-full" />
                    <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em]">
                      Source Context Match
                    </h4>
                  </div>

                  <div className="p-8 md:p-12 bg-white rounded-[3rem] border border-gray-100 shadow-sm text-gray-700 leading-relaxed relative overflow-hidden">
                    {/* Decorative Quote Icons */}
                    <span className="hidden md:block absolute top-8 left-8 text-6xl text-blue-50/80 font-serif leading-none">
                      “
                    </span>

                    <p className="relative z-10 text-lg md:text-xl font-medium text-gray-600 italic md:px-8">
                      {selectedMatch.content}
                    </p>

                    <span className="hidden md:block absolute bottom-8 right-8 text-6xl text-blue-50/80 font-serif leading-none rotate-180">
                      “
                    </span>

                    {/* Subtle Background Accent */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50/30 rounded-full blur-3xl -mr-16 -mt-16" />
                  </div>
                </section>
              </motion.div>
            ) : (
              <motion.div
                key="empty-hint"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-1 flex-col items-center justify-center text-center p-10"
              >
                {hasSearched && !isSearching ? (
                  <div className="space-y-6">
                    <div className="relative inline-block">
                      <div className="absolute -inset-4 bg-blue-500/10 rounded-full blur-2xl animate-pulse" />
                      <div className="relative p-8 bg-white rounded-full shadow-2xl shadow-blue-500/10 border border-blue-50">
                        <Target size={48} className="text-blue-500" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <h2 className="text-xl font-black text-gray-900 tracking-tight">
                        Select a Match
                      </h2>
                      <p className="text-sm text-gray-400 max-w-[280px] mx-auto leading-relaxed">
                        We found relevant experience in your CV. Click a card on
                        the left to analyze the match context.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6 group">
                    <div className="relative">
                      <div className="absolute inset-0 bg-blue-500/5 blur-3xl rounded-full scale-150" />
                      <SearchIcon
                        size={80}
                        strokeWidth={1}
                        className="relative mx-auto text-gray-300 transition-transform group-hover:scale-110 duration-500"
                      />
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400">
                      Search to analyze
                    </p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </PageWrapper>
  );
}
