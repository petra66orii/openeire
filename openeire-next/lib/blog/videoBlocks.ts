import { sanitizeRichHtml } from "@/lib/sanitizeRichHtml";
import type { PortfolioVideo } from "@/lib/realEstatePortfolio";

export type BlogContentBlock =
  | { kind: "html"; html: string }
  | { kind: "video"; video: PortfolioVideo };

// An editor-authored linked poster remains a normal link unless explicitly
// marked with one of these titles. Raw iframes remain forbidden in rich HTML.
export function getBlogContentBlocks(content: string): BlogContentBlock[] {
  const html = sanitizeRichHtml(content);
  const pattern = /<p>\s*<a\b([^>]*)>\s*<img\b([^>]*)\/?>([^<]*)<\/a>\s*<\/p>/g;
  const blocks: BlogContentBlock[] = [];
  let cursor = 0;
  for (const match of html.matchAll(pattern)) {
    const attribute = (attrs: string, name: string) =>
      new RegExp(`(?:^|\\s)${name}="([^"]*)"`).exec(attrs)?.[1] ?? "";
    const marker = attribute(match[1], "title");
    if (!/^OpenÉire video: (landscape|portrait)$/.test(marker)) continue;
    let url: URL;
    try { url = new URL(attribute(match[1], "href")); } catch { continue; }
    if (url.protocol !== "https:" || url.username || url.password || url.port) continue;
    if (!["www.youtube.com", "youtube.com", "youtu.be"].includes(url.hostname)) continue;
    const id = url.hostname === "youtu.be"
      ? url.pathname.slice(1)
      : url.pathname === "/watch"
        ? url.searchParams.get("v") ?? ""
        : /^\/shorts\/([A-Za-z0-9_-]{11})$/.exec(url.pathname)?.[1] ?? "";
    if (!/^[A-Za-z0-9_-]{11}$/.test(id)) continue;
    const src = attribute(match[2], "src");
    if (!src) continue;
    // Poster URLs are approved by the backend image-host sanitizer. Keep the
    // local renderer restricted to the existing media origins as well.
    try {
      const poster = new URL(src, "https://openeire.ie");
      const localPath = src.startsWith("/") && !src.startsWith("//");
      const approvedRemote = ["media.openeire.ie", "api.openeire.ie"].includes(poster.hostname);
      if (poster.protocol !== "https:" || poster.username || poster.password || poster.port || (!localPath && !approvedRemote)) continue;
    } catch { continue; }
    const decode = (text: string) => text.replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#(?:39|x27);/g, "'");
    const index = match.index ?? 0;
    if (index > cursor) blocks.push({ kind: "html", html: html.slice(cursor, index) });
    const portrait = marker.endsWith("portrait");
    blocks.push({ kind: "video", video: {
      youtubeVideoId: id,
      title: decode(match[3].trim()) || "Property video",
      description: "",
      width: portrait ? 9 : 16,
      height: portrait ? 16 : 9,
      poster: {
        src: decode(src), alt: decode(attribute(match[2], "alt")),
        width: Number(attribute(match[2], "width")) || 1600,
        height: Number(attribute(match[2], "height")) || 900,
      },
    } });
    cursor = index + match[0].length;
  }
  if (cursor < html.length) blocks.push({ kind: "html", html: html.slice(cursor) });
  return blocks;
}
