import { AlertCircle, Sparkles } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { Form } from "react-router";
import { Button } from "~/components/Button";

interface SearchFormProps {
  isLoading: boolean;
  error?: {
    title: string;
    message: string;
  } | null;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}

export function SearchForm({ isLoading, error, onSubmit }: SearchFormProps) {
  return (
    <Form method="post" className="space-y-4" onSubmit={onSubmit}>
      <textarea
        name="job_description"
        rows={4}
        placeholder="Paste the job you're applying for..."
        className="w-full text-gray-700 bg-gray-50 border border-gray-100 rounded-3xl py-4 px-6 text-sm outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all resize-none shadow-inner"
        required
      />
      <Button
        isLoading={isLoading}
        variant="primary"
        icon={<Sparkles size={16} />}
        className="w-full shadow-xl shadow-blue-500/20"
      >
        Analyze My Fit
      </Button>
      <AnimatePresence>
        {error && !isLoading && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex gap-3"
          >
            <AlertCircle className="text-red-500 shrink-0" size={18} />
            <div>
              <h3 className="text-[11px] font-bold text-red-900 uppercase tracking-tight">
                {error.title}
              </h3>
              <p className="text-[11px] text-red-700/80 leading-relaxed mt-0.5">
                {error.message}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Form>
  );
}
