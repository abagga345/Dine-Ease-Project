// Centralized API base-URL + small fetch helpers.
// Replaces the `VITE_API_URL || VITE_DOCKER_URL || '<hardcoded>'` line that was
// duplicated across ~40 call sites. Edit the fallback in one place only.

const FALLBACK_BASE = "https://dine-ease.coderspro.xyz/";

/** Resolved backend base URL, always ending in a single trailing slash. */
export function apiBase(): string {
  const raw =
    (import.meta.env.VITE_API_URL as string | undefined) ||
    (import.meta.env.VITE_DOCKER_URL as string | undefined) ||
    FALLBACK_BASE;
  return raw.endsWith("/") ? raw : raw + "/";
}

/** Build a full API URL, e.g. apiUrl("user/viewmenu?storeId=1"). */
export function apiUrl(path: string): string {
  const clean = path.startsWith("/") ? path.slice(1) : path;
  return `${apiBase()}api/v1/${clean}`;
}

/**
 * Read a numeric env var safely. Returns `fallback` (default 0) when the var is
 * unset or not a number — prevents `NaN` from poisoning checkout totals.
 */
export function numEnv(value: unknown, fallback = 0): number {
  const n = parseInt(value as string, 10);
  return Number.isNaN(n) ? fallback : n;
}
