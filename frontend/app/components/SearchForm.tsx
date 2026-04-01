import { Sparkles } from "lucide-react";
import { Form } from "react-router";
import { Button } from "~/components/Button";
import { ErrorComponent } from "./Error";

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
      {error && !isLoading && (
        <ErrorComponent title={error.title} message={error.message} />
      )}
    </Form>
  );
}
