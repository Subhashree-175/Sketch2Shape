import { useRef, useState, useCallback, useEffect } from "react";
import { Brush, Eraser, RefreshCw, Palette, Pencil } from "lucide-react";

export default function SketchCanvas({ onImageReady }) {
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const isDrawingRef = useRef(false);

  const [strokeWidth, setStrokeWidth] = useState(6);
  const [strokeColor, setStrokeColor] = useState("#111827");
  const [mode, setMode] = useState("draw");

  const getDpr = () => window.devicePixelRatio || 1;

  const emitImage = useCallback(() => {
    const canvas = canvasRef.current;
    if (canvas && onImageReady) {
      onImageReady(canvas.toDataURL("image/png"));
    }
  }, [onImageReady]);

  const clearCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;

    if (!canvas || !ctx) return;

    const rect = canvas.getBoundingClientRect();
    const dpr = getDpr();

    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.restore();

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    emitImage();
  }, [emitImage]);

  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    if (!rect.width || !rect.height) return;

    const dpr = getDpr();

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;

    const ctx = canvas.getContext("2d");
    ctxRef.current = ctx;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, rect.width, rect.height);

    emitImage();
  }, [emitImage]);

  useEffect(() => {
    resizeCanvas();

    const observer = new ResizeObserver(() => {
      resizeCanvas();
    });

    if (canvasRef.current) {
      observer.observe(canvasRef.current);
    }

    return () => observer.disconnect();
  }, [resizeCanvas]);

  const start = useCallback((e) => {
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;

    if (!canvas || !ctx) return;

    e.preventDefault();
    canvas.setPointerCapture(e.pointerId);

    isDrawingRef.current = true;

    const rect = canvas.getBoundingClientRect();

    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
  }, []);

  const draw = useCallback(
    (e) => {
      if (!isDrawingRef.current) return;

      const canvas = canvasRef.current;
      const ctx = ctxRef.current;

      if (!canvas || !ctx) return;

      e.preventDefault();

      const rect = canvas.getBoundingClientRect();

      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      ctx.lineTo(x, y);
      ctx.strokeStyle = mode === "erase" ? "#ffffff" : strokeColor;
      ctx.lineWidth = strokeWidth;
      ctx.stroke();
    },
    [mode, strokeColor, strokeWidth]
  );

  const stop = useCallback(
    (e) => {
      if (!isDrawingRef.current) return;

      isDrawingRef.current = false;

      const ctx = ctxRef.current;
      if (ctx) ctx.closePath();

      emitImage();
    },
    [emitImage]
  );

  return (
    <div className="w-full rounded-3xl border border-white/10 bg-slate-900/80 p-4 shadow-2xl shadow-black/20 backdrop-blur-xl sm:p-6">

      {/* Header */}
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <div className="rounded-xl bg-indigo-500/15 p-2 text-indigo-400">
              <Pencil size={19} />
            </div>

            <h2 className="text-lg font-bold text-white sm:text-xl">
              Sketch Workspace
            </h2>
          </div>

          <p className="mt-1 text-xs text-slate-400 sm:text-sm">
            Draw your idea and turn it into a 3D model.
          </p>
        </div>

        <span className="w-fit rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1.5 text-xs font-medium text-emerald-400">
          ● Drawing Canvas
        </span>
      </div>

      {/* Toolbar */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/5 bg-slate-950/60 p-3">

        {/* Brush Size */}
        <div className="flex min-w-[150px] flex-1 items-center gap-3 sm:flex-none">
          <Brush size={17} className="shrink-0 text-slate-400" />

          <input
            type="range"
            min={1}
            max={40}
            value={strokeWidth}
            onChange={(e) => setStrokeWidth(Number(e.target.value))}
            className="w-full cursor-pointer accent-indigo-500 sm:w-24"
            aria-label="Brush size"
          />

          <span className="min-w-[35px] text-xs font-medium text-slate-300">
            {strokeWidth}px
          </span>
        </div>

        {/* Color Picker */}
        <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-slate-800 px-3 py-2">
          <Palette size={16} className="text-slate-400" />

          <span className="hidden text-xs text-slate-300 sm:block">
            Color
          </span>

          <input
            type="color"
            value={strokeColor}
            onChange={(e) => setStrokeColor(e.target.value)}
            className="h-6 w-7 cursor-pointer rounded border-0 bg-transparent"
            aria-label="Choose brush color"
          />
        </div>

        {/* Drawing Tools */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setMode("draw")}
            className={`flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold transition-all sm:text-sm ${
              mode === "draw"
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20"
                : "bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white"
            }`}
          >
            <Brush size={16} />
            <span>Draw</span>
          </button>

          <button
            type="button"
            onClick={() => setMode("erase")}
            className={`flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold transition-all sm:text-sm ${
              mode === "erase"
                ? "bg-rose-600 text-white shadow-lg shadow-rose-600/20"
                : "bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white"
            }`}
          >
            <Eraser size={16} />
            <span>Erase</span>
          </button>

          <button
            type="button"
            onClick={clearCanvas}
            className="rounded-xl bg-slate-800 p-2.5 text-slate-400 transition hover:bg-rose-500/15 hover:text-rose-400"
            title="Clear canvas"
            aria-label="Clear canvas"
          >
            <RefreshCw size={17} />
          </button>
        </div>
      </div>

      {/* Canvas */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-700 bg-white shadow-inner">
        <canvas
          ref={canvasRef}
          className="block h-[280px] w-full cursor-crosshair touch-none sm:h-[380px] lg:h-[450px]"
          onPointerDown={start}
          onPointerMove={draw}
          onPointerUp={stop}
          onPointerCancel={stop}
          onLostPointerCapture={stop}
        />

        {/* Canvas Label */}
        <div className="pointer-events-none absolute bottom-3 right-3 rounded-lg border border-slate-200 bg-white/90 px-3 py-1.5 text-[10px] font-medium text-slate-500 shadow-sm">
          DRAW YOUR SKETCH HERE
        </div>
      </div>

      {/* Footer */}
      <div className="mt-4 flex flex-col gap-2 text-center sm:flex-row sm:items-center sm:justify-between sm:text-left">
        <p className="text-xs text-slate-400">
          Use your mouse, stylus, or finger to draw.
        </p>

        <p className="text-xs text-indigo-400">
          ✦ Keep your sketch clear for better 3D results
        </p>
      </div>
    </div>
  );
}