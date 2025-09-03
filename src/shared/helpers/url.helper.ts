export const isHttpsPublicUrl = (u: string) => {
  try {
    const url = new URL(u);
    if (url.protocol !== "https:") return false;
    const h = url.hostname.toLowerCase();

    if (["localhost", "127.0.0.1", "::1"].includes(h)) return false;
    if (/^10\.\d+\.\d+\.\d+$/.test(h)) return false;
    if (/^192\.168\.\d+\.\d+$/.test(h)) return false;
    if (/^172\.(1[6-9]|2\d|3[0-1])\.\d+\.\d+$/.test(h)) return false;
    return true;
  } catch {
    return false;
  }
};
