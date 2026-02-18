import { Languages, Clock, CircleCheckBig, Zap } from "lucide-react";
import { motion } from "motion/react";
import { containerVariants, itemVariants } from "~/lib/variants";

const stats = [
  {
    label: "Skill Types",
    value: "32+",
    icon: <Languages className="w-5 h-5 text-white" />,
    color: "bg-blue-500",
  },
  {
    label: "Availability",
    value: "24/7",
    icon: <Clock className="w-5 h-5 text-white" />,
    color: "bg-blue-600",
  },
  {
    label: "Match Accuracy",
    value: "95%",
    icon: <CircleCheckBig className="w-5 h-5 text-white" />,
    color: "bg-purple-500",
  },
  {
    label: "Setup Time",
    value: "60min",
    icon: <Zap className="w-5 h-5 text-white" />,
    color: "bg-pink-500",
  },
];

export function StatsSection() {
  return (
    <section className="py-24 bg-white">
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="max-w-[1400px] mx-auto px-6"
      >
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <motion.div 
              key={stat.label}
              variants={itemVariants}
              whileHover={{ y: -10, transition: { duration: 0.2 } }}
              className="p-8 bg-white border border-slate-100 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.04)]"
            >
              <div className={`w-12 h-12 ${stat.color} rounded-2xl flex items-center justify-center mb-6`}>
                {stat.icon}
              </div>
              <div className="text-4xl font-black text-slate-900 tracking-tighter">{stat.value}</div>
              <div className="text-xs font-black text-slate-400 uppercase tracking-widest mt-1">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
