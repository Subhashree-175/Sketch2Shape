import { useState, useCallback, useRef, useEffect } from "react";
import {
  Upload as UploadIcon,
  Image as ImageIcon,
  X,
  FileImage,
  CheckCircle2,
  CloudUpload,
} from "lucide-react";

export default function Upload({ onImageReady }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState("");

  const inputRef = useRef(null);
  const previewRef = useRef(null);

  // Clean up preview URL
  useEffect(() => {
    return () => {
      if (previewRef.current) {
        URL.revokeObjectURL(previewRef.current);
      }
    };
  }, []);

  const processFile = useCallback(
    (selectedFile) => {
      if (!selectedFile) return;

      setError("");

      // Validate image type
      if (!["image/png", "image/jpeg", "image/webp"].includes(selectedFile.type)) {
        setError("Please upload a PNG, JPG, or WEBP image.");
        return;
      }

      // Validate file size (5 MB)
      if (selectedFile.size > 5 * 1024 * 1024) {
        setError("Image size must be less than 5 MB.");
        return;
      }

      // Remove previous preview
      if (previewRef.current) {
        URL.revokeObjectURL(previewRef.current);
      }

      const imageUrl = URL.createObjectURL(selectedFile);

      previewRef.current = imageUrl;

      setFile(selectedFile);
      setPreview(imageUrl);

      if (onImageReady) {
        onImageReady(imageUrl);
      }
    },
    [onImageReady]
  );

  const handleFile = useCallback(
    (e) => {
      processFile(e.target.files?.[0]);
      e.target.value = "";
    },
    [processFile]
  );

  const reset = useCallback(() => {
    if (previewRef.current) {
      URL.revokeObjectURL(previewRef.current);
      previewRef.current = null;
    }

    setFile(null);
    setPreview(null);
    setError("");

    if (inputRef.current) {
      inputRef.current.value = "";
    }

    if (onImageReady) {
      onImageReady(null);
    }
  }, [onImageReady]);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    const droppedFile = e.dataTransfer.files?.[0];
    processFile(droppedFile);
  };

  const formatSize = (size) => {
    return size < 1024 * 1024
      ? `${(size / 1024).toFixed(1)} KB`
      : `${(size / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <div className="mb-8 w-full rounded-3xl border border-white/10 bg-slate-900/80 p-4 shadow-2xl shadow-black/20 backdrop-blur-xl sm:p-6">

      {/* Header */}
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <div className="rounded-xl bg-indigo-500/15 p-2 text-indigo-400">
              <ImageIcon size={19} />
            </div>

            <h3 className="text-lg font-bold text-white">
              Upload Your Sketch
            </h3>
          </div>

          <p className="mt-1 text-xs text-slate-400 sm:text-sm">
            Already have a sketch? Upload it to create your 3D model.
          </p>
        </div>

        {file && (
          <span className="flex w-fit items-center gap-1.5 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1.5 text-xs font-medium text-emerald-400">
            <CheckCircle2 size={14} />
            Image Ready
          </span>
        )}
      </div>

      {/* Upload Area */}
      {!preview ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={`group flex min-h-[220px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-6 text-center transition-all duration-300 sm:min-h-[270px] sm:p-10 ${
            isDragging
              ? "scale-[1.01] border-indigo-400 bg-indigo-500/10"
              : "border-slate-700 bg-slate-950/50 hover:border-indigo-500/60 hover:bg-indigo-500/5"
          }`}
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp"
            className="hidden"
            onChange={handleFile}
          />

          <div className="mb-4 rounded-2xl border border-indigo-400/20 bg-indigo-500/10 p-4 transition-transform duration-300 group-hover:scale-110">
            <CloudUpload
              size={34}
              className="text-indigo-400"
            />
          </div>

          <h4 className="text-base font-semibold text-white sm:text-lg">
            {isDragging ? "Drop your sketch here" : "Drag & Drop Your Sketch"}
          </h4>

          <p className="mt-2 text-xs text-slate-400 sm:text-sm">
            or click below to browse your files
          </p>

          <span className="mt-5 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-500">
            <UploadIcon size={16} />
            Choose Image
          </span>

          <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
            {["PNG", "JPG", "WEBP"].map((type) => (
              <span
                key={type}
                className="rounded-md border border-white/10 bg-slate-800 px-2.5 py-1 text-[10px] font-semibold tracking-wider text-slate-400"
              >
                {type}
              </span>
            ))}
          </div>

          <p className="mt-3 text-[11px] text-slate-500">
            Maximum file size: 5 MB
          </p>
        </div>
      ) : (
        /* Image Preview */
        <div className="rounded-2xl border border-white/10 bg-slate-950/50 p-3 sm:p-5">

          <div className="mb-4 flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <div className="rounded-xl bg-indigo-500/10 p-2 text-indigo-400">
                <FileImage size={20} />
              </div>

              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-white">
                  {file?.name}
                </p>
                <p className="text-xs text-slate-400">
                  {file && formatSize(file.size)}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={reset}
              className="flex shrink-0 items-center gap-1.5 rounded-lg border border-rose-500/20 bg-rose-500/10 px-3 py-2 text-xs font-medium text-rose-400 transition hover:bg-rose-500/20"
            >
              <X size={15} />
              <span className="hidden sm:inline">Remove</span>
            </button>
          </div>

          <div className="flex min-h-[200px] items-center justify-center overflow-hidden rounded-xl border border-slate-700 bg-white p-2 sm:min-h-[300px]">
            <img
              src={preview}
              alt="Uploaded sketch preview"
              className="max-h-[400px] w-full object-contain"
            />
          </div>

          <div className="mt-4 flex items-center gap-2 text-xs text-emerald-400">
            <CheckCircle2 size={15} />
            Your sketch is ready for 3D generation.
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div
          role="alert"
          className="mt-4 rounded-xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-400"
        >
          {error}
        </div>
      )}

      {/* Footer */}
      <div className="mt-4 flex flex-col gap-2 text-center sm:flex-row sm:items-center sm:justify-between sm:text-left">
        <p className="text-xs text-slate-500">
          Best results: clear sketches with visible object outlines.
        </p>

        <p className="text-xs text-indigo-400">
          ✦ Ready for Sketch2Shape AI
        </p>
      </div>
    </div>
  );
}