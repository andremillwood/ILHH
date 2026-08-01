export function normalizeImageUrl(url?: string | null) {
  if (!url) return "";

  if (/^(https?:|data:|blob:)/i.test(url)) {
    return url;
  }

  return encodeURI(url.startsWith("/") ? url : `/${url}`);
}
