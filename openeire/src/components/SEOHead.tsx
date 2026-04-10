import React from "react";
import { Helmet } from "react-helmet";
import {
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
  type?: "website" | "article";
  appendSiteTitle?: boolean;
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
}) => {
  const resolvedTitle = appendSiteTitle ? `${title} | ${SITE_TITLE}` : title;
  const pageUrl = url ? buildAbsoluteSiteUrl(url) : getCurrentPageUrl();
  const resolvedCanonicalUrl = canonicalUrl
    ? buildAbsoluteSiteUrl(canonicalUrl)
    : canonicalPath
      ? buildAbsoluteSiteUrl(canonicalPath)
      : getCurrentCanonicalUrl();

  return (
    <Helmet>
      <title>{resolvedTitle}</title>
      <meta name="description" content={description} />
      <meta name="robots" content={noindex ? "noindex, follow" : "index, follow"} />

      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={SITE_TITLE} />
      <meta property="og:url" content={pageUrl} />
      <meta property="og:title" content={resolvedTitle} />
      <meta property="og:description" content={description} />
      {image ? <meta property="og:image" content={image} /> : null}

      <meta name="twitter:card" content={image ? "summary_large_image" : "summary"} />
      <meta name="twitter:url" content={pageUrl} />
      <meta name="twitter:title" content={resolvedTitle} />
      <meta name="twitter:description" content={description} />
      {image ? <meta name="twitter:image" content={image} /> : null}

      <link rel="canonical" href={resolvedCanonicalUrl} />
    </Helmet>
  );
};

export default SEOHead;