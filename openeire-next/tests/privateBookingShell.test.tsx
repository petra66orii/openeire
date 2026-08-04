import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

const shellPath = vi.hoisted(() => ({
  value: "/book/11111111-1111-4111-8111-111111111111",
}));

vi.mock("next/navigation", () => ({ usePathname: () => shellPath.value }));
vi.mock("next/script", () => ({ default: () => <span data-testid="tracking-script" /> }));
vi.mock("@/components/Providers", () => ({
  Providers: ({ children }: { children: React.ReactNode }) => <div data-testid="public-providers">{children}</div>,
}));
vi.mock("@/components/layout/Navbar", () => ({ Navbar: () => <div data-testid="public-navbar" /> }));
vi.mock("@/components/layout/Footer", () => ({ Footer: () => <div data-testid="public-footer" /> }));

describe("private booking route isolation", () => {
  afterEach(() => {
    cleanup();
    shellPath.value = "/book/11111111-1111-4111-8111-111111111111";
  });

  it("does not mount analytics, Iubenda, public providers, navigation or footer", async () => {
    const { AppShell } = await import("@/components/layout/AppShell");
    render(<AppShell><p>Private booking content</p></AppShell>);
    expect(screen.getByText("Private booking content")).toBeTruthy();
    expect(screen.queryByTestId("tracking-script")).toBeNull();
    expect(screen.queryByTestId("public-providers")).toBeNull();
    expect(screen.queryByTestId("public-navbar")).toBeNull();
    expect(screen.queryByTestId("public-footer")).toBeNull();
  });

  it("isolates booking API paths through the same private shell branch", async () => {
    shellPath.value = "/api/book/session";
    const { AppShell } = await import("@/components/layout/AppShell");
    render(<AppShell><p>Private API content</p></AppShell>);
    expect(screen.queryByTestId("tracking-script")).toBeNull();
    expect(screen.queryByTestId("public-providers")).toBeNull();
  });
});
