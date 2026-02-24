import { motion, type Variants } from "motion/react";
import { Search, BrainCircuit, Zap } from "lucide-react";
import { cn } from "~/lib/utils";

/* ----------------------------- */
/* Same Pattern As Stats */
/* ----------------------------- */

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
    },
  },
};

/* ----------------------------- */
/* Data */
/* ----------------------------- */

const capabilities = [
  {
    icon: Search,
    title: "Find the Perfect Match",
    desc: "See which parts of your resume match the job - beyond just keywords.",
    color: "text-blue-600",
    glow: "bg-blue-600/10",
  },
  {
    icon: BrainCircuit,
    title: "Get AI Insights",
    desc: "Know exactly how well you fit the role with an instant score and reasons why.",
    color: "text-indigo-600",
    glow: "bg-indigo-600/10",
  },
  {
    icon: Zap,
    title: "Ready-to-Send Messages",
    desc: "Get personalized messages you can send directly to recruiters.",
    color: "text-emerald-600",
    glow: "bg-emerald-600/10",
  },
];

/* ----------------------------- */
/* Component */
/* ----------------------------- */

export function UseCases() {
  return (
    <section className="py-20 sm:py-24 bg-white">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        className="max-w-6xl mx-auto px-6 sm:px-8"
      >
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {capabilities.map((item) => (
            <motion.div
              key={item.title}
              variants={itemVariants}
              whileHover={{
                y: -10,
                transition: { duration: 0.3, ease: "easeOut" },
              }}
              className="group relative bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300"
            >
              {/* Glow */}
              <div
                className={cn(
                  "absolute -right-10 -top-10 w-40 h-40 blur-[80px] pointer-events-none rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300",
                  item.glow,
                )}
              />

              {/* Icon */}
              <div
                className={cn(
                  "relative z-10 p-4 rounded-2xl bg-slate-50 inline-block mb-8 shadow-sm transition-transform group-hover:scale-110 group-hover:rotate-3",
                  item.color,
                )}
              >
                <item.icon className="h-8 w-8" />
              </div>

              {/* Text */}
              <h3 className="text-2xl font-black text-slate-900 mb-4 tracking-tight relative z-10">
                {item.title}
              </h3>

              <p className="text-slate-500 text-base leading-relaxed font-medium relative z-10">
                {item.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
