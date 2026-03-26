import { AlertCircle, CheckCircle2, Loader2, Upload, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Form, type Navigation, type SubmitFunction } from "react-router";
import { Button } from "./Button";
import { ErrorComponent } from "./Error";
import { ScanningLine } from "./ScanningLine";

export function UploadForm({
  error,
  submit,
  navigation,
}: {
  error?: {
    title: string;
    message: string;
  };
  submit: SubmitFunction;
  navigation: Navigation;
}) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // The scanner only runs when the specific "upload-cv" intent is active
  const isProcessing =
    navigation.state !== "idle" &&
    navigation.formData?.get("intent") === "upload-cv";

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setSelectedFile(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "application/pdf": [".pdf"] },
    multiple: false,
    disabled: isProcessing,
  });

  const handleManualSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedFile) return;

    const formData = new FormData(e.currentTarget);
    formData.append("file", selectedFile);
    formData.append("intent", "upload-cv");

    submit(formData, { method: "post", encType: "multipart/form-data" });
  };

  return (
    <div className="w-full max-w-md bg-white p-10 mt-2 rounded-[2.5rem] shadow-sm border border-gray-100 relative overflow-hidden">
      {/* 1. Processing Overlay: Triggered by useNavigation */}
      <AnimatePresence>
        {isProcessing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 bg-white/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center"
          >
            <ScanningLine />
            <Loader2 className="animate-spin text-blue-600 mb-4" size={40} />
            <h3 className="text-xl font-black text-gray-900 tracking-tight italic">
              Processing your resume...
            </h3>
            <p className="text-xs text-gray-500 mt-2 px-8">
              I'm analyzing your experience to find your best job matches.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <Form method="post" onSubmit={handleManualSubmit} className="space-y-6">
        <div
          {...getRootProps()}
          className={`relative border-2 border-dashed rounded-[2rem] p-10 transition-all cursor-pointer flex flex-col items-center justify-center min-h-[200px]
            ${isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-blue-400"}
            ${error ? "border-red-200 bg-red-50/30" : ""}`}
        >
          <input {...getInputProps()} data-testid="file-input" />

          <AnimatePresence mode="wait">
            {!selectedFile ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center"
              >
                <Upload
                  className={`mb-4 ${error ? "text-red-300" : "text-gray-300"}`}
                  size={48}
                />
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">
                  Drop your resume here
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="selected"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="flex flex-col items-center text-center"
              >
                <div className="relative mb-2">
                  <div
                    className={`p-4 rounded-2xl ${error ? "bg-red-50" : "bg-emerald-50"}`}
                  >
                    {error ? (
                      <AlertCircle className="text-red-500" size={32} />
                    ) : (
                      <CheckCircle2 className="text-emerald-500" size={32} />
                    )}
                  </div>
                  {!isProcessing && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedFile(null);
                      }}
                      className="absolute -top-2 -right-2 p-1 bg-white border border-gray-100 rounded-full text-gray-400 hover:text-red-500 shadow-sm"
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>
                <p className="text-sm font-bold text-gray-900 max-w-[200px] truncate">
                  {selectedFile.name}
                </p>
                <p
                  className={`text-[10px] font-bold uppercase mt-1 ${error ? "text-red-600" : "text-emerald-600"}`}
                >
                  {error ? "Analysis Failed" : "Ready for scanning"}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Dynamic Error Feedback from ActionData */}
        {error && (
          <ErrorComponent title={error.title} message={error.message} />
        )}

        <Button
          type="submit"
          disabled={isProcessing || !selectedFile}
          variant={error ? "outline" : "primary"}
          className="w-full uppercase h-14"
        >
          {isProcessing
            ? "Analyzing..."
            : error
              ? "Try Again"
              : "Upload Resume"}
        </Button>
      </Form>
    </div>
  );
}
