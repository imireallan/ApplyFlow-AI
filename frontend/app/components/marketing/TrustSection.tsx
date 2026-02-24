import { motion } from "motion/react";
import { Shield, Lock, EyeOff, CheckCircle } from "lucide-react";
import { containerVariants, itemVariants } from "~/lib/variants";

const trustBadges = [
  {
    icon: Shield,
    title: "Bank-Level Security",
    desc: "256-bit SSL encryption protects all your data",
  },
  {
    icon: Lock,
    title: "SOC 2 Compliant",
    desc: "Following industry-standard security practices",
  },
  {
    icon: EyeOff,
    title: "Privacy First",
    desc: "Your data is never shared with third parties",
  },
  {
    icon: CheckCircle,
    title: "Verified Accuracy",
    desc: "98% match accuracy based on user feedback",
  },
];

const companies = ["Google", "Meta", "Amazon", "Microsoft", "Apple", "Netflix"];

export function TrustSection() {
  return (
    <section className="py-20 sm:py-24 bg-white">
      <div className="max-w-6xl mx-auto px-6 sm:px-8">
        {/* Trust Badges */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="mb-20"
        >
          <motion.div variants={itemVariants} className="text-center mb-12">
            <span className="inline-block px-3 py-1 rounded-full bg-blue-100 text-blue-600 text-xs font-bold uppercase tracking-widest mb-4">
              Trust & Security
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Your Data is Safe With Us
            </h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {trustBadges.map((badge) => (
              <motion.div
                key={badge.title}
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
                className="bg-slate-50 p-6 rounded-2xl text-center hover:bg-blue-50 transition-colors"
              >
                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                  <badge.icon className="w-7 h-7 text-blue-600" />
                </div>
                <h3 className="font-black text-slate-900 mb-2">
                  {badge.title}
                </h3>
                <p className="text-sm text-slate-500">{badge.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Companies */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="border-t border-slate-100 pt-12"
        >
          <motion.p
            variants={itemVariants}
            className="text-center text-sm text-slate-400 uppercase tracking-widest mb-8"
          >
            Trusted by job seekers targeting
          </motion.p>
          <div className="flex flex-wrap justify-center items-center gap-8 sm:gap-12">
            {companies.map((company) => (
              <motion.span
                key={company}
                variants={itemVariants}
                className="text-2xl sm:text-3xl font-black text-slate-200 hover:text-slate-300 transition-colors cursor-default"
              >
                {company}
              </motion.span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
