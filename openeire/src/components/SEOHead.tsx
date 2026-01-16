import React, { useEffect } from "react";

interface SEOHeadProps {
  title: string;
  description: string;
  image?: string;
  url?: string;
}

const SEOHead: React.FC<SEOHeadProps> = ({
  title,
  description,
  image,
  url = window.location.href,
}) => {
  const siteTitle = "OpenEire Studios";
  const fullTitle = `${title} | ${siteTitle}`;

  useEffect(() => {
    // 1. Update Title
    document.title = fullTitle;

    // 2. Helper to update Meta Tags
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

    // 3. Update Standard Meta Tags
    updateMeta("description", description);

    // 4. Update Open Graph (Facebook/LinkedIn)
    updateMeta("og:type", "website", "property");
    updateMeta("og:url", url, "property");
    updateMeta("og:title", fullTitle, "property");
    updateMeta("og:description", description, "property");
    if (image) updateMeta("og:image", image, "property");

    // 5. Update Twitter / X
    updateMeta("twitter:card", "summary_large_image");
    updateMeta("twitter:url", url);
    updateMeta("twitter:title", fullTitle);
    updateMeta("twitter:description", description);
    if (image) updateMeta("twitter:image", image);

    // Optional: Cleanup function to reset title when component unmounts
    return () => {
      // document.title = siteTitle;
    };
  }, [fullTitle, description, image, url]);

  return null; // This component renders nothing in the DOM body
};

export default SEOHead;
