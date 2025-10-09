// Prefer using Vite dev proxy in development to avoid CORS.
// If VITE_BACKEND_URL is set, we'll call that directly; otherwise use relative path (proxy).
const BASE_URL = (import.meta?.env?.VITE_BACKEND_URL || '').trim();

export async function postJSON(path, body, options = {}) {
  const url = `${BASE_URL}${path}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    },
    body: JSON.stringify(body),
    // Avoid credentials by default to reduce CORS complexity; enable via options if needed
    ...(options.credentials ? { credentials: options.credentials } : {})
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(text || `Request failed: ${res.status}`);
  }
  return res.json();
}

export function getBaseUrl() {
  return BASE_URL;
}

export async function putJSON(path, body, options = {}) {
  const url = `${BASE_URL}${path}`;
  const res = await fetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    },
    body: JSON.stringify(body)
  });
  if (!res.ok) throw new Error(await res.text() || `Request failed: ${res.status}`);
  return res.json();
}

