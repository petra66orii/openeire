import { describe, expect, it } from "vitest";
import { getBlogContentBlocks } from "@/lib/blog/videoBlocks";

const marker = (href: string, orientation = "portrait", src = "https://media.openeire.ie/poster.webp") =>
  `<p><a href="${href}" title="OpenÉire video: ${orientation}"><img src="${src}" alt="Property film" width="1600" height="900">Watch film</a></p>`;

describe("editor-authored blog video blocks", () => {
  it("keeps article order and converts opted-in Shorts and watch links", () => {
    const blocks = getBlogContentBlocks(`<h2>First</h2>${marker("https://youtube.com/shorts/VK9lByiDKQQ")}<p>Between</p>${marker("https://www.youtube.com/watch?v=JAQxl0l3Spo", "landscape")}<p>Last</p>`);
    expect(blocks.map(b => b.kind)).toEqual(["html", "video", "html", "video", "html"]);
    expect(blocks[1]).toMatchObject({ video: { youtubeVideoId: "VK9lByiDKQQ", width: 9, height: 16 } });
    expect(blocks[3]).toMatchObject({ video: { youtubeVideoId: "JAQxl0l3Spo", width: 16, height: 9 } });
  });
  it("leaves ordinary YouTube links intact", () => {
    expect(getBlogContentBlocks('<p><a href="https://youtube.com/watch?v=JAQxl0l3Spo">Watch</a></p>')[0].kind).toBe("html");
  });
  it.each(["https://youtube.com.evil.test/watch?v=JAQxl0l3Spo", "javascript:alert(1)", "https://youtube.com/watch?v=invalid", "https://user@youtube.com/watch?v=JAQxl0l3Spo"])("never creates a player for %s", href => {
    expect(getBlogContentBlocks(marker(href)).some(b => b.kind === "video")).toBe(false);
  });
  it("requires an approved poster origin and preserves rich HTML sanitisation", () => {
    const blocks = getBlogContentBlocks(`<script>alert(1)</script><iframe src="https://evil.test"></iframe>${marker("https://youtube.com/shorts/VK9lByiDKQQ", "portrait", "https://evil.test/tracker.jpg")}`);
    expect(blocks.some(b => b.kind === "video")).toBe(false);
    expect(JSON.stringify(blocks)).not.toContain("<script");
    expect(JSON.stringify(blocks)).not.toContain("<iframe");
  });
  it.each(["/poster.webp", "https://api.openeire.ie/media/poster.webp"])("accepts configured poster source %s", src => {
    expect(getBlogContentBlocks(marker("https://youtu.be/JAQxl0l3Spo", "landscape", src)).some(b => b.kind === "video")).toBe(true);
  });
  it.each(["https://user@media.openeire.ie/poster.webp", "https://media.openeire.ie:444/poster.webp", "//evil.test/poster.webp", "/\\evil.test/poster.webp"])("rejects unsupported poster source %s", src => {
    expect(getBlogContentBlocks(marker("https://youtu.be/JAQxl0l3Spo", "landscape", src)).some(b => b.kind === "video")).toBe(false);
  });
});
