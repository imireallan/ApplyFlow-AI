import {
  AlertCircle,
  ArrowLeft,
  CheckCircle,
  ClipboardIcon,
  MessageSquare,
  Search as SearchIcon,
  Sparkles,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { Form, useNavigation } from "react-router";
import { apiRequestHandler } from "~/.server/apiRequestHandler";
import { Button } from "~/components/Button";
import { MatchList } from "~/components/MatchList";
import { PageWrapper } from "~/components/PageWrapper";
import { cn } from "~/lib/utils";
import type { CVMatch } from "~/types/ai";
import type { Route } from "./+types/search";

export async function loader() {
  // await delay(5000)
  // const response = {
  //   status: "success",
  //   data: [
  //     {
  //       id: "921ffbce-ab94-4997-8bc6-03d40cd91eec",
  //       content:
  //         "Allan Imire\nSoftware Engineer\nNairobi, Kenya\n \nallanimire@gmail.com\n \n+254727035069\n \nKenyan\n \nLinkedIn\n \nGithub\n \nPortfolio\n \nSkills\nTech Stack — Node.js, NextJS, React, Javascript, Typescript, TailwindCSS, HTML5, Python, Django, GraphQL, Git, MySQL,\nPostgreSQL, NoSQL, MongoDB, Redis, Docker, GCP, AWS, Github Actions, Gitlab CI/CD.\nWork Experience\nAthena\nPlatform Engineer\n04/2024 – 12/2025\n•Built and deployed HubSpot–EMS integrations automating employee lifecycle syncing, saving 50+ hours monthly and \nimproving data accuracy by ~80%.\n•Developed Node.js scripts using the HubSpot API to enforce 1:1 Deal–Ticket relationships, cutting CRM errors by 70% and \nenhancing reporting reliability.\n•Architected the HubSpot→Workday integration framework with secure API payloads, OAuth2, and governance workflows, \nenabling scalable future automations.\nTDi Sustainability\nFrontend Engineer\n04/2022 – 08/2023 | London, UK",
  //       score: 6,
  //       reasoning:
  //         "The candidate has experience with AWS, but the job description specifically requires AWS EKS, and although the candidate has experience with Docker and CI/CD, the primary focus of the job is on Python, which is not the candidate's primary tech stack.",
  //       nudge:
  //         "Hi, I came across the Software Engineer role at your company and was impressed by the opportunity to work with Python, Docker, and AWS EKS. With my experience in Docker, AWS, and CI/CD pipelines, I believe I can bring significant value to your team, and I'd love to discuss how my skills can be adapted to fit the requirements of the position.",
  //     },
  //     {
  //       id: "e5d24326-4733-4581-88fe-64b2bbda93cc",
  //       content:
  //         "Allan Imire\nSoftware Engineer\nNairobi, Kenya\n \nallanimire@gmail.com\n \n+254727035069\n \nKenyan\n \nLinkedIn\n \nGithub\n \nPortfolio\n \nSkills\nTech Stack — Node.js, NextJS, React, Javascript, Typescript, TailwindCSS, HTML5, Python, Django, GraphQL, Git, MySQL,\nPostgreSQL, NoSQL, MongoDB, Redis, Docker, GCP, AWS, Github Actions, Gitlab CI/CD.\nWork Experience\nAthena\nPlatform Engineer\n04/2024 – 12/2025\n•Built and deployed HubSpot–EMS integrations automating employee lifecycle syncing, saving 50+ hours monthly and \nimproving data accuracy by ~80%.\n•Developed Node.js scripts using the HubSpot API to enforce 1:1 Deal–Ticket relationships, cutting CRM errors by 70% and \nenhancing reporting reliability.\n•Architected the HubSpot→Workday integration framework with secure API payloads, OAuth2, and governance workflows, \nenabling scalable future automations.\nTDi Sustainability\nFrontend Engineer\n04/2022 – 08/2023 | London, UK",
  //       score: 6,
  //       reasoning:
  //         "The candidate's experience with AWS and Docker is a good match, but the job description prioritizes Python, Kubernetes, and AWS EKS, which are not the candidate's primary strengths.",
  //       nudge:
  //         "Hi, I came across the Software Engineer role at your company and was impressed by the opportunity to work with AWS and Docker, technologies I've utilized in my previous roles. With my experience in cloud engineering and a strong foundation in programming languages like Python, I'd love to explore how my skills can contribute to your team's success with AWS EKS and Kubernetes.",
  //     },
  //     {
  //       id: "a6440697-00a7-4115-bf0b-f7d25c5c63e6",
  //       content:
  //         "Allan Imire\nSenior Software Engineer\nNairobi, Kenya\n \nallanimire@gmail.com\n \n+254727035069\n \nKenyan\n \nLinkedIn\n \nGithub\n \nPortfolio\n \nSkills\nTech Stack — Node.js, RemixJS, NextJS, React, Redux, Javascript, Typescript, Python, Django, Express, TailwindCSS, HTML5, CSS3,\nGraphQL, RESTful APIs, Git, Docker, GCP, AWS, Github Actions, Gitlab CI/CD.\nWork Experience\nAthena\nPlatform Engineer\n04/2024 – 12/2025\n•Built and deployed HubSpot–EMS integrations automating employee lifecycle syncing, saving 50+ hours monthly and \nimproving data accuracy by ~80%.\n•Developed Node.js scripts using the HubSpot API to enforce 1:1 Deal–Ticket relationships, cutting CRM errors by 70% and \nenhancing reporting reliability.\n•Architected the HubSpot→Workday integration framework with secure API payloads, OAuth2, and governance workflows, \nenabling scalable future automations.\nTDi Sustainability\nSoftware Engineer\n04/2022 – 08/2023 | London, UK",
  //       score: 8,
  //       reasoning:
  //         "The candidate's experience with tech stacks such as Node.js, Docker, and AWS, as well as CI/CD tools like Github Actions, shows a strong overlap with the job description's requirements, although Python experience is not explicitly highlighted in their work history.",
  //       nudge:
  //         "Hi, I came across the Software Engineer role at your company and was excited to see the emphasis on Python, Docker, and AWS EKS, which align with my experience in cloud-based technologies and containerization using Docker. I'd love to explore how my skills in tech stacks like Node.js and AWS, as well as my experience with CI/CD pipelines, could contribute to your team's success.",
  //     },
  //     {
  //       id: "a6440697-00a7-4115-bf0b-f7d25c5c63e6",
  //       content:
  //         "Allan Imire\nSenior Software Engineer\nNairobi, Kenya\n \nallanimire@gmail.com\n \n+254727035069\n \nKenyan\n \nLinkedIn\n \nGithub\n \nPortfolio\n \nSkills\nTech Stack — Node.js, RemixJS, NextJS, React, Redux, Javascript, Typescript, Python, Django, Express, TailwindCSS, HTML5, CSS3,\nGraphQL, RESTful APIs, Git, Docker, GCP, AWS, Github Actions, Gitlab CI/CD.\nWork Experience\nAthena\nPlatform Engineer\n04/2024 – 12/2025\n•Built and deployed HubSpot–EMS integrations automating employee lifecycle syncing, saving 50+ hours monthly and \nimproving data accuracy by ~80%.\n•Developed Node.js scripts using the HubSpot API to enforce 1:1 Deal–Ticket relationships, cutting CRM errors by 70% and \nenhancing reporting reliability.\n•Architected the HubSpot→Workday integration framework with secure API payloads, OAuth2, and governance workflows, \nenabling scalable future automations.\nTDi Sustainability\nSoftware Engineer\n04/2022 – 08/2023 | London, UK",
  //       score: 8,
  //       reasoning:
  //         "The candidate's experience with tech stacks such as Node.js, Docker, and AWS, as well as CI/CD tools like Github Actions, shows a strong overlap with the job description's requirements, although Python experience is not explicitly highlighted in their work history.",
  //       nudge:
  //         "Hi, I came across the Software Engineer role at your company and was excited to see the emphasis on Python, Docker, and AWS EKS, which align with my experience in cloud-based technologies and containerization using Docker. I'd love to explore how my skills in tech stacks like Node.js and AWS, as well as my experience with CI/CD pipelines, could contribute to your team's success.",
  //     },
  //     {
  //       id: "a6440697-00a7-4115-bf0b-f7d25c5c63e6",
  //       content:
  //         "Allan Imire\nSenior Software Engineer\nNairobi, Kenya\n \nallanimire@gmail.com\n \n+254727035069\n \nKenyan\n \nLinkedIn\n \nGithub\n \nPortfolio\n \nSkills\nTech Stack — Node.js, RemixJS, NextJS, React, Redux, Javascript, Typescript, Python, Django, Express, TailwindCSS, HTML5, CSS3,\nGraphQL, RESTful APIs, Git, Docker, GCP, AWS, Github Actions, Gitlab CI/CD.\nWork Experience\nAthena\nPlatform Engineer\n04/2024 – 12/2025\n•Built and deployed HubSpot–EMS integrations automating employee lifecycle syncing, saving 50+ hours monthly and \nimproving data accuracy by ~80%.\n•Developed Node.js scripts using the HubSpot API to enforce 1:1 Deal–Ticket relationships, cutting CRM errors by 70% and \nenhancing reporting reliability.\n•Architected the HubSpot→Workday integration framework with secure API payloads, OAuth2, and governance workflows, \nenabling scalable future automations.\nTDi Sustainability\nSoftware Engineer\n04/2022 – 08/2023 | London, UK",
  //       score: 8,
  //       reasoning:
  //         "The candidate's experience with tech stacks such as Node.js, Docker, and AWS, as well as CI/CD tools like Github Actions, shows a strong overlap with the job description's requirements, although Python experience is not explicitly highlighted in their work history.",
  //       nudge:
  //         "Hi, I came across the Software Engineer role at your company and was excited to see the emphasis on Python, Docker, and AWS EKS, which align with my experience in cloud-based technologies and containerization using Docker. I'd love to explore how my skills in tech stacks like Node.js and AWS, as well as my experience with CI/CD pipelines, could contribute to your team's success.",
  //     },
  //     {
  //       id: "a6440697-00a7-4115-bf0b-f7d25c5c63e6",
  //       content:
  //         "Allan Imire\nSenior Software Engineer\nNairobi, Kenya\n \nallanimire@gmail.com\n \n+254727035069\n \nKenyan\n \nLinkedIn\n \nGithub\n \nPortfolio\n \nSkills\nTech Stack — Node.js, RemixJS, NextJS, React, Redux, Javascript, Typescript, Python, Django, Express, TailwindCSS, HTML5, CSS3,\nGraphQL, RESTful APIs, Git, Docker, GCP, AWS, Github Actions, Gitlab CI/CD.\nWork Experience\nAthena\nPlatform Engineer\n04/2024 – 12/2025\n•Built and deployed HubSpot–EMS integrations automating employee lifecycle syncing, saving 50+ hours monthly and \nimproving data accuracy by ~80%.\n•Developed Node.js scripts using the HubSpot API to enforce 1:1 Deal–Ticket relationships, cutting CRM errors by 70% and \nenhancing reporting reliability.\n•Architected the HubSpot→Workday integration framework with secure API payloads, OAuth2, and governance workflows, \nenabling scalable future automations.\nTDi Sustainability\nSoftware Engineer\n04/2022 – 08/2023 | London, UK",
  //       score: 8,
  //       reasoning:
  //         "The candidate's experience with tech stacks such as Node.js, Docker, and AWS, as well as CI/CD tools like Github Actions, shows a strong overlap with the job description's requirements, although Python experience is not explicitly highlighted in their work history.",
  //       nudge:
  //         "Hi, I came across the Software Engineer role at your company and was excited to see the emphasis on Python, Docker, and AWS EKS, which align with my experience in cloud-based technologies and containerization using Docker. I'd love to explore how my skills in tech stacks like Node.js and AWS, as well as my experience with CI/CD pipelines, could contribute to your team's success.",
  //     },
  //   ],
  // };
  return { initialMatches: [] as CVMatch[] };
}

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const query = formData.get("job_description");

  if (!query || query.toString().trim() === "") {
    return { results: [] };
  }

  const result = await apiRequestHandler(request, {
    endpoint: "/job/process",
    method: "POST",
    body: { job_description: query, top_k: 5 },
  });

  // Check if apiRequestHandler returned an error response
  if (result instanceof Response || (result as any)?.error) {
    const errorData = result instanceof Response ? await result.json() : result;

    // Handle rate limiting specifically
    if (result instanceof Response && result.status === 429) {
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
          errorData?.error ||
          "Something went wrong while analyzing the job description. Please try again.",
      },
    };
  }

  // Handle case where result.data might not exist
  const responseData = result as any;
  return { results: (responseData?.data || []) as CVMatch[] };
}

export default function CVSearch({ actionData }: Route.ComponentProps) {
  const results = (actionData?.results as any)?.data ?? [];
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
            <Form method="post" className="space-y-4">
              <textarea
                name="job_description"
                rows={4}
                placeholder="Paste the job you're applying for..."
                className="w-full text-gray-700 bg-gray-50 border border-gray-100 rounded-3xl py-4 px-6 text-sm outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all resize-none shadow-inner"
                required
              />
              <Button
                isLoading={isSearching}
                variant="primary"
                icon={<Sparkles size={16} />}
                className="w-full shadow-xl shadow-blue-500/20"
              >
                Analyze My Fit
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
                className="flex-1 overflow-y-auto p-6 md:p-12 pb-24 space-y-8"
              >
                {/* 1. Analysis Overview Grid */}
                <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
                  {/* Match Rating - Fixed width column for Score component consistency */}
                  <div className="xl:col-span-4 bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm flex flex-col justify-center relative min-h-[160px]">
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">
                      Fit Score
                    </h3>
                    <div className="flex items-baseline gap-2">
                      <span className="text-6xl font-black text-blue-600 leading-none">
                        {selectedMatch.match_score}
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
                      Why This Fits You
                    </h3>
                    {/* break-words and min-w-0 prevent text from pushing the container width */}
                    <p className="text-lg md:text-xl text-gray-700 font-medium italic leading-relaxed border-l-4 border-blue-100 pl-6 break-words">
                      "{selectedMatch.reasoning}"
                    </p>
                  </div>
                </div>

                {/* 2. Outreach Nudge Card */}
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
                    {selectedMatch.nudge}
                  </p>
                  <button
                    onClick={() => handleCopy(selectedMatch.nudge)}
                    className={cn(
                      "flex items-center justify-center gap-2 px-4 py-2 mt-6 rounded-full text-[11px] font-black transition-all active:scale-95 shadow-lg w-auto self-end sm:px-6 sm:py-3 sm:text-xs",
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
                    {copied ? "Copied!" : "Copy Ready Message"}
                  </button>
                  <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />
                </section>

                {/* 3. CV Context Block */}
                <section className="space-y-4">
                  <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em] ml-2">
                    Resume Section Used
                  </h4>
                  <div className="p-10 bg-white rounded-[2.5rem] border border-gray-100 shadow-sm text-gray-600 leading-relaxed font-medium overflow-y-auto">
                    <p className="text-base leading-loose italic wrap-break-word">
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
