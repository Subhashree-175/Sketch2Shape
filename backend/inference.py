"""Sketch -> Image -> 3D inference orchestration.

Two execution modes:
  1) COLAB (default for the hackathon demo): POST the sketch to a Colab-hosted
     FastAPI server exposed via ngrok/cloudflared. See colab/serve_model.py.
  2) LOCAL GPU (optional): load ControlNet + InstantMesh locally via diffusers.
     Requires a GPU and large model weights; uncomment torch/diffusers in
     requirements.txt.

For a no-GPU demo, inference falls back to shipping a sample .glb so the UI
is fully demonstrable. Replace _local_stub / the TODO block with real calls.
"""

from __future__ import annotations

import base64
import io
import os
from dataclasses import dataclass
from typing import Optional

import requests
from PIL import Image

from .preprocess import preprocess_for_controlnet
from .export import validate_mesh


@dataclass
class GenerationResult:
    glb_path: Optional[str]
    mesh_info: Optional[dict]
    prompt_used: str
    note: str


class ColabClient:
    """HTTP client for the Colab-hosted model server."""

    def __init__(self, base_url: str, timeout: int = 300):
        self.base_url = base_url.rstrip("/")
        self.timeout = timeout

    def health(self) -> bool:
        try:
            r = requests.get(f"{self.base_url}/health", timeout=10)
            return r.status_code == 200
        except Exception:
            return False

    def generate(self, sketch_bytes: bytes, prompt: str) -> dict:
        files = {"image": ("sketch.png", sketch_bytes, "image/png")}
        data = {"prompt": prompt}
        r = requests.post(
            f"{self.base_url}/generate",
            files=files,
            data=data,
            timeout=self.timeout,
        )
        r.raise_for_status()
        return r.json()


def _b64_to_file(b64_str: str, out_path: str) -> str:
    data = base64.b64decode(b64_str)
    os.makedirs(os.path.dirname(out_path) or ".", exist_ok=True)
    with open(out_path, "wb") as f:
        f.write(data)
    return out_path


def _local_stub(out_dir: str, prompt: str) -> GenerationResult:
    """Fallback when no Colab URL and no local GPU weights are available.

    Ships the bundled sample mesh so the UI is demo-able without a GPU.
    """
    sample = os.path.join(os.path.dirname(__file__), "..", "samples", "output_sample.glb")
    sample = os.path.abspath(sample)
    note = (
        "No Colab URL configured and no local GPU weights found. "
        "Returning bundled sample mesh. Configure COLAB_API_URL or add local "
        "ControlNet + InstantMesh weights to generate from your sketch."
    )
    glb_path = None
    mesh_info = None
    if os.path.exists(sample):
        glb_path = os.path.join(out_dir, "output_sample.glb")
        with open(sample, "rb") as fsrc, open(glb_path, "wb") as fdst:
            fdst.write(fsrc.read())
        mi = validate_mesh(glb_path)
        mesh_info = {
            "path": mi.path,
            "format": mi.format,
            "vertices": mi.vertices,
            "faces": mi.faces,
            "valid": mi.valid,
            "has_texture": mi.has_texture,
            "note": mi.note,
        }
    return GenerationResult(
        glb_path=glb_path,
        mesh_info=mesh_info,
        prompt_used=prompt or "",
        note=note,
    )


def run_pipeline(
    sketch_bytes: bytes,
    prompt: str,
    out_dir: str = "outputs",
    colab_url: Optional[str] = None,
    use_colab: bool = True,
) -> GenerationResult:
    """End-to-end: preprocess -> generate image -> reconstruct 3D -> export .glb.

    Parameters
    ----------
    sketch_bytes : raw bytes of the user sketch (PNG/JPG).
    prompt : optional text describing materials / style / object type.
    out_dir : folder to write the exported .glb into.
    colab_url : ngrok/cloudflared HTTPS URL of the Colab model server.
    use_colab : if True and colab_url is set, call Colab; otherwise local stub.
    """
    os.makedirs(out_dir, exist_ok=True)

    # --- Step 1: sketch conditioning (always local, fast) ---
    try:
        _rgb_sketch, _canny = preprocess_for_controlnet(sketch_bytes, max_side=512)
    except Exception as exc:  # pragma: no cover
        return GenerationResult(
            glb_path=None,
            mesh_info=None,
            prompt_used=prompt or "",
            note=f"Preprocessing failed: {exc}",
        )

    # --- Step 2 & 3: sketch-guided image gen + image-to-3D ---
    if use_colab and colab_url:
        try:
            client = ColabClient(colab_url)
            if not client.health():
                return GenerationResult(
                    glb_path=None,
                    mesh_info=None,
                    prompt_used=prompt or "",
                    note="Colab server not reachable at the provided URL.",
                )
            result = client.generate(sketch_bytes, prompt)
            glb_b64 = result.get("glb_base64")
            glb_path = os.path.join(out_dir, "generated.glb")
            if glb_b64:
                _b64_to_file(glb_b64, glb_path)
            else:
                glb_path = None
            mesh_info = None
            if glb_path and os.path.exists(glb_path):
                mi = validate_mesh(glb_path)
                mesh_info = {
                    "path": mi.path,
                    "format": mi.format,
                    "vertices": mi.vertices,
                    "faces": mi.faces,
                    "valid": mi.valid,
                    "has_texture": mi.has_texture,
                    "note": mi.note,
                }
            return GenerationResult(
                glb_path=glb_path,
                mesh_info=mesh_info,
                prompt_used=prompt or "",
                note=result.get("note", "Generated via Colab model server."),
            )
        except Exception as exc:  # pragma: no cover - network/model dependent
            return GenerationResult(
                glb_path=None,
                mesh_info=None,
                prompt_used=prompt or "",
                note=f"Colab generation failed: {exc}. Falling back to stub.",
            )

    # --- LOCAL GPU path (placeholder) -------------------------------------
    # TODO: instantiate ControlNet (sd-v1-5 + canny) + InstantMesh here.
    # Example structure:
    #   from diffusers import ControlNetModel, StableDiffusionControlNetPipeline
    #   controlnet = ControlNetModel.from_pretrained("lllyasviel/sd-controlnet-canny", ...)
    #   pipe = StableDiffusionControlNetPipeline.from_pretrained(...)
    #   gen_image = pipe(prompt=prompt, image=canny, ...).images[0]
    #   mesh = instantmesh_infer(gen_image)  # -> .glb bytes
    # ----------------------------------------------------------------------
    return _local_stub(out_dir, prompt)

