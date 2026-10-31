import { useState, useCallback } from "react";
import {
  Sparkles,
  Box,
  Github,
  ArrowRight,
  Download,
  ExternalLink,
  Layers3,
  WandSparkles,
  ShieldCheck,
  Zap,
  Cpu,
  CheckCircle2,
} from "lucide-react";

import SketchCanvas from "./components/SketchCanvas";
import Upload from "./components/Upload";
import GeneratePanel from "./components/GeneratePanel";
import ModelViewer from "./components/ModelViewer";

export default function App() {
  const [imageDataUrl, setImageDataUrl] = useState(null);
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [prompt, setPrompt] = useState("");

  const onImageReady = useCallback((url) => {
    setImageDataUrl(url);
    setFile(null);
    setResult(null);
  }, []);

  const onUploadReady = useCallback((url, f) => {
    setImageDataUrl(url);
    setFile(f);
    setResult(null);
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#070B18] text-white">

      {/* Background Effects */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-[450px] w-[450px] rounded-full bg-indigo-600/10 blur-[130px]" />
        <div className="absolute -right-40 top-[30%] h-[450px] w-[450px] rounded-full bg-violet-600/10 blur-[130px]" />
        <div className="absolute bottom-0 left-1/3 h-[350px] w-[350px] rounded-full bg-blue-500/5 blur-[120px]" />
      </div>

      <div className="relative z-10">

        {/* NAVBAR */}
        <nav className="sticky top-0 z-50 border-b border-white/[0.06] bg-[#070B18]/80 backdrop-blur-2xl">
          <div className="mx-auto flex max-w-[1500px] items-center justify-between px-4 py-4 sm:px-6 lg:px-10">

            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-lg shadow-indigo-500/20">
                <Box size={23} className="text-white" />
              </div>

              <div>
                <h1 className="text-lg font-bold tracking-tight sm:text-xl">
                  Sketch2Shape<span className="text-indigo-400"> AI</span>
                </h1>
                <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                  Intelligent 3D Generation
                </p>
              </div>
            </div>

            {/* Navigation */}
            <div className="hidden items-center gap-8 md:flex">
              <a href="#workspace" className="text-sm text-slate-400 transition hover:text-white">
                Workspace
              </a>

              <a href="#how-it-works" className="text-sm text-slate-400 transition hover:text-white">
                How it works
              </a>

              <a href="#about" className="text-sm text-slate-400 transition hover:text-white">
                About
              </a>
            </div>

            {/* Hackathon Badge */}
            <div className="flex items-center gap-2 rounded-full border border-indigo-400/20 bg-indigo-500/10 px-3 py-2">
              <Sparkles size={14} className="text-indigo-400" />
              <span className="hidden text-xs font-semibold text-indigo-300 sm:block">
                TECHZEPHYR 4.0
              </span>
              <span className="text-xs font-semibold text-indigo-300 sm:hidden">
                TZ 4.0
              </span>
            </div>

          </div>
        </nav>

        {/* HERO SECTION */}
        <section className="mx-auto max-w-[1500px] px-4 pb-10 pt-12 sm:px-6 sm:pb-14 sm:pt-16 lg:px-10 lg:pt-20">

          <div className="grid items-center gap-10 lg:grid-cols-2">

            {/* Hero Text */}
            <div>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-400/20 bg-indigo-500/10 px-4 py-2">
                <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
                <span className="text-xs font-medium text-indigo-300">
                  AI-Powered 2D to 3D Transformation
                </span>
              </div>

              <h2 className="max-w-3xl text-4xl font-extrabold leading-[1.15] tracking-tight sm:text-5xl lg:text-6xl">
                Bring Your
                <span className="block bg-gradient-to-r from-indigo-400 via-violet-400 to-blue-400 bg-clip-text text-transparent">
                  Sketches to Life.
                </span>
              </h2>

              <p className="mt-6 max-w-xl text-sm leading-7 text-slate-400 sm:text-base">
                Transform simple 2D hand-drawn sketches into detailed,
                textured 3D assets. Draw your imagination, let AI do the
                reconstruction, and explore your creation in 3D.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <a
                  href="#workspace"
                  className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-3.5 text-sm font-semibold text-white shadow-xl shadow-indigo-600/20 transition hover:-translate-y-0.5 hover:shadow-indigo-500/30"
                >
                  Start Creating
                  <ArrowRight size={17} className="transition group-hover:translate-x-1" />
                </a>

                <a
                  href="#how-it-works"
                  className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-6 py-3.5 text-sm font-semibold text-slate-300 transition hover:border-white/20 hover:bg-white/[0.06]"
                >
                  Explore Process
                </a>
              </div>

              {/* Quick Features */}
              <div className="mt-10 flex flex-wrap gap-6">
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <Zap size={16} className="text-amber-400" />
                  AI Reconstruction
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <Layers3 size={16} className="text-indigo-400" />
                  Real 3D Geometry
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <Download size={16} className="text-emerald-400" />
                  GLB Export
                </div>
              </div>
            </div>

            {/* Hero Visual */}
            <div className="relative hidden lg:block">
              <div className="absolute inset-0 rounded-full bg-indigo-500/10 blur-[100px]" />

              <div className="relative rounded-[2rem] border border-white/10 bg-gradient-to-br from-white/[0.08] to-white/[0.02] p-5 shadow-2xl backdrop-blur-xl">

                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-white">
                      From Sketch to Shape
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      Your imagination, reconstructed.
                    </p>
                  </div>

                  <div className="rounded-xl bg-indigo-500/15 p-2 text-indigo-400">
                    <WandSparkles size={20} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-4">
                    <div className="mb-3 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                      01 / Input
                    </div>

                    <div className="flex h-44 items-center justify-center rounded-xl bg-white">
                      <svg viewBox="0 0 180 180" className="h-36 w-36">
                        <path
                          d="M42 70 L90 30 L138 70 L130 140 L50 140 Z"
                          fill="none"
                          stroke="#111827"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M42 70 L90 80 L138 70 M90 80 L90 140"
                          fill="none"
                          stroke="#111827"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                        />
                        <path
                          d="M50 140 L90 150 L130 140"
                          fill="none"
                          stroke="#111827"
                          strokeWidth="2"
                        />
                      </svg>
                    </div>

                    <p className="mt-3 text-center text-xs text-slate-400">
                      2D Sketch
                    </p>
                  </div>

                  <div className="rounded-2xl border border-indigo-400/20 bg-indigo-500/[0.06] p-4">
                    <div className="mb-3 text-[10px] font-bold uppercase tracking-widest text-indigo-400">
                      02 / Output
                    </div>

                    <div className="flex h-44 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-950 to-slate-950">
                      <Box size={105} strokeWidth={0.8} className="text-indigo-300 drop-shadow-[0_0_25px_rgba(129,140,248,0.5)]" />
                    </div>

                    <p className="mt-3 text-center text-xs text-indigo-300">
                      3D Asset
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-center gap-2 rounded-xl border border-white/5 bg-white/[0.03] p-3">
                  <Sparkles size={15} className="text-indigo-400" />
                  <span className="text-xs text-slate-300">
                    Powered by AI-based 3D reconstruction
                  </span>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* WORKSPACE */}
        <section id="workspace" className="mx-auto max-w-[1500px] scroll-mt-24 px-4 py-10 sm:px-6 lg:px-10">

          {/* Section Heading */}
          <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-indigo-400">
                <span className="h-px w-6 bg-indigo-400" />
                Creation Studio
              </div>

              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                Your 3D Workspace
              </h2>

              <p className="mt-2 text-sm text-slate-400">
                Create a sketch, configure your generation, and preview the result.
              </p>
            </div>

            <div className="flex w-fit items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              <span className="text-xs font-medium text-slate-300">
                Workspace Ready
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-12">

            {/* LEFT: INPUT */}
            <div className="space-y-6 xl:col-span-5">

              {/* Sketch */}
              <div>
                <div className="mb-3 flex items-center gap-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-500/15 text-xs font-bold text-indigo-400">
                    01
                  </span>
                  <h3 className="text-sm font-semibold text-white">
                    Draw Your Sketch
                  </h3>
                </div>

                <SketchCanvas onImageReady={onImageReady} />
              </div>

              {/* Upload */}
              <div>
                <div className="mb-3 flex items-center gap-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-500/15 text-xs font-bold text-indigo-400">
                    02
                  </span>
                  <h3 className="text-sm font-semibold text-white">
                    Or Upload an Image
                  </h3>
                </div>

                <Upload onImageReady={(url) => onUploadReady(url, null)} />
              </div>

              {/* Prompt */}
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-6">
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <WandSparkles size={18} className="text-indigo-400" />
                    <h3 className="text-sm font-semibold text-white">
                      Creative Direction
                    </h3>
                  </div>

                  <span className="rounded-full border border-white/10 px-2.5 py-1 text-[10px] text-slate-400">
                    OPTIONAL
                  </span>
                </div>

                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Example: A modern wooden chair with smooth curved edges..."
                  className="min-h-[110px] w-full resize-none rounded-xl border border-white/10 bg-slate-950/70 p-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-indigo-500/60 focus:ring-2 focus:ring-indigo-500/10"
                />

                <p className="mt-3 text-xs leading-5 text-slate-500">
                  Describe the material, color, or appearance you want.
                </p>
              </div>

              {/* Generate */}
              <GeneratePanel
                imageDataUrl={imageDataUrl}
                file={file}
                prompt={prompt}
                onResult={setResult}
              />

            </div>

            {/* RIGHT: PREVIEW */}
            <div className="space-y-6 xl:sticky xl:top-24 xl:col-span-7">

              <div className="mb-3 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-violet-500/15 text-xs font-bold text-violet-400">
                      03
                    </span>
                    <h3 className="text-sm font-semibold text-white">
                      3D Model Preview
                    </h3>
                  </div>

                  <p className="ml-9 mt-1 text-xs text-slate-500">
                    Explore and interact with your generated model.
                  </p>
                </div>

                {result?.ok && (
                  <span className="flex items-center gap-1.5 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1.5 text-xs font-medium text-emerald-400">
                    <CheckCircle2 size={13} />
                    Generated
                  </span>
                )}
              </div>

              <ModelViewer
                src={result?.preview_url || null}
                loading={false}
              />

              {/* Result Card */}
              {result?.ok && (
                <div className="rounded-2xl border border-emerald-400/20 bg-gradient-to-br from-emerald-500/[0.08] to-transparent p-5 sm:p-6">

                  <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 size={18} className="text-emerald-400" />
                        <h3 className="font-semibold text-white">
                          Your 3D Model is Ready!
                        </h3>
                      </div>

                      <p className="mt-1 text-xs text-slate-400">
                        Your model has been successfully generated.
                      </p>
                    </div>

                    <span className="w-fit rounded-lg border border-emerald-400/20 bg-emerald-400/10 px-3 py-1.5 font-mono text-xs text-emerald-300">
                      .GLB
                    </span>
                  </div>

                  <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {[
                      ["Vertices", result.mesh_info?.vertices ?? "—"],
                      ["Faces", result.mesh_info?.faces ?? "—"],
                      ["Format", result.mesh_info?.format ?? "GLB"],
                      ["Textured", result.mesh_info?.has_texture ? "Yes" : "No"],
                    ].map(([label, value]) => (
                      <div
                        key={label}
                        className="rounded-xl border border-white/5 bg-slate-950/50 p-3"
                      >
                        <p className="text-[10px] uppercase tracking-wider text-slate-500">
                          {label}
                        </p>
                        <p className="mt-1 truncate text-sm font-semibold text-white">
                          {value}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row">
                    <a
                      href={result.download_url}
                      download={result.filename || "sketch2shape.glb"}
                      className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400"
                    >
                      <Download size={17} />
                      Download 3D Model
                    </a>

                    <button
                      type="button"
                      onClick={() => window.open(result.preview_url, "_blank", "noopener,noreferrer")}
                      className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/[0.08]"
                    >
                      <ExternalLink size={16} />
                      Open Preview
                    </button>
                  </div>
                </div>
              )}

            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section
          id="how-it-works"
          className="mx-auto max-w-[1500px] scroll-mt-24 px-4 py-16 sm:px-6 lg:px-10"
        >
          <div className="mb-10 text-center">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-indigo-400">
              Simple Workflow
            </p>

            <h2 className="text-2xl font-bold sm:text-3xl">
              From 2D to 3D in Three Steps
            </h2>

            <p className="mt-3 text-sm text-slate-400">
              A simple workflow powered by AI reconstruction.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {[
              {
                number: "01",
                icon: PencilIcon,
                title: "Draw or Upload",
                description: "Create a simple hand-drawn sketch or upload an existing image.",
              },
              {
                number: "02",
                icon: Cpu,
                title: "AI Reconstruction",
                description: "The AI pipeline processes your sketch and reconstructs a 3D asset.",
              },
              {
                number: "03",
                icon: Box,
                title: "Explore & Download",
                description: "View your 3D model, rotate it, and export it in GLB format.",
              },
            ].map((step) => {
              const Icon = step.icon;

              return (
                <div
                  key={step.number}
                  className="group rounded-2xl border border-white/[0.07] bg-white/[0.025] p-6 transition duration-300 hover:-translate-y-1 hover:border-indigo-400/30 hover:bg-indigo-500/[0.04]"
                >
                  <div className="mb-6 flex items-center justify-between">
                    <div className="rounded-xl border border-indigo-400/20 bg-indigo-500/10 p-3 text-indigo-400 transition group-hover:bg-indigo-500 group-hover:text-white">
                      <Icon size={22} />
                    </div>

                    <span className="text-3xl font-black text-white/10">
                      {step.number}
                    </span>
                  </div>

                  <h3 className="text-base font-semibold text-white">
                    {step.title}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-slate-400">
                    {step.description}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* ABOUT */}
        <section
          id="about"
          className="mx-auto max-w-[1500px] scroll-mt-24 px-4 pb-16 sm:px-6 lg:px-10"
        >
          <div className="rounded-3xl border border-indigo-400/15 bg-gradient-to-r from-indigo-500/[0.10] via-violet-500/[0.06] to-transparent p-6 sm:p-10">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div className="max-w-2xl">
                <div className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-indigo-400">
                  <ShieldCheck size={15} />
                  Built for TechZephyr 4.0
                </div>

                <h2 className="text-2xl font-bold sm:text-3xl">
                  Turning imagination into geometry.
                </h2>

                <p className="mt-3 text-sm leading-7 text-slate-400">
                  Sketch2Shape AI explores how artificial intelligence can
                  bridge the gap between simple 2D drawings and interactive
                  3D assets.
                </p>
              </div>

              <div className="flex shrink-0 items-center gap-3 rounded-2xl border border-white/10 bg-slate-950/40 p-4">
                <div className="rounded-xl bg-indigo-500/15 p-3 text-indigo-400">
                  <Box size={25} />
                </div>

                <div>
                  <p className="text-sm font-bold text-white">
                    IIT Bhubaneswar
                  </p>
                  <p className="text-xs text-slate-500">
                    TechZephyr 4.0
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="border-t border-white/[0.06] bg-slate-950/40">
          <div className="mx-auto flex max-w-[1500px] flex-col gap-4 px-4 py-7 text-center sm:px-6 md:flex-row md:items-center md:justify-between md:text-left lg:px-10">

            <div>
              <p className="text-sm font-bold text-white">
                Sketch2Shape<span className="text-indigo-400"> AI</span>
              </p>
              <p className="mt-1 text-xs text-slate-500">
                From a 2D sketch to a 3D asset.
              </p>
            </div>

            <p className="text-xs text-slate-500">
              TECHZEPHYR 4.0 · IIT Bhubaneswar
            </p>

            <div className="flex items-center justify-center gap-2 text-xs text-slate-500">
              <Sparkles size={14} className="text-indigo-400" />
              Built with AI
            </div>

          </div>
        </footer>

      </div>
    </div>
  );
}

// Small icon used in the workflow section
function PencilIcon(props) {
  return <WandSparkles {...props} />;
}