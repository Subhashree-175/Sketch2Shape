import { useState } from "react";
import {
Box,
Sparkles,
RotateCw,
Maximize2,
MousePointer2,
Cuboid,
} from "lucide-react";

export default function ModelViewer({ src, loading }) {
const [isFullscreen, setIsFullscreen] = useState(false);

return ( <section className="relative overflow-hidden rounded-2xl border border-white/10 bg-slate-900/80 p-4 shadow-2xl shadow-black/20 backdrop-blur-xl sm:p-6 lg:p-7">


  {/* Background glow */}
  <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-indigo-500/10 blur-[90px]" />
  <div className="pointer-events-none absolute -bottom-20 -left-20 h-56 w-56 rounded-full bg-cyan-500/10 blur-[90px]" />

  <div className="relative z-10 space-y-5">

    {/* Header */}
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-indigo-400/20 bg-indigo-500/10">
          <Box className="h-5 w-5 text-indigo-400" />
        </div>

        <div>
          <h3 className="text-lg font-bold tracking-tight text-white sm:text-xl">
            3D Model Preview
          </h3>

          <p className="mt-0.5 text-xs text-slate-400 sm:text-sm">
            Explore and interact with your generated asset
          </p>
        </div>
      </div>

      {src && !loading && (
        <span className="flex w-fit items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-emerald-400">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
          Model Ready
        </span>
      )}
    </div>

    {/* Viewer container */}
    <div
      className={`group relative mx-auto w-full overflow-hidden rounded-2xl border border-white/10 bg-slate-950/80 shadow-inner shadow-black/40 transition-all duration-300 ${
        isFullscreen
          ? "fixed inset-3 z-50 h-[calc(100dvh-1.5rem)] w-auto"
          : "aspect-square sm:aspect-video"
      }`}
    >

      {/* Grid background */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(148,163,184,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.2) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      {/* Model viewer */}
      {src && !loading ? (
        <>
          <model-viewer
            src={src}
            alt="Generated 3D model"
            auto-rotate
            camera-controls
            shadow-intensity="1"
            exposure="1"
            environment-image="neutral"
            interaction-prompt="auto"
            touch-action="pan-y"
            style={{
              width: "100%",
              height: "100%",
              display: "block",
              backgroundColor: "transparent",
              position: "relative",
              zIndex: 1,
            }}
          />

          {/* Fullscreen control */}
          <button
            type="button"
            onClick={() => setIsFullscreen((prev) => !prev)}
            className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-slate-900/80 text-slate-300 opacity-100 backdrop-blur-md transition hover:border-indigo-400/40 hover:text-white sm:opacity-0 sm:group-hover:opacity-100"
            aria-label={isFullscreen ? "Exit fullscreen" : "Expand preview"}
          >
            <Maximize2 size={16} />
          </button>

          {/* Fullscreen close button */}
          {isFullscreen && (
            <button
              type="button"
              onClick={() => setIsFullscreen(false)}
              className="absolute bottom-3 right-3 z-20 rounded-lg border border-white/10 bg-slate-800 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-700"
            >
              Close Preview
            </button>
          )}

          {/* Viewer hint */}
          <div className="pointer-events-none absolute bottom-3 left-3 z-10 hidden items-center gap-2 rounded-lg border border-white/10 bg-slate-900/70 px-3 py-2 text-[10px] text-slate-400 backdrop-blur-md sm:flex">
            <MousePointer2 size={13} className="text-indigo-400" />
            Drag to rotate · Scroll to zoom
          </div>
        </>
      ) : loading ? (
        /* Loading state */
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-5 p-5">

          <div className="relative flex h-20 w-20 items-center justify-center">
            <div className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-indigo-500 border-r-cyan-400" />

            <div className="absolute inset-2 animate-pulse rounded-full bg-indigo-500/10" />

            <Cuboid size={32} className="relative z-10 animate-pulse text-indigo-400" />
          </div>

          <div className="space-y-2 text-center">
            <h4 className="text-sm font-semibold text-white sm:text-base">
              Preparing your 3D model
            </h4>

            <p className="max-w-xs text-xs leading-relaxed text-slate-400">
              Your sketch is being transformed into a three-dimensional
              asset. Please wait...
            </p>
          </div>

          <div className="h-1.5 w-40 max-w-full overflow-hidden rounded-full bg-slate-800">
            <div className="h-full w-1/2 animate-pulse rounded-full bg-gradient-to-r from-indigo-500 to-cyan-400" />
          </div>
        </div>
      ) : (
        /* Empty state */
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-5 p-5 sm:p-8">

          <div className="relative flex h-20 w-20 items-center justify-center sm:h-24 sm:w-24">
            <div className="absolute inset-0 rounded-full bg-indigo-500/10 blur-xl" />

            <div className="relative flex h-full w-full items-center justify-center rounded-2xl border border-dashed border-slate-600 bg-slate-900/70">
              <Cuboid className="h-10 w-10 text-slate-500 sm:h-12 sm:w-12" />
            </div>

            <div className="absolute -right-2 -top-2 flex h-8 w-8 items-center justify-center rounded-full border border-indigo-400/20 bg-indigo-500/20">
              <Sparkles size={15} className="text-indigo-400" />
            </div>
          </div>

          <div className="max-w-sm space-y-2 text-center">
            <h4 className="text-base font-semibold text-slate-200 sm:text-lg">
              Your 3D canvas awaits
            </h4>

            <p className="text-xs leading-relaxed text-slate-500 sm:text-sm">
              Upload or draw a 2D sketch, then generate your first 3D
              asset. Your model will appear here.
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-full border border-white/5 bg-slate-900/70 px-3 py-2 text-[10px] text-slate-500">
            <RotateCw size={13} className="text-indigo-400" />
            Interactive 3D preview
          </div>
        </div>
      )}
    </div>

    {/* Footer */}
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">

      <div className="flex items-center gap-2 text-xs text-slate-500">
        <Sparkles size={14} className="text-indigo-400" />
        <span>Powered by AI 3D reconstruction</span>
      </div>

      {src && !loading && (
        <p className="text-[10px] text-slate-500">
          GLB · Interactive preview
        </p>
      )}
    </div>
  </div>
</section>)
}