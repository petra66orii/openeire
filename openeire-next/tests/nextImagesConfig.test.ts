import { describe, expect, it } from "vitest";

import {
  createNextImageConfig,
  NEXT_IMAGE_CONFIG_DEFAULTS,
} from "@/lib/config/nextImages";

describe("Next image optimisation configuration", () => {
  it("retains image optimisation when the variable is absent", () => {
    expect(createNextImageConfig({})).toEqual({
      ...NEXT_IMAGE_CONFIG_DEFAULTS,
      unoptimized: false,
    });
  });

  it("retains image optimisation when the variable is 0", () => {
    expect(
      createNextImageConfig({ NEXT_IMAGE_OPTIMIZATION_DISABLED: "0" })
        .unoptimized,
    ).toBe(false);
  });

  it("enables unoptimized images only when the variable is 1", () => {
    expect(
      createNextImageConfig({ NEXT_IMAGE_OPTIMIZATION_DISABLED: "1" })
        .unoptimized,
    ).toBe(true);
  });

  it("preserves every existing image configuration setting", () => {
    const enabledConfig = createNextImageConfig({
      NEXT_IMAGE_OPTIMIZATION_DISABLED: "1",
    });
    const { unoptimized, ...preservedConfig } = enabledConfig;

    expect(unoptimized).toBe(true);
    expect(preservedConfig).toEqual(NEXT_IMAGE_CONFIG_DEFAULTS);
    expect(enabledConfig.remotePatterns).toEqual([
      { protocol: "https", hostname: "api.openeire.ie" },
      { protocol: "https", hostname: "media.openeire.ie" },
    ]);
  });
});
