import { ArrowLeft, Search as SearchIcon, Sparkles } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { useLocation, useNavigation, useSubmit } from "react-router";
import { apiRequestHandler } from "~/.server/apiRequestHandler";
import { CVContextBlock } from "~/components/CVContextBlock";
import { MatchList } from "~/components/MatchList";
import { MatchReasoning } from "~/components/MatchReasoning";
import { MatchScore } from "~/components/MatchScore";
import { NudgeCard } from "~/components/NudgeCard";
import { PageWrapper } from "~/components/PageWrapper";
import { ProfileHighlights } from "~/components/ProfileHighlights";
import { SearchForm } from "~/components/SearchForm";
import { cn } from "~/helpers/utils";
import type { CVMatch } from "~/types/ai";
import type { Route } from "./+types/search";

export async function loader() {
  return { initialMatches: [] as CVMatch[] };
}

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const query = formData.get("job_description")?.toString()?.trim() ?? "";

  if (!query) {
    return { results: [], profile: null, query: "" };
  }

  const result = await apiRequestHandler(request, {
    endpoint: "/job/process",
    method: "POST",
    body: { job_description: query, top_k: 5 },
  });

  // apiRequestHandler returns a react-router data object, NOT a Response
  // The data object has an 'errors' property for errors and 'data' property for successful responses
  // Check for errors - react-router data object with errors or explicit error property
  const resultData = result as any;
  const hasError = resultData?.errors || resultData?.error;

  if (hasError) {
    // Get the status code from the data response
    const status = resultData?.status || 500;
    const errorMessage = resultData?.errors
      ? JSON.stringify(resultData.errors)
      : resultData?.error;

    if (status === 429) {
      return {
        results: [],
        profile: null,
        query,
        error: {
          title: "System Overloaded",
          message:
            "We're receiving too many requests right now. Please wait a moment and try again.",
        },
      };
    }

    if (status === 401) {
      return {
        results: [],
        profile: null,
        query,
        error: {
          title: "Unauthorized",
          message: "Please log in again to continue.",
        },
      };
    }

    return {
      results: [],
      profile: null,
      query,
      error: {
        title: "Search Failed",
        message:
          errorMessage ||
          "Something went wrong while analyzing the job description. Please try again.",
      },
    };
  }

  // Success case - get data from the response
  // The react-router data object stores successful response data in the 'data' property
  const responseData = resultData?.data;

  // Handle case where responseData might be undefined or not an object
  if (!responseData || typeof responseData !== "object") {
    return {
      results: [],
      profile: null,
      query,
      error: {
        title: "Invalid Response",
        message: "Received an invalid response from the server.",
      },
    };
  }

  return {
    results: responseData?.data ?? [],
    profile: responseData?.profile ?? null,
    query,
  };
}

export default function CVSearch({ actionData }: Route.ComponentProps) {
  const location = useLocation();
  const navigation = useNavigation();
  const isSearching = navigation.state === "submitting";
  const submit = useSubmit();

  // Get query from actionData
  const currentQuery = actionData?.query ?? "";

  // Get results from actionData
  const results = actionData?.results ?? [];
  const error = actionData?.error;

  // Get profile from location state or actionData
  const profile = (location.state as any)?.profile ?? actionData?.profile;

  const hasSearched = !!actionData;

  const [selectedMatch, setSelectedMatch] = useState<CVMatch | null>(null);

  // Auto-select first match on new results
  useEffect(() => {
    if (results && results.length > 0) {
      setSelectedMatch(results[0]);
    } else {
      setSelectedMatch(null);
    }
  }, [results]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    submit(event.currentTarget);
  };

  return (
    <PageWrapper>
      <div className="flex flex-col lg:flex-row h-screen bg-white py-2 min-h-0">
        {/* LEFT COLUMN: Discovery Sidebar */}
        <div
          className={cn(
            "w-full lg:w-[450px] border-r border-gray-100 flex flex-col bg-white shrink-0 transition-all",
            selectedMatch ? "hidden lg:flex" : "flex",
          )}
        >
          <div className="p-6 border-b border-gray-100 bg-white/50 backdrop-blur-md sticky top-0 z-10">
            <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 mb-6">
              Find Your Best Fit
            </h2>
            <SearchForm
              isLoading={isSearching}
              error={error}
              onSubmit={handleSubmit}
            />
          </div>

          <div className="flex-1 overflow-hidden">
            <AnimatePresence mode="wait">
              {isSearching ? (
                <div className="p-6 space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="h-32 bg-gray-50 animate-pulse rounded-4xl"
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
                    Ready to Help
                  </p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* RIGHT COLUMN: Strategy Dashboard */}
        <main
          className={cn(
            "flex-1 min-h-0 bg-gray-50/30 overflow-hidden relative transition-colors duration-500",
            !selectedMatch || isSearching
              ? "hidden lg:flex flex-col items-center justify-center"
              : "flex flex-col",
          )}
        >
          {/* Mobile Back Header */}
          {selectedMatch && !isSearching && (
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
            {selectedMatch && !isSearching ? (
              <motion.div
                key={selectedMatch.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex-1 overflow-y-auto p-6 md:p-12 pb-24 space-y-8"
              >
                {/* 1. Analysis Overview Grid */}
                <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
                  {profile && <ProfileHighlights profile={profile} />}
                  <MatchScore score={selectedMatch.match_score} />
                  <MatchReasoning reasoning={selectedMatch.reasoning} />
                </div>

                {/* 2. Outreach Nudge Card */}
                <NudgeCard nudge={selectedMatch.nudge} />

                {/* 3. CV Context Block */}
                <CVContextBlock content={selectedMatch.content} />
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
                  Choose a Result
                </h3>
                <p className="text-gray-400 text-sm mt-2 max-w-xs mx-auto">
                  Click on a match on the left to see how it fits the job.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </PageWrapper>
  );
}
