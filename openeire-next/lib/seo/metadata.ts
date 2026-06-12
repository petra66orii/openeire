import type { Metadata } from "next";
import {
  DEFAULT_SOCIAL_IMAGE_PATH,
  SITE_DESCRIPTION,
  SITE_NAME,
  buildAbsoluteUrl,
  getSiteUrl,
} from "@/lib/site";
import { buildCanonicalUrl } from "@/lib/seo/canonical";

type MetadataInput = {
  title?: string;
  description?: string;
  path?: string;
  image?: string;
  noIndex?: boolean;
};

export const buildDefaultMetadata = (): Metadata =>
  buildPageMetadata({
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    path: "/",
  });

export const buildPageMetadata = ({
  title = SITE_NAME,
  description = SITE_DESCRIPTION,
  path = "/",
  image = DEFAULT_SOCIAL_IMAGE_PATH,
  noIndex = false,
}: MetadataInput): Metadata => {
  const canonical = buildCanonicalUrl(path);
  const imageUrl = buildAbsoluteUrl(image);

  return {
    metadataBase: new URL(getSiteUrl()),
    title,
    description,
    alternates: {
      canonical,
    },
    robots: noIndex
      ? {
          index: false,
          follow: false,
        }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-image-preview": "large",
          },
        },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: SITE_NAME,
      images: [{ url: imageUrl }],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
  };
};
