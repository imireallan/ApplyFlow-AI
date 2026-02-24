import { Target, Zap, Users, BrainCircuit } from "lucide-react";
import { motion } from "motion/react";
import { containerVariants, itemVariants } from "~/lib/variants";

const stats = [
  {
    label: "Match Rate",
    value: "98%",
    icon: <Target className="w-5 h-5 text-white" />,
    color: "bg-blue-600", // Trust & Accuracy
  },
  {
    label: "Analysis Time",
    value: "< 2s",
    icon: <Zap className="w-5 h-5 text-white" />,
    color: "bg-amber-500", // Fast/High energy
  },
  {
    label: "Resumes Processed",
    value: "10k+",
    icon: <Users className="w-5 h-5 text-white" />,
    color: "bg-indigo-600", // Community/Volume
  },
  {
    label: "Job Insights",
    value: "Instant",
    icon: <BrainCircuit className="w-5 h-5 text-white" />,
    color: "bg-emerald-500", // Intelligence/Growth
  },
];

export function StatsSection() {
  return (
    <section className="py-14 sm:py-24 bg-white">
      <motion.div
        variants={containerVariants} // Staggered parent
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="max-w-6xl mx-auto px-6 sm:px-8"
      >
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <motion.div
              key={stat.label}
              variants={itemVariants} // Inherited slide-up animation
              whileHover={{
                y: -10,
                transition: { duration: 0.3, ease: "easeOut" },
              }}
              className="group p-8 bg-white border border-slate-100 rounded-[2.5rem] shadow-sm hover:shadow-xl hover:shadow-blue-500/5 hover:border-blue-100 transition-all duration-300"
            >
              {/* Icon Container with subtle scale on hover */}
              <div
                className={`w-12 h-12 sm:w-14 sm:h-14 ${stat.color} rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-inherit transition-transform group-hover:scale-110 group-hover:rotate-3`}
              >
                {stat.icon}
              </div>

              {/* Value with Tabular Nums for better alignment */}
              <div className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tighter tabular-nums">
                {stat.value}
              </div>

              {/* Label */}
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-2">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
