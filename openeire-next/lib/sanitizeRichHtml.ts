const FORBIDDEN_BLOCKS =
  /<\s*(script|style|iframe|object|embed|form|input|button|textarea|select|meta|link)\b[^>]*>[\s\S]*?<\s*\/\s*\1\s*>/gi;
const FORBIDDEN_SELF_CLOSING =
  /<\s*(script|style|iframe|object|embed|form|input|button|textarea|select|meta|link)\b[^>]*\/?\s*>/gi;

const ALLOWED_TAGS = new Set([
  "a",
  "blockquote",
  "br",
  "code",
  "div",
  "em",
  "figcaption",
  "figure",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "hr",
  "img",
  "li",
  "ol",
  "p",
  "pre",
  "span",
  "strong",
  "ul",
]);

const ATTRIBUTES_BY_TAG: Record<string, Set<string>> = {
  a: new Set(["href", "title", "target", "rel"]),
  img: new Set(["src", "alt", "title", "width", "height", "loading"]),
};

const escapeHtml = (value: string): string =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const isSafeUrl = (value: string): boolean => {
  const trimmed = value.trim();
  if (!trimmed) return false;
  if (
    trimmed.startsWith("/") ||
    trimmed.startsWith("#") ||
    trimmed.startsWith("mailto:")
  ) {
    return true;
  }

  try {
    const url = new URL(trimmed);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
};

const sanitizeAttributes = (tagName: string, rawAttributes: string): string => {
  const allowed = ATTRIBUTES_BY_TAG[tagName];
  if (!allowed) return "";

  const attributes: string[] = [];
  const attrPattern =
    /([A-Za-z_:][-A-Za-z0-9_:.]*)\s*=\s*("([^"]*)"|'([^']*)'|([^\s"'=<>`]+))/g;
  let match: RegExpExecArray | null;

  while ((match = attrPattern.exec(rawAttributes))) {
    const name = match[1].toLowerCase();
    const value = match[3] ?? match[4] ?? match[5] ?? "";

    if (!allowed.has(name)) continue;
    if (name.startsWith("on")) continue;
    if ((name === "href" || name === "src") && !isSafeUrl(value)) continue;

    if (tagName === "a" && name === "target" && value !== "_blank") continue;

    attributes.push(`${name}="${escapeHtml(value)}"`);
  }

  if (tagName === "a") {
    const hasTargetBlank = attributes.includes('target="_blank"');
    const hasRel = attributes.some((attribute) => attribute.startsWith("rel="));
    if (hasTargetBlank && !hasRel) {
      attributes.push('rel="noopener noreferrer"');
    }
  }

  if (tagName === "img") {
    const hasLoading = attributes.some((attribute) =>
      attribute.startsWith("loading="),
    );
    if (!hasLoading) attributes.push('loading="lazy"');
  }

  return attributes.length ? ` ${attributes.join(" ")}` : "";
};

export const sanitizeRichHtml = (html: string): string => {
  if (!html) return "";

  return html
    .replace(FORBIDDEN_BLOCKS, "")
    .replace(FORBIDDEN_SELF_CLOSING, "")
    .replace(/<\s*\/?\s*([A-Za-z0-9-]+)([^>]*)>/g, (tag, tagName, attrs) => {
      const normalizedTag = String(tagName).toLowerCase();
      if (!ALLOWED_TAGS.has(normalizedTag)) return "";

      const isClosing = /^<\s*\//.test(tag);
      if (isClosing) return `</${normalizedTag}>`;

      const isSelfClosing = /\/\s*>$/.test(tag) || normalizedTag === "br";
      const sanitizedAttributes = sanitizeAttributes(
        normalizedTag,
        String(attrs ?? ""),
      );

      return `<${normalizedTag}${sanitizedAttributes}${isSelfClosing ? " />" : ">"}`;
    })
    .replace(/\s+>/g, ">")
    .replace(/\s+\/>/g, " />");
};
