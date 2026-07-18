import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("next/font/google", () => ({
  Merriweather: () => ({ variable: "merriweather" }),
  Montserrat: () => ({ variable: "montserrat" }),
}));

vi.mock("next/script", () => ({
  default: (props: React.ComponentProps<"script"> & { strategy?: string }) => {
    const scriptProps = { ...props };
    delete scriptProps.strategy;
    return <script {...scriptProps} />;
  },
}));

vi.mock("@/components/layout/Footer", () => ({ Footer: () => null }));
vi.mock("@/components/layout/Navbar", () => ({ Navbar: () => null }));
vi.mock("@/components/Providers", () => ({
  Providers: ({ children }: { children: React.ReactNode }) => children,
}));

describe("root GA4 bootstrap", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.resetModules();
  });

  it("renders the production gtag.js URL exactly once in the root document", async () => {
    const { default: RootLayout } = await import("@/app/layout");
    const html = renderToStaticMarkup(
      <RootLayout>
        <p>Home</p>
      </RootLayout>,
    );
    const expectedUrl =
      "https://www.googletagmanager.com/gtag/js?id=G-96JSG3FV42";
    const iubendaRemoteUrl =
      "https://embeds.iubenda.com/widgets/b39f0cd0-25d9-49f2-9306-1258615676f2.js";

    expect(html.split(expectedUrl)).toHaveLength(2);
    expect(html.split(iubendaRemoteUrl)).toHaveLength(2);
    expect(html).not.toContain("https://cdn.iubenda.com/cs/iubenda_cs.js");
    expect(html.indexOf('gtag(\"consent\", \"default\"')).toBeLessThan(
      html.indexOf(iubendaRemoteUrl),
    );
    expect(html.indexOf(iubendaRemoteUrl)).toBeLessThan(
      html.indexOf(expectedUrl),
    );
  });

  it("queues denied Consent Mode v2 defaults before js and config", async () => {
    const { buildGoogleAnalyticsBootstrap } = await import(
      "@/lib/analyticsConfig"
    );
    const bootstrap = buildGoogleAnalyticsBootstrap();
    const defaultIndex = bootstrap.indexOf('gtag("consent", "default"');
    const jsIndex = bootstrap.indexOf('gtag("js"');
    const configIndex = bootstrap.indexOf('gtag("config"');

    expect(defaultIndex).toBeGreaterThanOrEqual(0);
    expect(defaultIndex).toBeLessThan(jsIndex);
    expect(defaultIndex).toBeLessThan(configIndex);
    expect(bootstrap).toContain('analytics_storage: "denied"');
    expect(bootstrap).toContain('ad_storage: "denied"');
    expect(bootstrap).toContain('ad_user_data: "denied"');
    expect(bootstrap).toContain('ad_personalization: "denied"');
    expect(bootstrap).toContain("send_page_view: false");
  });

  it("falls back to the checked production ID when the public env is missing", async () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("NEXT_PUBLIC_GA_MEASUREMENT_ID", "");
    vi.resetModules();

    const { GA_MEASUREMENT_ID, GA_SCRIPT_SRC } = await import(
      "@/lib/analyticsConfig"
    );

    expect(GA_MEASUREMENT_ID).toBe("G-96JSG3FV42");
    expect(GA_SCRIPT_SRC).toBe(
      "https://www.googletagmanager.com/gtag/js?id=G-96JSG3FV42",
    );
  });
});
