import { isPrintSource, printRedirectDestination } from "@/lib/printAttribution";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ source: string }> },
) {
  const { source } = await params;
  const headers = {
    "Cache-Control": "private, no-store, max-age=0",
    "X-Robots-Tag": "noindex, nofollow",
  };

  if (!isPrintSource(source)) {
    return new Response("Not found", { status: 404, headers });
  }

  // A relative, fixed destination avoids trusting Host or caller-supplied URLs.
  // 307 + no-store allows future destination changes without cached old routes.
  return new Response(null, {
    status: 307,
    headers: { ...headers, Location: printRedirectDestination(source) },
  });
}
