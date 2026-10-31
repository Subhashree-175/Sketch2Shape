
import { useState, useCallback } from "react";
import {
  Zap,
  AlertCircle,
  CheckCircle,
  Sparkles,
  Cpu,
  Cloud,
  ArrowRight,
  Loader2,
  Box,
} from "lucide-react";

import { generate3d } from "../api";

export default function GeneratePanel({ imageDataUrl, file }) {
  const [colabMode, setColabMode] = useState(false);
  const [colabUrl, setColabUrl] = useState("");
  const [prompt, setPrompt] = useState("");
  const [status, setStatus] = useState("idle");
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const hasInput = Boolean(imageDataUrl || file);

  const handleGenerate = useCallback(async () => {
    if (!hasInput) return;

    if (colabMode && !colabUrl.trim()) {
      setError("Please enter your Colab server URL.");
      return;
    }

    setStatus("generating");
    setError(null);
    setResult(null);

    try {
      let blob;

      if (imageDataUrl) {
        const response = await fetch(imageDataUrl);
        blob = await response.blob();
      } else {
        blob = file;
      }

      const payload = {
        file: blob,
        prompt,
        useColab: colabMode,
        colabUrl: colabUrl.trim(),
      };

      const data = await generate3d(payload);

      if (!data.ok) {
        throw new Error(data.note || "3D generation failed.");
      }

      setResult(data);
      setStatus("success");
    } catch (err) {
      setError(err.message || "Something went wrong.");
      setStatus("error");
    }
  }, [hasInput, imageDataUrl, file, prompt, colabMode, colabUrl]);

  return (
    <section className="relative overflow-hidden rounded-2xl border border-white/10 bg-slate-900/80 p-4 shadow-2xl shadow-black/20 backdrop-blur-xl sm:p-6 lg:p-7">

      {/* Background decorations */}
      <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-indigo-500/10 blur-[90px]" />
      <div className="pointer-events-none absolute -bottom-20 -left-20 h-56 w-56 rounded-full bg-cyan-500/10 blur-[90px]" />

      <div className="relative z-10 space-y-6">

        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-indigo-400/20 bg-indigo-500/10">
              <Sparkles className="h-5 w-5 text-indigo-400" />
            </div>

            <div>
              <h3 className="text-lg font-bold tracking-tight text-white sm:text-xl">
                Generate 3D Model
              </h3>
              <p className="mt-0.5 text-xs text-slate-400 sm:text-sm">
                Transform your 2D sketch into a 3D asset
              </p>
            </div>
          </div>

          <span className="w-fit rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-emerald-400">
            AI Powered
          </span>
        </div>

        {/* Generation mode */}
        <div className="space-y-3">

          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Select Processing Mode
          </p>

          <div className="grid grid-cols-2 gap-3">

            {/* Local mode */}
            <button
              type="button"
              onClick={() => {
                setColabMode(false);
                setError(null);
              }}
              className={`group flex min-w-0 items-center gap-3 rounded-xl border p-3 text-left transition-all duration-300 sm:p-4 ${
                !colabMode
                  ? "border-indigo-400/50 bg-indigo-500/10 shadow-lg shadow-indigo-500/5"
                  : "border-white/10 bg-slate-800/40 hover:border-white/20 hover:bg-slate-800/70"
              }`}
            >
              <div
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                  !colabMode
                    ? "bg-indigo-500/20 text-indigo-400"
                    : "bg-slate-700/60 text-slate-400"
                }`}
              >
                <Cpu size={19} />
              </div>

              <div className="min-w-0">
                <p className="truncate text-xs font-semibold text-white sm:text-sm">
                  Local Demo
                </p>
                <p className="mt-1 text-[10px] text-slate-400 sm:text-xs">
                  Local processing
                </p>
              </div>

              <div
                className={`ml-auto h-3 w-3 shrink-0 rounded-full border-2 ${
                  !colabMode
                    ? "border-indigo-400 bg-indigo-400"
                    : "border-slate-600"
                }`}
              />
            </button>

            {/* Colab mode */}
            <button
              type="button"
              onClick={() => {
                setColabMode(true);
                setError(null);
              }}
              className={`group flex min-w-0 items-center gap-3 rounded-xl border p-3 text-left transition-all duration-300 sm:p-4 ${
                colabMode
                  ? "border-cyan-400/50 bg-cyan-500/10 shadow-lg shadow-cyan-500/5"
                  : "border-white/10 bg-slate-800/40 hover:border-white/20 hover:bg-slate-800/70"
              }`}
            >
              <div
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                  colabMode
                    ? "bg-cyan-500/20 text-cyan-400"
                    : "bg-slate-700/60 text-slate-400"
                }`}
              >
                <Cloud size={19} />
              </div>

              <div className="min-w-0">
                <p className="truncate text-xs font-semibold text-white sm:text-sm">
                  Colab GPU
                </p>
                <p className="mt-1 text-[10px] text-slate-400 sm:text-xs">
                  Remote NVIDIA GPU
                </p>
              </div>

              <div
                className={`ml-auto h-3 w-3 shrink-0 rounded-full border-2 ${
                  colabMode
                    ? "border-cyan-400 bg-cyan-400"
                    : "border-slate-600"
                }`}
              />
            </button>
          </div>
        </div>

        {/* Colab URL */}
        {colabMode && (
          <div className="animate-in fade-in slide-in-from-top-2 duration-300">
            <label className="mb-2 block text-xs font-medium text-slate-300">
              Colab Server URL
            </label>

            <div className="relative">
              <Cloud
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-cyan-400"
              />

              <input
                type="url"
                placeholder="https://your-ngrok-url.ngrok-free.app"
                value={colabUrl}
                onChange={(e) => setColabUrl(e.target.value)}
                className="w-full rounded-xl border border-cyan-400/20 bg-slate-950/70 py-3 pl-10 pr-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-400/10"
              />
            </div>

            <p className="mt-2 text-[11px] text-slate-500">
              Enter the public URL of your running Colab inference server.
            </p>
          </div>
        )}

        {/* Prompt input */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-xs font-medium text-slate-300">
            <Sparkles size={14} className="text-indigo-400" />
            Additional Instructions
            <span className="font-normal text-slate-500">(Optional)</span>
          </label>

          <textarea
            rows={2}
            placeholder="Example: A shiny red metallic toy car with smooth surfaces..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="w-full resize-none rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-indigo-400/50 focus:ring-2 focus:ring-indigo-400/10"
          />
        </div>

        {/* Input status */}
        <div className="flex items-center gap-2 rounded-lg border border-white/5 bg-slate-950/40 px-3 py-2.5">
          <div
            className={`h-2 w-2 shrink-0 rounded-full ${
              hasInput ? "bg-emerald-400" : "bg-amber-400"
            }`}
          />

          <p className="text-xs text-slate-400">
            {hasInput
              ? "Sketch detected. Ready for 3D generation."
              : "Draw or upload a sketch to get started."}
          </p>
        </div>

        {/* Generate button */}
        <button
          type="button"
          onClick={handleGenerate}
          disabled={
            status === "generating" ||
            !hasInput ||
            (colabMode && !colabUrl.trim())
          }
          className="group flex w-full items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-indigo-500/20 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-indigo-500/30 disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none sm:py-4"
        >
          {status === "generating" ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              Generating your 3D model...
            </>
          ) : (
            <>
              <Zap size={18} />
              Generate 3D Model
              <ArrowRight
                size={17}
                className="transition-transform group-hover:translate-x-1"
              />
            </>
          )}
        </button>

        {/* Loading status */}
        {status === "generating" && (
          <div className="space-y-2">
            <div className="h-1.5 overflow-hidden rounded-full bg-slate-800">
              <div className="h-full w-1/2 animate-pulse rounded-full bg-gradient-to-r from-indigo-500 to-cyan-400" />
            </div>

            <p className="text-center text-xs text-slate-500">
              Processing your sketch. This may take a few moments.
            </p>
          </div>
        )}

        {/* Error message */}
        {error && (
          <div
            role="alert"
            className="flex items-start gap-3 rounded-xl border border-rose-500/20 bg-rose-500/10 p-4 text-rose-400"
          >
            <AlertCircle size={18} className="mt-0.5 shrink-0" />

            <div className="min-w-0">
              <p className="text-sm font-semibold">Generation failed</p>
              <p className="mt-1 break-words text-xs text-rose-300/80">
                {error}
              </p>
            </div>
          </div>
        )}

        {/* Success message */}
        {status === "success" && result && (
          <div className="flex items-start gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-500/15">
              <CheckCircle size={19} className="text-emerald-400" />
            </div>

            <div>
              <p className="text-sm font-semibold text-emerald-400">
                Your 3D model is ready!
              </p>

              <p className="mt-1 text-xs text-emerald-400/70">
                Generation completed successfully. You can now preview your
                3D asset.
              </p>
            </div>

            <Box size={20} className="ml-auto shrink-0 text-emerald-400/60" />
          </div>
        )}

      </div>
    </section>
  );
}
