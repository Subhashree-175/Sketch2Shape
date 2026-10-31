const API_BASE = "/api";

export async function preprocessImage(file) {
  const form = new FormData();
  form.append("image", file);
  const res = await fetch(`${API_BASE}/preprocess`, { method: "POST", body: form });
  if (!res.ok) throw new Error("Preprocessing failed");
  return res.json();
}

export async function generate3d({ file, prompt, useColab, colabUrl }) {
  const form = new FormData();
  form.append("image", file);
  form.append("prompt", prompt || "");
  form.append("use_colab", useColab ? "true" : "false");
  form.append("colab_url", colabUrl || "");
  const res = await fetch(`${API_BASE}/generate`, { method: "POST", body: form });
  return res.json();
}

export function downloadUrl(runId, filename) {
  return `${API_BASE.replace("/api", "")}/files/${runId}/${filename}`;
}
