import React, { useEffect } from "react";

interface SEOHeadProps {
  title: string;
  description: string;
  image?: string;
  url?: string;
  canonicalPath?: string;
  noindex?: boolean;
  type?: "website" | "article";
}

const getSiteOrigin = (): string => {
  const configured = import.meta.env.VITE_SITE_URL?.trim().replace(/\/+$/, "");
  if (configured) {
    try {
      const normalized = new URL(configured);
      if (normalized.protocol === "http:" || normalized.protocol === "https:") {
        normalized.pathname = "";
        normalized.search = "";
        normalized.hash = "";
        return normalized.toString().replace(/\/+$/, "");
      }
    } catch {
      // Fall back to the current origin when VITE_SITE_URL is misconfigured.
    }
  }

  if (typeof window === "undefined") return "";
  return window.location.origin;
};

const buildAbsoluteUrl = (value: string): string => {
  if (/^https?:\/\//i.test(value)) return value;
  const origin = getSiteOrigin();
  if (!origin) return value;
  return new URL(value, `${origin}/`).toString();
};

const getCurrentUrl = (): string => {
  if (typeof window === "undefined") return "";
  const origin = getSiteOrigin();
  const current = new URL(window.location.href);
  return origin
    ? new URL(`${current.pathname}${current.search}${current.hash}`, `${origin}/`).toString()
    : current.toString();
};

const getCurrentCanonicalUrl = (): string => {
  if (typeof window === "undefined") return "";
  const origin = getSiteOrigin();
  const current = new URL(window.location.href);
  current.search = "";
  current.hash = "";
  return origin
    ? new URL(current.pathname, `${origin}/`).toString()
    : current.toString();
};

const SEOHead: React.FC<SEOHeadProps> = ({
  title,
  description,
  image,
  url,
  canonicalPath,
  noindex = false,
  type = "website",
}) => {
  const siteTitle = "OpenÉire Studios";
  const fullTitle = `${title} | ${siteTitle}`;
  const pageUrl = url ? buildAbsoluteUrl(url) : getCurrentUrl();
  const canonicalUrl = canonicalPath
    ? buildAbsoluteUrl(canonicalPath)
    : getCurrentCanonicalUrl();

  useEffect(() => {
    document.title = fullTitle;

    const updateMeta = (
      name: string,
      content: string,
      attribute: "name" | "property" = "name",
    ) => {
      let element = document.querySelector(`meta[${attribute}="${name}"]`);

      if (!element) {
        element = document.createElement("meta");
        element.setAttribute(attribute, name);
        document.head.appendChild(element);
      }

      element.setAttribute("content", content);
    };

    const updateLink = (rel: string, href: string) => {
      let element = document.querySelector(`link[rel="${rel}"]`);

      if (!element) {
        element = document.createElement("link");
        element.setAttribute("rel", rel);
        document.head.appendChild(element);
      }

      element.setAttribute("href", href);
    };

    updateMeta("description", description);
    updateMeta("robots", noindex ? "noindex, follow" : "index, follow");

    updateMeta("og:type", type, "property");
    updateMeta("og:site_name", siteTitle, "property");
    updateMeta("og:url", pageUrl, "property");
    updateMeta("og:title", fullTitle, "property");
    updateMeta("og:description", description, "property");
    if (image) {
      updateMeta("og:image", image, "property");
    }

    updateMeta("twitter:card", image ? "summary_large_image" : "summary");
    updateMeta("twitter:url", pageUrl);
    updateMeta("twitter:title", fullTitle);
    updateMeta("twitter:description", description);
    if (image) {
      updateMeta("twitter:image", image);
    }

    updateLink("canonical", canonicalUrl);
  }, [canonicalUrl, description, fullTitle, image, noindex, pageUrl, type]);

  return null;
};

export default SEOHead;
