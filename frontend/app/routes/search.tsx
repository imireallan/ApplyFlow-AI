import { Sparkles } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useState } from "react";
import { useNavigation, useSearchParams, useSubmit } from "react-router";
// Request type inferred from Remix
import { apiRequestHandler } from "~/.server/apiRequestHandler";
import { CVContextBlock } from "~/components/CVContextBlock";
import { MatchList } from "~/components/MatchList";
import { MatchReasoning } from "~/components/MatchReasoning";
import { MatchScore } from "~/components/MatchScore";
import { NudgeCard } from "~/components/NudgeCard";
import { PageWrapper } from "~/components/PageWrapper";
import { ProfileHighlights } from "~/components/ProfileHighlights";
import { SearchForm } from "~/components/SearchForm";
import { loadFromCache, saveToCache } from "~/helpers/lruCache";
import { cn } from "~/helpers/utils";
import type { CVMatch } from "~/types/ai";

interface ActionArgs {
  request: Request;
}

interface ActionData {
  results?: CVMatch[];
  profile?: any;
  query?: string;
  error?: {
    title: string;
    message: string;
  };
  fromCache?: boolean;
  cvId?: string;
}

interface ComponentProps {
  actionData?: ActionData;
}

interface CachedSearchResult {
  // query: string;
  cvId: string;
  // results: CVMatch[];
  profile: any;
  timestamp: number;
}

export async function loader(): Promise<{ initialMatches: CVMatch[] }> {
  return { initialMatches: [] };
}

export async function action({ request }: ActionArgs): Promise<ActionData> {
  const formData = await request.formData();
  const url = new URL(request.url);

  const cvId = url.searchParams.get("cv_id")?.trim();

  const query = formData.get("job_description")?.toString().trim() ?? "";

  if (!cvId) {
    return {
      error: {
        title: "Selection Required",
        message: "Please select a CV in the sidebar.",
      },
      query,
    };
  }

  const result = await apiRequestHandler(request, {
    endpoint: "/job/process",
    method: "POST",
    body: { job_description: query, top_k: 5, cv_id: cvId },
  });

  const resultData = result as any;
  if (resultData?.errors || resultData?.error) {
    return {
      results: [],
      profile: null,
      query,
      error: {
        title: "Analysis Failed",
        message: resultData?.error || "Error processing request.",
      },
    };
  }

  const responseData = resultData?.data;
  return {
    results: responseData?.data ?? [],
    profile: responseData?.profile ?? null,
    query,
    cvId, // Return the ID used to keep the UI in sync
  };
}

export default function CVSearch({ actionData }: ComponentProps) {
  const submit = useSubmit();
  const navigation = useNavigation();
  const isSearching = navigation.state === "submitting";

  const [searchParams] = useSearchParams();
  const selectedCvId = searchParams.get("cv_id") as string;

  const [isClient, setIsClient] = useState(false);
  const [cachedProfile, setCachedProfile] = useState<any>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const getCacheKey = useCallback(
    (cvId?: string) => (cvId ? `cv_${cvId}` : null),
    [],
  );
  const currentCacheKey = getCacheKey(selectedCvId);

  // 1. Load CV-specific data whenever selectedCvId changes
  useEffect(() => {
    if (currentCacheKey) {
      const cached = loadFromCache(currentCacheKey);

      if (cached) {
        setCachedProfile(cached);
      } else {
        setCachedProfile(null);
      }
    }
  }, [selectedCvId]);

  // 2. Persist new results to the correct CV slot
  useEffect(() => {
    if (
      isClient &&
      actionData?.results &&
      actionData.results.length > 0 &&
      selectedCvId &&
      !actionData.error
    ) {
      const key = getCacheKey(selectedCvId);
      if (key) {
        saveToCache(key, JSON.stringify(actionData?.profile), selectedCvId);
      }
    }
  }, [actionData, selectedCvId, isClient, getCacheKey]);

  const results = actionData?.results;
  const profile: any = actionData?.profile || cachedProfile;
  const [selectedMatch, setSelectedMatch] = useState<CVMatch | null>(null);

  // Auto-select first result
  useEffect(() => {
    if (results && results?.length > 0) setSelectedMatch(results[0]);
    else setSelectedMatch(null);
  }, [results]);

  // 3. The Submit Handler (The Bug Fix)
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const query = formData.get("job_description")?.toString()?.trim() ?? "";

    if (!query || !selectedCvId) return;

    submit(formData, { method: "post", action: `?cv_id=${selectedCvId}` });
  };

  return (
    <PageWrapper>
      <div className="flex flex-col lg:flex-row h-screen bg-white py-2 min-h-0">
        <div
          className={cn(
            "w-full lg:w-[450px] border-r border-gray-100 flex flex-col bg-white shrink-0",
            selectedMatch ? "hidden lg:flex" : "flex",
          )}
        >
          <div className="p-6 border-b border-gray-100 sticky top-0 z-10 bg-white">
            <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 mb-6">
              Discovery
            </h2>
            <SearchForm
              isLoading={isSearching}
              error={actionData?.error}
              onSubmit={handleSubmit}
            />
          </div>
          <div className="flex-1 overflow-y-auto">
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
              ) : results && results.length > 0 ? (
                <MatchList
                  results={results}
                  setSelectedMatch={setSelectedMatch}
                  selectedMatch={selectedMatch}
                />
              ) : (
                <div className="p-20 text-center opacity-30 italic text-sm">
                  No results for this CV yet.
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <main
          className="flex-1 min-h-0 bg-gray-50/30 overflow-hidden relative"
          suppressHydrationWarning
        >
          <div className="h-full overflow-y-auto p-8 space-y-8">
            {profile && (
              <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 mb-8">
                <ProfileHighlights profile={profile} />
              </div>
            )}
            <AnimatePresence mode="wait">
              {selectedMatch && !isSearching ? (
                <motion.div
                  key={selectedMatch.id}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
                    <MatchScore score={selectedMatch.match_score} />
                    <MatchReasoning reasoning={selectedMatch.reasoning} />
                  </div>
                  <NudgeCard nudge={selectedMatch.nudge} />
                  <CVContextBlock content={selectedMatch.content} />
                </motion.div>
              ) : (
                <div className="flex flex-col items-center justify-center text-gray-400 flex-1">
                  <Sparkles size={48} className="mb-4 animate-pulse" />
                  <p className="text-sm font-bold uppercase tracking-widest">
                    {profile
                      ? "No search results yet for this profile"
                      : "Select a result to analyze fit"}
                  </p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </main>
      </div>
    </PageWrapper>
  );
}
