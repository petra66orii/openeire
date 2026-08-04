import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { PrivateDeliveryClient } from "@/components/delivery/PrivateDeliveryClient";

const PUBLIC_ID = "11111111-1111-4111-8111-111111111111";
const FILE_ID = "22222222-2222-4222-8222-222222222222";
const SIGNED_DOWNLOAD_URL =
  "https://downloads.example.test/private/object.zip?X-Amz-Signature=fictional";

const response = (payload: unknown, ok = true, status = ok ? 200 : 423) =>
  Promise.resolve({
    ok,
    status,
    json: () => Promise.resolve(payload),
  } as Response);

const validDelivery = {
  state: "valid",
  delivery: {
    title: "Fictional property media",
    available_from: "2026-07-28T10:00:00Z",
    expires_at: "2026-08-27T10:00:00Z",
    licence_summary: "Agency marketing use.",
    download_instructions: "Save a local copy before expiry.",
    groups: [
      {
        category: "photographs",
        files: [
          {
            id: FILE_ID,
            category: "photographs",
            category_label: "Photographs",
            display_name: "Web photographs",
            filename: `${"very-long-filename-".repeat(8)}.zip`,
            size: 1048576,
            mime_type: "application/zip",
          },
        ],
      },
    ],
  },
};

describe("private delivery bootstrap", () => {
  beforeEach(() => {
    window.localStorage.clear();
    window.sessionStorage.clear();
  });

  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
    window.history.replaceState({}, "", "/");
  });

  it("exchanges the fragment, removes it, and never writes browser storage", async () => {
    window.history.replaceState(
      {},
      "",
      `/delivery/${PUBLIC_ID}#fragment-secret`,
    );
    const fetchMock = vi
      .fn()
      .mockImplementationOnce(() => response({ state: "valid" }))
      .mockImplementationOnce(() => response(validDelivery));
    vi.stubGlobal("fetch", fetchMock);

    render(<PrivateDeliveryClient recipientPublicId={PUBLIC_ID} />);

    await waitFor(() =>
      expect(screen.getByRole("heading", { level: 1 }).textContent).toBe(
        "Fictional property media",
      ),
    );
    expect(window.location.hash).toBe("");
    expect(fetchMock).toHaveBeenNthCalledWith(
      1,
      "/api/delivery/exchange",
      expect.objectContaining({ method: "POST" }),
    );
    const exchangeBody = JSON.parse(fetchMock.mock.calls[0][1].body as string);
    expect(exchangeBody).toEqual({
      public_id: PUBLIC_ID,
      secret: "fragment-secret",
    });
    expect(window.localStorage.length).toBe(0);
    expect(window.sessionStorage.length).toBe(0);
  });

  it("uses a returning HttpOnly cookie session without a fragment exchange", async () => {
    window.history.replaceState({}, "", `/delivery/${PUBLIC_ID}`);
    const fetchMock = vi.fn(() => response(validDelivery));
    vi.stubGlobal("fetch", fetchMock);

    render(<PrivateDeliveryClient recipientPublicId={PUBLIC_ID} />);

    await screen.findByText("Web photographs");
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledWith(
      "/api/delivery/session",
      expect.objectContaining({ method: "POST", credentials: "same-origin" }),
    );
  });

  it.each([
    ["payment_locked", "Delivery not yet released"],
    ["temporarily_unavailable", "Delivery not available yet"],
    ["empty", "Files are being prepared"],
    ["unavailable", "Delivery unavailable"],
  ])("renders the %s client state generically", async (state, heading) => {
    window.history.replaceState({}, "", `/delivery/${PUBLIC_ID}`);
    vi.stubGlobal("fetch", vi.fn(() => response({ state }, false)));

    render(<PrivateDeliveryClient recipientPublicId={PUBLIC_ID} />);

    expect(await screen.findByRole("heading", { name: heading })).toBeTruthy();
    expect(document.body.textContent).not.toContain(PUBLIC_ID);
  });

  it("uses one same-origin POST fetch and navigates the browser directly to the signed URL", async () => {
    window.history.replaceState({}, "", `/delivery/${PUBLIC_ID}`);
    let resolveDownload!: (value: Response) => void;
    const pendingDownload = new Promise<Response>((resolve) => {
      resolveDownload = resolve;
    });
    const fetchMock = vi
      .fn()
      .mockImplementationOnce(() => response(validDelivery))
      .mockImplementationOnce(() => pendingDownload);
    vi.stubGlobal("fetch", fetchMock);
    let navigatedTo = "";
    const clickSpy = vi
      .spyOn(HTMLAnchorElement.prototype, "click")
      .mockImplementation(function (this: HTMLAnchorElement) {
        navigatedTo = this.href;
      });

    render(<PrivateDeliveryClient recipientPublicId={PUBLIC_ID} />);

    const button = await screen.findByRole("button", {
      name: "Download Web photographs",
    });
    expect(button.className).toContain("bg-[#16a34a]");
    expect(button.className).toContain("w-full");
    expect(button.className).toContain("sm:w-auto");
    expect(button.closest("li")?.className).toContain("sm:flex-row");
    expect(screen.getByText("Media delivery").className).toContain(
      "text-[#16a34a]",
    );
    expect(screen.getByText(/very-long-filename-/).className).toContain(
      "break-all",
    );

    fireEvent.click(button);
    fireEvent.click(button);

    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(fetchMock).toHaveBeenNthCalledWith(
      2,
      "/api/delivery/download",
      expect.objectContaining({
        method: "POST",
        credentials: "same-origin",
        headers: expect.objectContaining({
          Accept: "application/json",
          "Content-Type": "application/json",
        }),
      }),
    );
    expect(JSON.parse(fetchMock.mock.calls[1][1].body as string)).toEqual({
      deliverable_id: FILE_ID,
    });
    expect(button).toHaveProperty("disabled", true);
    expect(button.textContent).toContain("Preparing");

    resolveDownload({
      ok: true,
      status: 200,
      json: () => Promise.resolve({ download_url: SIGNED_DOWNLOAD_URL }),
    } as Response);

    await waitFor(() => expect(clickSpy).toHaveBeenCalledTimes(1));
    expect(navigatedTo).toBe(SIGNED_DOWNLOAD_URL);
    expect(fetchMock).toHaveBeenCalledTimes(2);
    await waitFor(() => expect(button).toHaveProperty("disabled", false));
  });

  it("shows an accessible generic error when download initiation fails", async () => {
    window.history.replaceState({}, "", `/delivery/${PUBLIC_ID}`);
    const fetchMock = vi
      .fn()
      .mockImplementationOnce(() => response(validDelivery))
      .mockImplementationOnce(() =>
        response({ state: "unavailable", private_detail: FILE_ID }, false),
      );
    vi.stubGlobal("fetch", fetchMock);

    render(<PrivateDeliveryClient recipientPublicId={PUBLIC_ID} />);

    fireEvent.click(
      await screen.findByRole("button", {
        name: "Download Web photographs",
      }),
    );

    const alert = await screen.findByRole("alert");
    expect(alert.textContent).toContain(
      "We could not start that download. Please try again.",
    );
    expect(document.body.textContent).not.toContain(FILE_ID);
  });

  it("labels staff preview and disables downloads", async () => {
    window.history.replaceState({}, "", `/delivery/${PUBLIC_ID}`);
    const fetchMock = vi.fn(() =>
      response({ ...validDelivery, preview: true }),
    );
    vi.stubGlobal("fetch", fetchMock);

    render(<PrivateDeliveryClient recipientPublicId={PUBLIC_ID} />);

    expect(await screen.findByText(/Staff preview/)).toBeTruthy();
    const button = screen.getByRole("button", {
      name: "Download Web photographs",
    });
    expect(button).toHaveProperty("disabled", true);
    fireEvent.click(button);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});

const shellPath = vi.hoisted(() => ({
  value: "/delivery/11111111-1111-4111-8111-111111111111",
}));
vi.mock("next/navigation", () => ({ usePathname: () => shellPath.value }));
vi.mock("next/script", () => ({
  default: () => <span data-testid="tracking-script" />,
}));
vi.mock("@/components/Providers", () => ({
  Providers: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="public-providers">{children}</div>
  ),
}));
vi.mock("@/components/layout/Navbar", () => ({
  Navbar: () => <div data-testid="public-navbar" />,
}));
vi.mock("@/components/layout/Footer", () => ({
  Footer: () => <div data-testid="public-footer" />,
}));

describe("private delivery shell", () => {
  afterEach(() => {
    cleanup();
    shellPath.value = `/delivery/${PUBLIC_ID}`;
  });

  it("does not mount tracking, cart/marketing providers, or public chrome", async () => {
    const { AppShell } = await import("@/components/layout/AppShell");
    render(
      <AppShell>
        <p>Private content</p>
      </AppShell>,
    );
    expect(screen.getByText("Private content")).toBeTruthy();
    expect(screen.queryByTestId("tracking-script")).toBeNull();
    expect(screen.queryByTestId("public-providers")).toBeNull();
    expect(screen.queryByTestId("public-navbar")).toBeNull();
    expect(screen.queryByTestId("public-footer")).toBeNull();
  });

  it("retains analytics, providers and public chrome on public routes", async () => {
    shellPath.value = "/real-estate/portfolio";
    const { AppShell } = await import("@/components/layout/AppShell");
    render(
      <AppShell>
        <p>Public content</p>
      </AppShell>,
    );
    expect(screen.getByText("Public content")).toBeTruthy();
    expect(screen.getAllByTestId("tracking-script")).toHaveLength(3);
    expect(screen.getByTestId("public-providers")).toBeTruthy();
    expect(screen.getByTestId("public-navbar")).toBeTruthy();
    expect(screen.getByTestId("public-footer")).toBeTruthy();
  });
});
