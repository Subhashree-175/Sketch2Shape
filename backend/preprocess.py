"""Image preprocessing for Sketch2Shape.

Operations:
  - load image from bytes / file
  - resize (preserve aspect, cap max side)
  - contrast enhancement + denoise
  - background removal (rembg)
  - Canny edge map for ControlNet conditioning
"""

from __future__ import annotations

from typing import Tuple
import cv2
import numpy as np
from PIL import Image
import io

try:
    from rembg import remove as _remove_bg
    REMBG_AVAILABLE = True
except Exception:  # pragma: no cover - rembg optional at import time
    REMBG_AVAILABLE = False


def load_image(image_bytes: bytes) -> np.ndarray:
    """Load image bytes into a BGR numpy array (OpenCV convention)."""
    nparr = np.frombuffer(image_bytes, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    if img is None:
        raise ValueError("Could not decode image bytes.")
    return img


def pil_from_bgr(img_bgr: np.ndarray) -> Image.Image:
    """Convert BGR numpy array to RGB PIL Image."""
    rgb = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2RGB)
    return Image.fromarray(rgb)


def bgr_from_pil(pil_img: Image.Image) -> np.ndarray:
    """Convert RGB PIL Image to BGR numpy array."""
    return cv2.cvtColor(np.array(pil_img.convert("RGB")), cv2.COLOR_RGB2BGR)


def resize_to(img_bgr: np.ndarray, max_side: int = 768) -> np.ndarray:
    """Resize so the longest side is max_side, preserving aspect ratio."""
    h, w = img_bgr.shape[:2]
    scale = max_side / max(h, w)
    if scale >= 1.0:
        return img_bgr
    new_w, new_h = int(w * scale), int(h * scale)
    return cv2.resize(img_bgr, (new_w, new_h), interpolation=cv2.INTER_AREA)


def enhance(img_bgr: np.ndarray) -> np.ndarray:
    """Mild contrast + denoise to clean up rough sketches."""
    # Denoise
    denoised = cv2.fastNlMeansDenoisingColored(img_bgr, None, 10, 10, 7, 21)
    # Contrast via CLAHE on L channel (LAB space)
    lab = cv2.cvtColor(denoised, cv2.COLOR_BGR2LAB)
    l, a, b = cv2.split(lab)
    clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8))
    l = clahe.apply(l)
    lab = cv2.merge((l, a, b))
    return cv2.cvtColor(lab, cv2.COLOR_LAB2BGR)


def remove_background(img_bgr: np.ndarray) -> np.ndarray:
    """Return RGB image on white background (background removed via rembg)."""
    if not REMBG_AVAILABLE:
        # Fallback: just return RGB (no BG removal)
        return cv2.cvtColor(img_bgr, cv2.COLOR_BGR2RGB)
    rgb = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2RGB)
    pil = Image.fromarray(rgb)
    buf = io.BytesIO()
    pil.save(buf, format="PNG")
    result_bytes = _remove_bg(buf.getvalue())  # returns PNG bytes with alpha
    result = Image.open(io.BytesIO(result_bytes)).convert("RGBA")
    # Composite alpha onto white background
    white = Image.new("RGBA", result.size, (255, 255, 255, 255))
    white.alpha_composite(result)
    return cv2.cvtColor(np.array(white.convert("RGB")), cv2.COLOR_RGB2BGR)


def canny_edge(img_bgr: np.ndarray, low: int = 50, high: int = 150) -> np.ndarray:
    """Produce a ControlNet-ready Canny edge map (black bg, white edges)."""
    gray = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2GRAY)
    # blur slightly to reduce noise before edge detection
    blurred = cv2.GaussianBlur(gray, (5, 5), 0)
    edges = cv2.Canny(blurred, low, high)
    # Invert so sketch lines are white on black (ControlNet canny convention)
    edges = 255 - edges
    edges = cv2.cvtColor(edges, cv2.COLOR_GRAY2BGR)
    return edges


def preprocess_for_controlnet(image_bytes: bytes, max_side: int = 512) -> Tuple[np.ndarray, np.ndarray]:
    """Full conditioning pipeline.

    Returns:
        (rgb_sketch, canny_edge_map) both as BGR numpy arrays resized to max_side.
    """
    img = load_image(image_bytes)
    img = resize_to(img, max_side=max_side)
    img = enhance(img)
    img = remove_background(img)
    edges = canny_edge(img)
    return img, edges
