import React from "react";
import { Helmet } from "react-helmet";
import {
  DEFAULT_SOCIAL_IMAGE_PATH,
  SITE_TITLE,
  buildAbsoluteSiteUrl,
  getCurrentCanonicalUrl,
  getCurrentPageUrl,
} from "../config/site";

interface SEOHeadProps {
  title: string;
  description: string;
  image?: string;
  url?: string;
  canonicalPath?: string;
  canonicalUrl?: string;
  noindex?: boolean;
  type?: "website" | "article" | "product";
  appendSiteTitle?: boolean;
  schema?: Record<string, unknown> | Array<Record<string, unknown>>;
}

const SEOHead: React.FC<SEOHeadProps> = ({
  title,
  description,
  image,
  url,
  canonicalPath,
  canonicalUrl,
  noindex = false,
  type = "website",
  appendSiteTitle = true,
  schema,
}) => {
  const resolvedTitle = appendSiteTitle ? `${title} | ${SITE_TITLE}` : title;
  const pageUrl = url ? buildAbsoluteSiteUrl(url) : getCurrentPageUrl();
  const resolvedImage = buildAbsoluteSiteUrl(image || DEFAULT_SOCIAL_IMAGE_PATH);
  const resolvedCanonicalUrl = canonicalUrl
    ? buildAbsoluteSiteUrl(canonicalUrl)
    : canonicalPath
      ? buildAbsoluteSiteUrl(canonicalPath)
      : getCurrentCanonicalUrl();

  return (
    <Helmet>
      <title>{resolvedTitle}</title>
      <meta name="description" content={description} />
      <meta
        name="robots"
        content={noindex ? "noindex, follow" : "index, follow, max-image-preview:large"}
      />

      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={SITE_TITLE} />
      <meta property="og:url" content={pageUrl} />
      <meta property="og:title" content={resolvedTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={resolvedImage} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={pageUrl} />
      <meta name="twitter:title" content={resolvedTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={resolvedImage} />

      <link rel="canonical" href={resolvedCanonicalUrl} />

      {Array.isArray(schema) ? (
        schema.map((entry, index) => (
          <script
            key={`structured-data-${index}`}
            type="application/ld+json"
          >
            {JSON.stringify(entry)}
          </script>
        ))
      ) : schema ? (
        <script type="application/ld+json">{JSON.stringify(schema)}</script>
      ) : null}
    </Helmet>
  );
};

export default SEOHead;

