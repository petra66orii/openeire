import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { api } from "@/lib/api/client";

describe("server public fetch diagnostics", () => {
  const originalDebugFlag = process.env.SERVER_PUBLIC_FETCH_DEBUG;

  beforeEach(() => {
    vi.stubGlobal("window", undefined);
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ id: 1 }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }),
      ),
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();

    if (originalDebugFlag === undefined) {
      delete process.env.SERVER_PUBLIC_FETCH_DEBUG;
    } else {
      process.env.SERVER_PUBLIC_FETCH_DEBUG = originalDebugFlag;
    }
  });

  it("does not emit public fetch debug output when the flag is absent", async () => {
    delete process.env.SERVER_PUBLIC_FETCH_DEBUG;
    const consoleInfoSpy = vi
      .spyOn(console, "info")
      .mockImplementation(() => undefined);

    await api.get("blog/example/", {
      publicFetchContext: "blog:detail",
    });

    expect(consoleInfoSpy).not.toHaveBeenCalledWith(
      "[server-public-fetch-debug]",
      expect.anything(),
    );
  });

  it("emits public fetch debug output when explicitly enabled", async () => {
    process.env.SERVER_PUBLIC_FETCH_DEBUG = "1";
    const consoleInfoSpy = vi
      .spyOn(console, "info")
      .mockImplementation(() => undefined);

    await api.get("blog/example/", {
      publicFetchContext: "blog:detail",
    });

    expect(consoleInfoSpy).toHaveBeenCalledWith(
      "[server-public-fetch-debug]",
      expect.objectContaining({
        context: "blog:detail",
        isServer: true,
      }),
    );
  });
});
