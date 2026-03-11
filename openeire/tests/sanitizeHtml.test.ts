// @vitest-environment jsdom

import { describe, expect, it } from "vitest";
import { sanitizeRichHtml } from "../src/utils/sanitizeHtml";

describe("sanitizeRichHtml", () => {
  it("removes script tags and unsafe attributes/protocols", () => {
    const dirty =
      '<p>Hello</p><img src="x" onerror="alert(1)" /><script>alert(1)</script><a href="javascript:alert(1)">click</a>';

    const clean = sanitizeRichHtml(dirty);
    const container = document.createElement("div");
    container.innerHTML = clean;

    expect(container.querySelector("script")).toBeNull();
    expect(container.innerHTML).not.toMatch(/onerror\s*=/i);
    expect(container.innerHTML).not.toMatch(/javascript:/i);
    expect(container.textContent).toContain("Hello");
    expect(container.textContent).toContain("click");
  });

  it("keeps safe formatting tags used by blog content", () => {
    const safe =
      "<p><strong>Bold</strong> and <em>italic</em> with a <a href='https://example.com'>link</a>.</p><ul><li>One</li><li>Two</li></ul>";

    const clean = sanitizeRichHtml(safe);
    const container = document.createElement("div");
    container.innerHTML = clean;

    expect(container.querySelector("strong")?.textContent).toBe("Bold");
    expect(container.querySelector("em")?.textContent).toBe("italic");
    expect(container.querySelectorAll("li")).toHaveLength(2);
    expect(container.querySelector("a")?.getAttribute("href")).toBe(
      "https://example.com",
    );
  });
});
