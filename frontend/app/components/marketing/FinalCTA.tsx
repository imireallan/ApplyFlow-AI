import { motion } from "motion/react";
import { Button } from "~/components/Button";
import { useNavigate } from "react-router";
import { ArrowRight, Check } from "lucide-react";

export function FinalCTA() {
  const navigate = useNavigate();

  return (
    <section className="py-20 sm:py-24 bg-[#155DFC] relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
      </div>

      <div className="max-w-4xl mx-auto px-6 sm:px-8 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight mb-6">
            Ready to Land Your Dream Job?
          </h2>
          <p className="text-lg sm:text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
            Join 10,000+ job seekers who have transformed their applications
            with AI-powered insights.
          </p>

          {/* Benefits */}
          <div className="flex flex-wrap justify-center gap-4 sm:gap-6 mb-10">
            {[
              "100% Free to Use",
              "No Sign-up Required",
              "Instant Results",
              "Personalized Messages",
            ].map((benefit) => (
              <div
                key={benefit}
                className="flex items-center gap-2 text-white/90 text-sm font-medium"
              >
                <Check className="w-4 h-4 text-blue-300" />
                {benefit}
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => navigate("/app")}
              className="bg-white text-blue-600 hover:bg-blue-50 shadow-xl shadow-blue-900/20 px-8"
              size="rounded"
            >
              Start Free Analysis
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                document
                  .getElementById("how-it-works")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
              className="border-white/30 text-white hover:bg-white/10 px-8"
              size="rounded"
            >
              See How It Works
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
