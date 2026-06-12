import DOMPurify from "dompurify";

export const sanitizeRichHtml = (html: string): string =>
  DOMPurify.sanitize(html, {
    USE_PROFILES: { html: true },
    FORBID_TAGS: [
      "script",
      "style",
      "iframe",
      "object",
      "embed",
      "form",
      "input",
      "button",
      "textarea",
      "select",
      "meta",
      "link",
    ],
    FORBID_ATTR: ["style"],
    ALLOW_DATA_ATTR: false,
  });
