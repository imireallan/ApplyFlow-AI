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
  return (
    <section className="xl:col-span-12 bg-white border border-gray-100 shadow-sm rounded-3xl mb-6 p-6 space-y-4">
      <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400">
        Your Profile Highlights
      </h3>

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
            profile.experience.map((exp: any, idx: number) => (
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
            profile.education.map((edu: any, idx: number) => (
              <li key={idx}>
                {edu.degree || edu.school || edu.institution || "Education"}
              </li>
            ))}
        </ul>
      </div>
    </section>
  );
}
