"""Mesh validation and export helpers for Sketch2Shape."""

from __future__ import annotations

import os
from dataclasses import dataclass
from typing import Optional
import trimesh


@dataclass
class MeshInfo:
    path: str
    format: str  # "glb" or "obj"
    vertices: int
    faces: int
    valid: bool
    has_texture: bool
    note: str = ""


def validate_mesh(path: str) -> MeshInfo:
    """Check that an exported mesh file contains usable geometry."""
    ext = os.path.splitext(path)[1].lower().lstrip(".")
    note = ""
    try:
        mesh = trimesh.load(path, force="mesh")
        vertices = len(mesh.vertices)
        faces = len(mesh.faces)
        has_texture = bool(getattr(mesh.visual, "material", None)) and getattr(
            mesh.visual.material, "image", None
        ) is not None
        valid = vertices > 0 and faces > 0
        if not valid:
            note = "Mesh loaded but has no vertices/faces."
    except Exception as exc:  # pragma: no cover - depends on file
        vertices, faces = 0, 0
        has_texture = False
        valid = False
        note = f"Failed to load mesh: {exc}"
    return MeshInfo(
        path=path,
        format=ext,
        vertices=vertices,
        faces=faces,
        valid=valid,
        has_texture=has_texture,
        note=note,
    )


def export_copy(src_path: str, dst_dir: str, dst_name: str) -> str:
    """Copy a generated mesh into dst_dir with a clean name; returns dst path."""
    os.makedirs(dst_dir, exist_ok=True)
    ext = os.path.splitext(src_path)[1].lower()
    dst = os.path.join(dst_dir, dst_name + ext)
    with open(src_path, "rb") as fsrc, open(dst, "wb") as fdst:
        fdst.write(fsrc.read())
    return dst
