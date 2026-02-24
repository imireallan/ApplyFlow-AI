import { motion } from "motion/react";
import { Upload, Search, TrendingUp, MessageSquare } from "lucide-react";
import { cn } from "~/lib/utils";
import { containerVariants, itemVariants } from "~/lib/variants";

const steps = [
  {
    number: "01",
    icon: Upload,
    title: "Upload Your Resume",
    desc: "Simply drag and drop your resume or paste your content. We support all major formats.",
    color: "bg-blue-600",
  },
  {
    number: "02",
    icon: Search,
    title: "Add Job Description",
    desc: "Paste the job description you're targeting or enter the company and role.",
    color: "bg-indigo-600",
  },
  {
    number: "03",
    icon: TrendingUp,
    title: "Get Match Score",
    desc: "Our AI analyzes your fit and gives you a detailed breakdown of strengths and gaps.",
    color: "bg-emerald-600",
  },
  {
    number: "04",
    icon: MessageSquare,
    title: "Send to Recruiter",
    desc: "Get a personalized outreach message ready to send directly to the recruiter.",
    color: "bg-amber-500",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 sm:py-24 bg-slate-50">
      <div className="max-w-6xl mx-auto px-6 sm:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-16"
        >
          <motion.span
            variants={itemVariants}
            className="inline-block px-3 py-1 rounded-full bg-blue-100 text-blue-600 text-xs font-bold uppercase tracking-widest mb-4"
          >
            How It Works
          </motion.span>
          <motion.h2
            variants={itemVariants}
            className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight"
          >
            Get Hired in 4 Simple Steps
          </motion.h2>
          <motion.p
            variants={itemVariants}
            className="mt-4 text-lg text-slate-500 max-w-2xl mx-auto"
          >
            From resume to recruiter message in seconds. No sign-up required to
            try it out.
          </motion.p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              variants={itemVariants}
              whileHover={{ y: -8 }}
              className="relative group"
            >
              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-12 left-[60%] w-[80%] h-px bg-slate-200 -z-10" />
              )}

              <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300 h-full">
                {/* Step Number */}
                <div className="text-6xl font-black text-slate-100 absolute top-4 right-6 select-none">
                  {step.number}
                </div>

                {/* Icon */}
                <div
                  className={cn(
                    "w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-lg",
                    step.color,
                  )}
                >
                  <step.icon className="w-7 h-7 text-white" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-black text-slate-900 mb-3">
                  {step.title}
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed">
                  {step.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
