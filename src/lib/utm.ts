export const UTM_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
  "utm_id",
] as const;

export type UtmKey = (typeof UTM_KEYS)[number];
export type UtmMap = Partial<Record<UtmKey, string>>;

const STORAGE_KEY = "grape.utms";

function isUtmKey(key: string): key is UtmKey {
  return (UTM_KEYS as readonly string[]).includes(key);
}

export function readUtmsFromSearch(search: string): UtmMap {
  const params = new URLSearchParams(
    search.startsWith("?") ? search.slice(1) : search,
  );
  const utms: UtmMap = {};

  for (const key of UTM_KEYS) {
    const value = params.get(key)?.trim();
    if (value) utms[key] = value;
  }

  return utms;
}

function readStoredUtms(): UtmMap {
  if (typeof window === "undefined") return {};

  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as Record<string, unknown>;
    const utms: UtmMap = {};
    for (const [key, value] of Object.entries(parsed)) {
      if (isUtmKey(key) && typeof value === "string" && value.trim()) {
        utms[key] = value.trim();
      }
    }
    return utms;
  } catch {
    return {};
  }
}

export function persistUtms(utms: UtmMap) {
  if (typeof window === "undefined") return;
  if (Object.keys(utms).length === 0) return;
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(utms));
}

/** URL atual ganha da sessão; grava o merge para a próxima página. */
export function readUtmsFromWindow(): UtmMap {
  if (typeof window === "undefined") return {};
  const merged = { ...readStoredUtms(), ...readUtmsFromSearch(window.location.search) };
  persistUtms(merged);
  return merged;
}

export function withUtms(path: string): string {
  const utms = readUtmsFromWindow();
  const params = new URLSearchParams();
  for (const key of UTM_KEYS) {
    const value = utms[key];
    if (value) params.set(key, value);
  }
  const query = params.toString();
  return query ? `${path}?${query}` : path;
}
