import type { NextConfig } from "next";

type NextImageConfig = NonNullable<NextConfig["images"]>;
type NextImageEnvironment = Record<string, string | undefined>;

export const NEXT_IMAGE_CONFIG_DEFAULTS = {
  remotePatterns: [
    {
      protocol: "https",
      hostname: "api.openeire.ie",
    },
    {
      protocol: "https",
      hostname: "media.openeire.ie",
    },
  ],
} satisfies NextImageConfig;

export const isNextImageOptimizationDisabled = (
  environment: NextImageEnvironment = process.env,
): boolean => environment.NEXT_IMAGE_OPTIMIZATION_DISABLED === "1";

export const createNextImageConfig = (
  environment: NextImageEnvironment = process.env,
): NextImageConfig => ({
  ...NEXT_IMAGE_CONFIG_DEFAULTS,
  unoptimized: isNextImageOptimizationDisabled(environment),
});
