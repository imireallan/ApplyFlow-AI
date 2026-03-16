import { Quote, Star } from "lucide-react";
import { motion } from "motion/react";
import { containerVariants, itemVariants } from "~/helpers/variants";

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Product Manager at Google",
    avatar: "SC",
    content:
      "ApplyFlow helped me identify gaps in my resume I didn't even know about. Landed my dream job within 2 weeks!",
    rating: 5,
    metric: "+145%",
    metricLabel: "Interview Rate",
    color: "bg-blue-600",
  },
  {
    name: "Marcus Johnson",
    role: "Software Engineer at Meta",
    avatar: "MJ",
    content:
      "The match score saved me hours of applying to jobs where I wasn't a good fit. The recruiter messages are incredibly well-written.",
    rating: 5,
    metric: "Saved 20hrs",
    metricLabel: "In Application Research",
    color: "bg-emerald-600",
  },
  {
    name: "Emily Rodriguez",
    role: "Marketing Director",
    avatar: "ER",
    content:
      "As a career changer, I was lost. ApplyFlow showed me exactly which transferable skills to highlight. Game changer!",
    rating: 5,
    metric: "3 Offers",
    metricLabel: "In 30 Days",
    color: "bg-amber-500",
  },
];

export function Testimonials() {
  return (
    <section id="testimonials" className="py-20 sm:py-24 bg-white">
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
            className="inline-block px-3 py-1 rounded-full bg-emerald-100 text-emerald-600 text-xs font-bold uppercase tracking-widest mb-4"
          >
            Success Stories
          </motion.span>
          <motion.h2
            variants={itemVariants}
            className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight"
          >
            Loved by Job Seekers
          </motion.h2>
          <motion.p
            variants={itemVariants}
            className="mt-4 text-lg text-slate-500 max-w-2xl mx-auto"
          >
            Join thousands who have transformed their job search with AI-powered
            insights.
          </motion.p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              variants={itemVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              whileHover={{ y: -8 }}
              className="relative bg-slate-50 p-8 rounded-[2.5rem] hover:shadow-xl transition-all duration-300"
            >
              {/* Quote Icon */}
              <Quote className="absolute top-6 right-6 w-8 h-8 text-slate-200" />

              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-4 h-4 fill-amber-400 text-amber-400"
                  />
                ))}
              </div>

              {/* Content */}
              <p className="text-slate-600 text-base leading-relaxed mb-6 relative z-10">
                "{testimonial.content}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-3 mb-6">
                <div
                  className={`w-12 h-12 ${testimonial.color} rounded-full flex items-center justify-center text-white font-bold text-sm`}
                >
                  {testimonial.avatar}
                </div>
                <div>
                  <div className="font-black text-slate-900">
                    {testimonial.name}
                  </div>
                  <div className="text-xs text-slate-500">
                    {testimonial.role}
                  </div>
                </div>
              </div>

              {/* Metric */}
              <div className="bg-white rounded-2xl p-4 border border-slate-100">
                <div
                  className={`text-2xl font-black ${testimonial.color.replace("bg-", "text-")}`}
                >
                  {testimonial.metric}
                </div>
                <div className="text-xs text-slate-400 uppercase tracking-wider">
                  {testimonial.metricLabel}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
