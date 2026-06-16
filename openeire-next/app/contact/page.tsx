import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import { ContactForm } from "@/components/contact/ContactForm";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { buildBreadcrumbJsonLd } from "@/lib/seo/jsonLd";
import { buildAbsoluteUrl } from "@/lib/site";

export const metadata: Metadata = buildPageMetadata({
  title: "Contact OpenEire Studios | Prints, Licensing & Drone Work",
  description:
    "Get in touch about fine art print enquiries, commercial licensing, or bespoke drone capture projects in Ireland.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <div className="page-top-offset min-h-screen overflow-x-hidden bg-black pb-20 text-white">
      <JsonLd
        data={buildBreadcrumbJsonLd([
          { name: "Home", url: buildAbsoluteUrl("/") },
          { name: "Contact", url: buildAbsoluteUrl("/contact") },
        ])}
      />

      <div className="container mx-auto max-w-7xl px-4 lg:px-8">
        <div className="mb-16 px-2 text-center">
          <h1 className="mb-6 font-serif text-4xl font-bold md:text-6xl">
            Get in Touch
          </h1>
          <p className="mx-auto max-w-2xl text-lg font-light leading-relaxed text-gray-400">
            Have a question about a specific print, commercial licensing rights,
            or a custom drone shot? We are here to help bring your vision to
            life.
          </p>
        </div>

        <ContactForm />
      </div>
    </div>
  );
}
