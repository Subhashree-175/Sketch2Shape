"""Sketch2Shape AI — FastAPI backend.

Endpoints:
  GET    /api/health
  POST   /api/preprocess   (multipart: image)  -> processed image + canny edge map (base64)
  POST   /api/generate     (multipart: image + optional prompt, use_colab, colab_url) -> .glb info
  GET    /api/download/{filename} -> serve generated .glb
"""

from __future__ import annotations

import os
import uuid
from typing import Optional

from fastapi import FastAPI, File, Form, UploadFile, HTTPException
from fastapi.responses import FileResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware

from .inference import run_pipeline, GenerationResult
from .export import validate_mesh

app = FastAPI(title="Sketch2Shape AI Backend")

# CORS for React dev server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

OUTPUT_DIR = os.path.join(os.getcwd(), "outputs")
os.makedirs(OUTPUT_DIR, exist_ok=True)

# Serve generated files for preview/download
app.mount("/files", StaticFiles(directory=OUTPUT_DIR), name="files")


@app.get("/api/health")
def health() -> dict:
    return {"status": "ok"}


@app.post("/api/preprocess")
async def preprocess(image: UploadFile = File(...)) -> JSONResponse:
    """Return conditioned sketch (RGB) + Canny edge map as base64 data URIs."""
    try:
        image_bytes = await image.read()
    except Exception as exc:
        raise HTTPException(status_code=400, detail=f"Cannot read image: {exc}")

    from .preprocess import (
        load_image, resize_to, enhance, remove_background, canny_edge,
        pil_from_bgr,
    )
    import io
    import base64
    import numpy as np

    img = load_image(image_bytes)
    img = resize_to(img, max_side=512)
    img = enhance(img)
    img = remove_background(img)
    edges = canny_edge(img)

    def bgr_to_data_uri(arr: np.ndarray) -> str:
        import cv2
        rgb = cv2.cvtColor(arr, cv2.COLOR_BGR2RGB)
        pil = __import__("PIL.Image", fromlist=["Image"]).Image.fromarray(rgb)
        buf = io.BytesIO()
        pil.save(buf, format="PNG")
        b64 = base64.b64encode(buf.getvalue()).decode("utf-8")
        return f"data:image/png;base64,{b64}"

    return JSONResponse({
        "sketch_uri": bgr_to_data_uri(img),
        "canny_uri": bgr_to_data_uri(edges),
        "size": {"width": img.shape[1], "height": img.shape[0]},
    })


@app.post("/api/generate")
async def generate(
    image: UploadFile = File(...),
    prompt: Optional[str] = Form(default=""),
    use_colab: Optional[str] = Form(default="false"),
    colab_url: Optional[str] = Form(default=""),
) -> JSONResponse:
    """Run sketch -> image -> 3D pipeline and return .glb download info."""
    try:
        image_bytes = await image.read()
    except Exception as exc:
        raise HTTPException(status_code=400, detail=f"Cannot read image: {exc}")

    run_id = uuid.uuid4().hex
    run_out_dir = os.path.join(OUTPUT_DIR, run_id)
    os.makedirs(run_out_dir, exist_ok=True)

    use_colab_bool = use_colab.lower() == "true"
    colab_url_clean = colab_url.strip() or None

    result: GenerationResult = run_pipeline(
        sketch_bytes=image_bytes,
        prompt=prompt or "",
        out_dir=run_out_dir,
        colab_url=colab_url_clean,
        use_colab=use_colab_bool,
    )

    if not result.glb_path or not os.path.exists(result.glb_path):
        return JSONResponse({
            "ok": False,
            "run_id": run_id,
            "note": result.note or "No 3D file produced.",
            "mesh_info": result.mesh_info,
        }, status_code=200)

    mi = result.mesh_info or {}
    filename = os.path.basename(result.glb_path)
    return JSONResponse({
        "ok": True,
        "run_id": run_id,
        "filename": filename,
        "download_url": f"/files/{run_id}/{filename}",
        "preview_url": f"/files/{run_id}/{filename}",
        "note": result.note,
        "prompt_used": result.prompt_used,
        "mesh_info": {
            "vertices": mi.get("vertices"),
            "faces": mi.get("faces"),
            "format": mi.get("format"),
            "valid": mi.get("valid"),
            "has_texture": mi.get("has_texture"),
        },
    })


@app.get("/api/download/{run_id}/{filename}")
def download(run_id: str, filename: str):
    path = os.path.join(OUTPUT_DIR, run_id, filename)
    if not os.path.exists(path):
        raise HTTPException(status_code=404, detail="File not found")
    return FileResponse(path, media_type="model/gltf-binary", filename=filename)


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.main:app", host="0.0.0.0", port=8000, reload=True)
