// These stable public URLs are encoded in printed QR codes. Change destinations
// here rather than replacing printed stock. Only these four sources are accepted.
export const PRINT_SOURCES = [
  "flyer",
  "portfolio-card",
  "office-drop",
  "qr-sticker",
] as const;

export type PrintSource = (typeof PRINT_SOURCES)[number];
export const PRINT_MEDIUM = "print";
export const PRINT_CAMPAIGN = "property_media";
export const PRINT_PORTFOLIO_DESTINATION = "/real-estate/portfolio";

export const isPrintSource = (value: string): value is PrintSource =>
  PRINT_SOURCES.some((source) => source === value);

export const printParameters = (source: PrintSource) => ({
  utm_source: source,
  utm_medium: PRINT_MEDIUM,
  utm_campaign: PRINT_CAMPAIGN,
});

export const printRedirectDestination = (source: PrintSource): string =>
  `${PRINT_PORTFOLIO_DESTINATION}?${new URLSearchParams(printParameters(source))}`;

// Do not copy arbitrary query parameters (including personal information) into
// links or analytics. Duplicate/mismatched campaign parameters are rejected.
export const getPrintSource = (search: string): PrintSource | null => {
  const params = new URLSearchParams(search);
  const source = params.get("utm_source");
  if (!source || !isPrintSource(source)) return null;
  const expected = printParameters(source);
  return Object.entries(expected).every(
    ([key, value]) => params.getAll(key).length === 1 && params.get(key) === value,
  ) ? source : null;
};

export const withPrintAttribution = (href: string, search: string): string => {
  const source = getPrintSource(search);
  if (!source || !href.startsWith("/") || href.startsWith("//")) return href;
  const url = new URL(href, "https://openeire.ie");
  for (const [key, value] of Object.entries(printParameters(source))) {
    url.searchParams.set(key, value);
  }
  return `${url.pathname}${url.search}${url.hash}`;
};
