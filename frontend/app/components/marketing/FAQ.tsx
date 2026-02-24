import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronDown, Shield, FileText, Zap, HelpCircle } from "lucide-react";
import { containerVariants, itemVariants } from "~/lib/variants";

const faqs = [
  {
    question: "How does ApplyFlow analyze my resume?",
    answer:
      "Our AI scans your resume and extracts key information like skills, experience, and qualifications. Then it compares these against the job description using advanced natural language processing to find matches and gaps.",
    icon: FileText,
  },
  {
    question: "Is my data secure and private?",
    answer:
      "Absolutely. We use bank-level encryption to protect your data. Your resumes and personal information are never shared with third parties. You can delete your data at any time.",
    icon: Shield,
  },
  {
    question: "How accurate is the match score?",
    answer:
      "Our AI model has been trained on millions of job applications and has a 98% accuracy rate. The score reflects how well your skills and experience align with the job requirements.",
    icon: Zap,
  },
  {
    question: "Is this free to use?",
    answer:
      "Yes! You can upload your resume, paste a job description, and get your match analysis completely free. We also provide ready-to-send recruiter messages at no cost.",
    icon: HelpCircle,
  },
  {
    question: "What file formats do you support?",
    answer:
      "We support all major resume formats including PDF, DOCX, and plain text. Our system will automatically parse and extract the content regardless of the format.",
    icon: FileText,
  },
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="py-20 sm:py-24 bg-slate-50">
      <div className="max-w-3xl mx-auto px-6 sm:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-16"
        >
          <motion.span
            variants={itemVariants}
            className="inline-block px-3 py-1 rounded-full bg-indigo-100 text-indigo-600 text-xs font-bold uppercase tracking-widest mb-4"
          >
            FAQ
          </motion.span>
          <motion.h2
            variants={itemVariants}
            className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight"
          >
            Frequently Asked Questions
          </motion.h2>
          <motion.p
            variants={itemVariants}
            className="mt-4 text-lg text-slate-500"
          >
            Everything you need to know about ApplyFlow.
          </motion.p>
        </motion.div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={faq.question}
              variants={itemVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="bg-white rounded-2xl border border-slate-100 overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex items-center justify-between p-6 text-left hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <faq.icon className="w-5 h-5 text-slate-600" />
                  </div>
                  <span className="font-bold text-slate-900 text-lg">
                    {faq.question}
                  </span>
                </div>
                <ChevronDown
                  className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                />
              </button>
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="px-6 pb-6 pl-20 text-slate-500 leading-relaxed">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
