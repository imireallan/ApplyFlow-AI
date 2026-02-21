import {
  Building,
  Headphones,
  UserSearch,
} from "lucide-react";
import { motion } from "motion/react";
import { containerVariants, itemVariants } from "~/lib/variants";

const capabilities = [
  {
    icon: Building,
    title: "Receptionist",
    desc: "Handle incoming enquiries and route calls automatically.",
    color: "text-blue-600",
  },
  {
    icon: Headphones,
    title: "Customer Care",
    desc: "Instantly respond to FAQs so you never miss a query.",
    color: "text-indigo-600",
  },
  {
    icon: UserSearch,
    title: "AI Recruiter",
    desc: "Streamline hiring by screening candidates efficiently.",
    color: "text-purple-600",
  },
];

export function UseCases() {
  return (
    <section className="py-24 bg-slate-50/50">
      <div className="max-w-[1400px] mx-auto px-6">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-black text-slate-900 tracking-tight">Tailored for every use case</h2>
          <p className="text-slate-500 mt-4">Our AI employees work alongside your team.</p>
        </motion.div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-slate-200 border border-slate-200 rounded-3xl overflow-hidden"
        >
          {capabilities.map((item) => (
            <motion.div
              key={item.title}
              variants={itemVariants}
              className="bg-white p-10 hover:bg-slate-50 transition-colors"
            >
              <item.icon className="h-8 w-8 text-blue-600 mb-6" />
              <h3 className="text-xl font-bold text-slate-900 mb-3">{item.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
