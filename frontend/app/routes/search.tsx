import { Form, useNavigation } from "react-router";
import { useState, useEffect } from "react";
import {
  Search as SearchIcon,
  Sparkles,
  MessageSquare,
  ClipboardIcon,
  CheckCircle,
  ArrowLeft,
  AlertCircle,
} from "lucide-react";
import type { Route } from "./+types/search";
import type { CVMatch } from "~/types/ai";
import { Button } from "~/components/Button";
import { MatchList } from "~/components/MatchList";
import { cn } from "~/lib/utils";
import { AnimatePresence, motion } from "motion/react";
import { PageWrapper } from "~/components/PageWrapper";

const API_URL = `${import.meta.env.VITE_AI_API_URL}/agent/process`;

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

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ job_description: query, top_k: 5 }),
    });

    const data = await response.json();

    if (!response.ok) {
      // Generalizing the error based on status code
      if (response.status === 429) {
        return {
          results: [],
          error: {
            title: "System Overloaded",
            message:
              "We're receiving too many requests right now. Please wait a moment and try again.",
          },
        };
      }

      return {
        results: [],
        error: {
          title: "Search Failed",
          message:
            "Something went wrong while analyzing the job description. Please try again.",
        },
      };
    }

    return { results: data.data as CVMatch[] };
  } catch (error) {
    return {
      results: [],
      error: {
        title: "Connection Error",
        message:
          "Could not reach the analysis server. Check your internet connection.",
      },
    };
  }
}

export default function CVSearch({ actionData }: Route.ComponentProps) {
  const results = actionData?.results ?? [];
  const error = actionData?.error;

  const navigation = useNavigation();
  const isSearching = navigation.state === "submitting";
  const hasSearched = !!actionData;

  const [selectedMatch, setSelectedMatch] = useState<CVMatch | null>(null);
  const [copied, setCopied] = useState(false);

  // Auto-select first match on new results
  useEffect(() => {
    if (results.length > 0) {
      setSelectedMatch(results[0]);
    } else {
      setSelectedMatch(null);
    }
  }, [results]);

  const handleCopy = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <PageWrapper>
      <div className="flex flex-col lg:flex-row h-screen bg-white overflow-hidden">
        {/* LEFT COLUMN: Discovery Sidebar */}
        <div
          className={cn(
            "w-full lg:w-[450px] border-r border-gray-100 flex flex-col bg-white shrink-0 transition-all",
            selectedMatch ? "hidden lg:flex" : "flex",
          )}
        >
          <div className="p-6 border-b border-gray-100 bg-white/50 backdrop-blur-md sticky top-0 z-10">
            <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 mb-6">
              Search Experience
            </h2>
            <Form method="post" className="space-y-4">
              <textarea
                name="job_description"
                rows={4}
                placeholder="Paste the Job Description..."
                className="w-full text-gray-700 bg-gray-50 border border-gray-100 rounded-3xl py-4 px-6 text-sm outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all resize-none shadow-inner"
                required
              />
              <Button
                isLoading={isSearching}
                variant="primary"
                icon={<Sparkles size={16} />}
                className="w-full shadow-xl shadow-blue-500/20"
              >
                Find Best Match
              </Button>
            </Form>
            <AnimatePresence>
              {error && !isSearching && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mt-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex gap-3"
                >
                  <AlertCircle className="text-red-500 shrink-0" size={18} />
                  <div>
                    <h3 className="text-[11px] font-bold text-red-900 uppercase tracking-tight">
                      {error.title}
                    </h3>
                    <p className="text-[11px] text-red-700/80 leading-relaxed mt-0.5">
                      {error.message}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="flex-1 overflow-y-auto">
            <AnimatePresence mode="wait">
              {isSearching ? (
                <div className="p-6 space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="h-32 bg-gray-50 animate-pulse rounded-[2rem]"
                    />
                  ))}
                </div>
              ) : hasSearched && !error ? (
                <MatchList
                  results={results}
                  setSelectedMatch={setSelectedMatch}
                  selectedMatch={selectedMatch}
                />
              ) : (
                <div className="p-20 text-center">
                  <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <SearchIcon className="text-blue-200" size={24} />
                  </div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-300">
                    Awaiting Input
                  </p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* RIGHT COLUMN: Strategy Dashboard */}
        <main
          className={cn(
            "flex-1 bg-gray-50/30 overflow-y-auto overflow-x-hidden relative transition-colors duration-500",
            !selectedMatch
              ? "hidden lg:flex flex-col items-center justify-center"
              : "flex flex-col",
          )}
        >
          {/* Mobile Back Header */}
          {selectedMatch && (
            <div className="lg:hidden p-4 bg-white border-b border-gray-100 flex items-center sticky top-0 z-20">
              <button
                onClick={() => setSelectedMatch(null)}
                className="text-sm font-black text-blue-600 flex items-center gap-2"
              >
                <ArrowLeft size={16} /> Back
              </button>
            </div>
          )}

          <AnimatePresence mode="wait">
            {selectedMatch ? (
              <motion.div
                key={selectedMatch.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                // max-w-6xl ensures the content stays centered and contained on ultra-wide screens
                className="p-6 md:p-12 max-w-6xl mx-auto space-y-8 w-full"
              >
                {/* 1. Analysis Overview Grid */}
                <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
                  {/* Match Rating - Fixed width column for Score component consistency */}
                  <div className="xl:col-span-4 bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm flex flex-col justify-center relative min-h-[160px]">
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">
                      Match Rating
                    </h3>
                    <div className="flex items-baseline gap-2">
                      <span className="text-6xl font-black text-blue-600 leading-none">
                        {selectedMatch.score}
                      </span>
                      <span className="text-gray-300 text-2xl font-bold">
                        / 10
                      </span>
                    </div>
                    {/* The Score component goes here if you want the visual ring in the dashboard too */}
                  </div>

                  {/* Strategic Reasoning - Responsive column spanning 8 units */}
                  <div className="xl:col-span-8 bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm flex flex-col justify-center min-w-0">
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3">
                      Strategic Reasoning
                    </h3>
                    {/* break-words and min-w-0 prevent text from pushing the container width */}
                    <p className="text-lg md:text-xl text-gray-700 font-medium italic leading-relaxed border-l-4 border-blue-100 pl-6 break-words">
                      "{selectedMatch.reasoning}"
                    </p>
                  </div>
                </div>

                {/* 2. Outreach Nudge Card */}
                <section className="bg-[#1a1d23] text-white p-8 md:p-12 rounded-[3rem] shadow-2xl relative overflow-hidden border border-white/5">
                  <div className="flex md:flex-col gap-4 mb-8 relative z-10">
                    <div className="flex items-center gap-3 w-1/2 md:w-full">
                      <div className="p-2.5 bg-blue-500/20 rounded-xl text-blue-400">
                        <MessageSquare size={20} />
                      </div>
                      <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400">
                        LinkedIn Outreach
                      </h3>
                    </div>
                  </div>

                  <p className="text-xl md:text-2xl font-bold leading-relaxed text-gray-100 relative z-10 break-words">
                    {selectedMatch.nudge}
                  </p>

                  <button
                    onClick={() => handleCopy(selectedMatch.nudge)}
                    className={cn(
                      "flex items-center justify-end gap-2 px-6 my-2 py-3 rounded-2xl text-xs font-black transition-all active:scale-95 shadow-lg w-full sm:w-auto justify-self-end-safe",
                      copied
                        ? "bg-emerald-500 text-white"
                        : "bg-white text-black hover:bg-blue-50",
                    )}
                  >
                    {copied ? (
                      <CheckCircle size={14} />
                    ) : (
                      <ClipboardIcon size={14} />
                    )}
                    {copied ? "Copied!" : "Copy Nudge"}
                  </button>

                  <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />
                </section>

                {/* 3. CV Context Block */}
                <section className="space-y-4">
                  <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em] ml-2">
                    Source Context
                  </h4>
                  <div className="p-10 bg-white rounded-[2.5rem] border border-gray-100 shadow-sm text-gray-600 leading-relaxed font-medium overflow-hidden">
                    <p className="text-base leading-loose italic break-words">
                      {selectedMatch.content}
                    </p>
                  </div>
                </section>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex-1 flex flex-col items-center justify-center text-center p-12"
              >
                <div className="w-24 h-24 bg-white rounded-full shadow-2xl shadow-gray-200/50 flex items-center justify-center mb-8">
                  <Sparkles size={40} className="text-blue-500 animate-pulse" />
                </div>
                <h3 className="text-sm font-black uppercase tracking-widest text-gray-900">
                  Select a Match
                </h3>
                <p className="text-gray-400 text-sm mt-2 max-w-xs mx-auto">
                  Click on an experience block on the left to see the AI
                  strategy.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </PageWrapper>
  );
}
