import DOMPurify from "dompurify";

export const sanitizeRichHtml = (html: string): string =>
  DOMPurify.sanitize(html, {
    USE_PROFILES: { html: true },
  });
