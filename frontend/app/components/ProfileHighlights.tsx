import { ArrowLeft } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

interface ProfileHighlightsProps {
  profile: {
    summary?: string;
    skills?: string[] | string;
    experience?: Array<{
      role?: string;
      company?: string;
      title?: string;
      duration?: string;
      description?: string;
    }>;
    education?: Array<{
      degree?: string;
      school?: string;
      institution?: string;
    }>;
  };
}

export function ProfileHighlights({ profile }: ProfileHighlightsProps) {
  const [profileExpanded, setProfileExpanded] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <section className="xl:col-span-12 bg-white border pt-4 border-gray-100 shadow-sm rounded-3xl mb-6">
      {/* Mobile Header with toggle */}
      <div
        className="flex items-center justify-between p-4 md:hidden cursor-pointer"
        onClick={() => setProfileExpanded(!profileExpanded)}
      >
        <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400">
          Your Profile Highlights
        </h3>
        <motion.div
          animate={{ rotate: profileExpanded ? 180 : 0 }}
          className="text-blue-500"
        >
          <ArrowLeft size={16} />
        </motion.div>
      </div>

      {/* Content */}
      <AnimatePresence initial={false}>
        {(profileExpanded || isClient) && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden px-4 pb-4 md:px-6 md:pb-6 flex flex-col gap-4"
          >
            {/* Summary */}
            <div className="p-4 bg-blue-50 rounded-2xl">
              <h4 className="text-[9px] font-bold text-blue-500 uppercase mb-1">
                Summary
              </h4>
              <p className="text-sm text-gray-700 leading-relaxed">
                {profile.summary}
              </p>
            </div>

            {/* Skills */}
            <div className="p-4 bg-green-50 rounded-2xl">
              <h4 className="text-[9px] font-bold text-green-500 uppercase mb-1">
                Skills
              </h4>
              <p className="text-sm text-gray-700 leading-relaxed">
                {Array.isArray(profile.skills)
                  ? profile.skills.join(", ")
                  : profile.skills}
              </p>
            </div>

            {/* Experience */}
            <div className="p-4 bg-yellow-50 rounded-2xl">
              <h4 className="text-[9px] font-bold text-yellow-500 uppercase mb-1">
                Experience
              </h4>
              <ul className="text-sm text-gray-700 leading-relaxed list-disc ml-4">
                {Array.isArray(profile.experience) &&
                  profile.experience.map((exp, idx) => (
                    <li key={idx}>
                      {exp.role || exp.title || "Position"}
                      {exp.company ? ` at ${exp.company}` : ""}
                      {exp.duration ? ` (${exp.duration})` : ""}
                    </li>
                  ))}
              </ul>
            </div>

            {/* Education */}
            <div className="p-4 bg-purple-50 rounded-2xl">
              <h4 className="text-[9px] font-bold text-purple-500 uppercase mb-1">
                Education
              </h4>
              <ul className="text-sm text-gray-700 leading-relaxed list-disc ml-4">
                {Array.isArray(profile.education) &&
                  profile.education.map((edu, idx) => (
                    <li key={idx}>
                      {edu.degree ||
                        edu.school ||
                        edu.institution ||
                        "Education"}
                    </li>
                  ))}
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
