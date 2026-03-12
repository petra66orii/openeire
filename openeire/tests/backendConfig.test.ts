import { describe, expect, it } from "vitest";
import {
  deriveMediaBaseUrl,
  normalizeApiBaseUrl,
  resolveMediaUrl,
} from "../src/config/backend";

describe("backend config helpers", () => {
  it("normalizes relative and absolute API base URLs", () => {
    expect(normalizeApiBaseUrl(undefined)).toBe("/api/");
    expect(normalizeApiBaseUrl("")).toBe("/api/");
    expect(normalizeApiBaseUrl("api")).toBe("/api/");
    expect(normalizeApiBaseUrl("api/")).toBe("/api/");
    expect(normalizeApiBaseUrl("/api")).toBe("/api/");
    expect(normalizeApiBaseUrl("https://api.example.com/api")).toBe(
      "https://api.example.com/api/",
    );
  });

  it("derives media base from explicit value or absolute API base", () => {
    expect(
      deriveMediaBaseUrl("https://api.example.com/api/", undefined),
    ).toBe("https://api.example.com");
    expect(
      deriveMediaBaseUrl("/api/", "https://cdn.example.com/media/"),
    ).toBe("https://cdn.example.com/media");
    expect(deriveMediaBaseUrl("/api/", "/media/")).toBe("/media");
    expect(deriveMediaBaseUrl("/api/", undefined)).toBe("");
  });

  it("resolves media URLs for absolute and relative asset paths", () => {
    expect(resolveMediaUrl("https://cdn.example.com/a.jpg")).toBe(
      "https://cdn.example.com/a.jpg",
    );
    expect(resolveMediaUrl("/media/a.jpg", "https://api.example.com")).toBe(
      "https://api.example.com/media/a.jpg",
    );
    expect(resolveMediaUrl("media/a.jpg", "https://api.example.com")).toBe(
      "https://api.example.com/media/a.jpg",
    );
    expect(resolveMediaUrl("/media/a.jpg", "")).toBe("/media/a.jpg");
    expect(resolveMediaUrl(undefined, "https://api.example.com")).toBeUndefined();
  });
});
