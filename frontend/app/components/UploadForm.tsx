import { Form, useNavigation } from "react-router";
import {
  Upload,
  Loader2,
  AlertCircle,
  CheckCircle2,
  FileText,
  X,
} from "lucide-react";
import { useState, useRef } from "react";
import { Button } from "./Button";

export function UploadForm({ error }: { error?: string }) {
  const navigation = useNavigation();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isUploading =
    navigation.state === "submitting" &&
    navigation.formData?.get("intent") === "upload-cv";

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const clearFile = (e: React.MouseEvent) => {
    e.preventDefault();
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="w-full max-w-md bg-white p-10 rounded-[2.5rem] shadow-sm border border-gray-100 animate-in fade-in zoom-in duration-300">
      <div className="text-center mb-8">
        <div className="inline-flex p-3 bg-blue-50 rounded-2xl text-blue-600 mb-4">
          <FileText size={24} />
        </div>
        <h2 className="text-2xl font-black text-blue-600 tracking-tight italic">
          Initialize Profile
        </h2>
        <p className="text-sm text-gray-500 mt-2">
          Upload your CV to start the AI analysis.
        </p>
      </div>

      <Form method="post" encType="multipart/form-data" className="space-y-6">
        <input type="hidden" name="intent" value="upload-cv" />

        <div
          className={`group relative border-2 border-dashed rounded-[2rem] p-10 transition-all flex flex-col items-center justify-center min-h-[200px] ${
            selectedFile
              ? "border-emerald-200 bg-emerald-50/30"
              : "border-gray-200 hover:border-blue-500 hover:bg-blue-50/30"
          }`}
        >
          {!selectedFile ? (
            <>
              <Upload
                className="text-gray-300 group-hover:text-blue-500 mb-4 transition-colors group-hover:scale-110 duration-300"
                size={42}
              />
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] text-center group-hover:text-blue-600">
                Drop PDF here or click to browse
              </p>
            </>
          ) : (
            <div className="flex flex-col items-center animate-in zoom-in duration-200">
              <div className="relative">
                <CheckCircle2 className="text-emerald-500 mb-4" size={48} />
                <button
                  onClick={clearFile}
                  className="absolute -top-2 -right-2 p-1 bg-white border border-gray-100 rounded-full text-gray-400 hover:text-red-500 shadow-sm"
                >
                  <X size={14} />
                </button>
              </div>
              <p className="text-sm font-bold text-gray-900 text-center break-all px-4">
                {selectedFile.name}
              </p>
              <p className="text-[10px] text-emerald-600 font-bold uppercase mt-2">
                Ready to Index
              </p>
            </div>
          )}

          <input
            ref={fileInputRef}
            name="file"
            type="file"
            accept=".pdf"
            required
            onChange={handleFileChange}
            className="absolute inset-0 opacity-0 cursor-pointer"
            disabled={isUploading}
          />
        </div>

        {error && (
          <div className="flex items-center gap-2 justify-center p-3 bg-red-50 text-red-600 rounded-xl border border-red-100">
            <AlertCircle size={14} />
            <p className="text-xs font-bold">{error}</p>
          </div>
        )}
        <Button
          stiffness={300}
          damping={15}
          type="submit"
          disabled={isUploading || !selectedFile}
          variant="primary"
          className="uppercase"
        >
          {isUploading ? (
            <>
              <Loader2 className="animate-spin" size={18} />
              Vectorizing Knowledge...
            </>
          ) : (
            "Index CV"
          )}
        </Button>
      </Form>
    </div>
  );
}
