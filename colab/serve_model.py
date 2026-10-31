"""Colab-side model server for Sketch2Shape.

Run this file INSIDE Google Colab (GPU runtime). It starts a FastAPI server
and exposes it via ngrok so the local Streamlit app can call it:

    python colab/serve_model.py

Endpoints:
  GET  /health
  POST /generate  (multipart: image file + optional prompt form field)
Returns JSON: { glb_base64, note, mesh_info }

TODO: load real weights here:
  - ControlNet: lllyasviel/sd-controlnet-canny (or scribble)
  - SD base: runwayml/stable-diffusion-v1-5
  - InstantMesh: TencentARC/InstantMesh
"""

from __future__ import annotations

import base64
import io
import os
from typing import Optional

from fastapi import FastAPI, File, Form, UploadFile, HTTPException
from fastapi.responses import JSONResponse
import uvicorn

try:
    from pyngrok import ngrok
    NGROK_AVAILABLE = True
except Exception:  # pragma: no cover
    NGROK_AVAILABLE = False

app = FastAPI(title="Sketch2Shape Colab Model Server")

# ---------------------------------------------------------------------------
# Model placeholders — load real models in the TODO block below.
# ---------------------------------------------------------------------------
CONTROLNET_MODEL = None
SD_PIPE = None
INSTANTMESH = None
DEVICE = "cuda"


def _load_models() -> None:
    """Load ControlNet + Stable Diffusion + InstantMesh (GPU)."""
    global CONTROLNET_MODEL, SD_PIPE, INSTANTMESH
    # Example (uncomment when weights are available):
    # import torch
    # from diffusers import ControlNetModel, StableDiffusionControlNetPipeline
    # CONTROLNET_MODEL = ControlNetModel.from_pretrained(
    #     "lllyasviel/sd-controlnet-canny", torch_dtype=torch.float16
    # ).to(DEVICE)
    # SD_PIPE = StableDiffusionControlNetPipeline.from_pretrained(
    #     "runwayml/stable-diffusion-v1-5",
    #     controlnet=CONTROLNET_MODEL,
    #     torch_dtype=torch.float16,
    # ).to(DEVICE)
    # SD_PIPE.enable_model_cpu_offload()
    # -----------------------------------------------------------------------
    # InstantMesh load (see https://github.com/TencentARC/InstantMesh):
    # INSTANTMESH = ...
    # -----------------------------------------------------------------------


@app.on_event("startup")
def _startup() -> None:
    _load_models()


@app.get("/health")
def health() -> dict:
    return {"status": "ok", "models_loaded": CONTROLNET_MODEL is not None}


@app.post("/generate")
async def generate(
    image: UploadFile = File(...),
    prompt: Optional[str] = Form(default=""),
) -> JSONResponse:
    """Receive a sketch, run sketch->image->3D, return .glb as base64."""
    try:
        image_bytes = await image.read()
    except Exception as exc:
        raise HTTPException(status_code=400, detail=f"Cannot read image: {exc}")

    # TODO: replace this stub with the real pipeline:
    #   rgb, canny = preprocess(image_bytes)
    #   gen_img = SD_PIPE(prompt=prompt, image=canny, ...).images[0]
    #   glb_bytes = INSTANTMESH.reconstruct(gen_img)  # .glb bytes
    #   return JSONResponse({"glb_base64": base64.b64encode(glb_bytes).decode(), ...})

    # Fallback for demo: return a tiny valid placeholder note.
    # In practice, attach a real .glb produced by InstantMesh.
    return JSONResponse(
        {
            "glb_base64": "",
            "note": "Colab server reached but model weights are not loaded yet. "
            "Load ControlNet + InstantMesh in _load_models() and run inference here.",
            "mesh_info": None,
        }
    )


def launch(share: bool = True, port: int = 8000) -> str:
    """Start uvicorn and optionally open an ngrok tunnel; return public URL."""
    # Start uvicorn in a thread so ngrok can connect
    import threading
    import time

    server = uvicorn.Server(
        uvicorn.Config(app, host="0.0.0.0", port=port, log_level="warning")
    )
    thread = threading.Thread(target=server.run, daemon=True)
    thread.start()
    time.sleep(2)  # let uvicorn bind

    public_url = f"http://localhost:{port}"
    if share and NGROK_AVAILABLE:
        try:
            tunnel = ngrok.connect(port)
            public_url = tunnel.public_url
            print(f"\n>>> ngrok tunnel: {public_url}\n")
        except Exception as exc:  # pragma: no cover - network dependent
            print(f"ngrok failed ({exc}); using localhost URL")
    elif share and not NGROK_AVAILABLE:
        print("pyngrok not installed; using localhost URL")

    return public_url


if __name__ == "__main__":
    url = launch(share=True, port=8000)
    print(f"Server public URL: {url}")
    print("Keep this Colab cell/runtime running while the demo uses it.")
