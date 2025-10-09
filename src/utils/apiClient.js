const DEFAULT_BASE_URL = 'https://n4m5blv5-3600.inc1.devtunnels.ms';
const BASE_URL = (import.meta?.env?.VITE_BACKEND_URL || '').trim() || DEFAULT_BASE_URL;

export async function postJSON(path, body, options = {}) {
  const url = `${BASE_URL}${path}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    },
    body: JSON.stringify(body),
    credentials: 'include'
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


