const BASE = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/+$/, "");

/**
 * Converts a stored relative path (e.g. "uploads/room-type-photos/x/y.jpg")
 * to a full URL served by the backend static file server.
 * Passes through blob:, data:, http:, https: URLs unchanged.
 */
export function assetUrl(path) {
  if (!path) return "";
  const p = String(path).replaceAll("\\", "/");
  if (
    p.startsWith("http://") ||
    p.startsWith("https://") ||
    p.startsWith("blob:") ||
    p.startsWith("data:")
  ) {
    return p;
  }
  return `${BASE}/${p.replace(/^\/+/, "")}`;
}
