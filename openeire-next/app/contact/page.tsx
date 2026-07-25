import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import { ContactForm } from "@/components/contact/ContactForm";
import { buildPageMetadata } from "@/lib/seo/metadata";
import {
  buildBreadcrumbJsonLd,
  buildOpenEireLocalBusinessJsonLd,
} from "@/lib/seo/jsonLd";
import {
  DEFAULT_SOCIAL_IMAGE_PATH,
  ORGANIZATION_LOGO_PATH,
  SITE_CONTACT_EMAIL,
  SITE_NAME,
  SITE_NAME_ASCII,
  buildAbsoluteUrl,
  getOfficialSameAsLinks,
} from "@/lib/site";

export const metadata: Metadata = buildPageMetadata({
  title:
    "Contact OpenEire Studios | Property Media, Prints, Licensing & Drone Work",
  description:
    "Get in touch about real-estate and property-media enquiries, fine art prints, commercial licensing, or bespoke drone work in Ireland.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <div className="page-top-offset min-h-screen overflow-x-hidden bg-black pb-20 text-white">
      <JsonLd
        data={[
          buildBreadcrumbJsonLd([
            { name: "Home", url: buildAbsoluteUrl("/") },
            { name: "Contact", url: buildAbsoluteUrl("/contact") },
          ]),
          buildOpenEireLocalBusinessJsonLd({
            name: SITE_NAME,
            alternateName: SITE_NAME_ASCII,
            url: buildAbsoluteUrl("/"),
            logo: buildAbsoluteUrl(ORGANIZATION_LOGO_PATH),
            image: buildAbsoluteUrl(DEFAULT_SOCIAL_IMAGE_PATH),
            email: SITE_CONTACT_EMAIL,
            sameAs: getOfficialSameAsLinks(),
          }),
        ]}
      />

      <div className="container mx-auto max-w-7xl px-4 pt-10 md:pt-14 lg:px-8">
        <div className="mb-16 px-2 text-center">
          <h1 className="mb-6 font-serif text-4xl font-bold md:text-6xl">
            Get in Touch
          </h1>
          <p className="mx-auto max-w-2xl text-lg font-light leading-relaxed text-gray-400">
            Have a question about real-estate or property media, a specific
            print, commercial licensing rights, or custom drone work? We are
            here to help bring your vision to life.
          </p>
        </div>

        <ContactForm />
      </div>
    </div>
  );
}
