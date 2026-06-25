import Image from "next/image";
import Link from "next/link";
import { FaAward, FaCamera, FaMapMarkedAlt, FaPlane } from "react-icons/fa";
import { JsonLd } from "@/components/JsonLd";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { buildBreadcrumbJsonLd, buildOrganizationJsonLd, buildWebsiteJsonLd } from "@/lib/seo/jsonLd";
import { ORGANIZATION_LOGO_PATH, SITE_CONTACT_EMAIL, SITE_DESCRIPTION, SITE_NAME, SITE_NAME_ASCII, buildAbsoluteUrl } from "@/lib/site";

export const metadata = buildPageMetadata({
  title: "About OpenÉire Studios | Drone Photography & Fine Art Prints",
  description: "Meet OpenÉire Studios, an Ireland-based studio creating aerial stock footage, drone photography, and fine art prints.",
  path: "/about",
  image: "/hero-poster.jpg",
});

const stats = [
  { icon: FaCamera, value: "50k+", label: "Photos Taken" },
  { icon: FaPlane, value: "12", label: "Countries Explored" },
  { icon: FaAward, value: "100%", label: "Quality Guarantee" },
  { icon: FaMapMarkedAlt, value: "24/7", label: "Global Delivery" },
];

const process = [
  { number: "01", title: "The Capture", text: "We use cinema-grade drones and high-resolution mirrorless cameras, waiting for the right light to meet the landscape." },
  { number: "02", title: "The Edit", text: "Every image is professionally colour-graded to enhance the natural mood without making it feel artificial." },
  { number: "03", title: "The Print", text: "We work with specialist fine art production partners using archival papers and pigment inks for enduring physical pieces." },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <JsonLd data={buildBreadcrumbJsonLd([{ name: "Home", url: buildAbsoluteUrl("/") }, { name: "About", url: buildAbsoluteUrl("/about") }])} />
      <JsonLd data={buildOrganizationJsonLd({ name: SITE_NAME, alternateName: SITE_NAME_ASCII, url: buildAbsoluteUrl("/"), logo: buildAbsoluteUrl(ORGANIZATION_LOGO_PATH), description: SITE_DESCRIPTION, contactEmail: SITE_CONTACT_EMAIL })} />
      <JsonLd data={buildWebsiteJsonLd({ name: SITE_NAME, alternateName: SITE_NAME_ASCII, url: buildAbsoluteUrl("/") })} />

      <section className="relative flex min-h-[70vh] items-center justify-center overflow-hidden">
        <Image src="/hero-poster.jpg" alt="Aerial landscape photographed by OpenÉire Studios" fill priority className="object-cover opacity-60" sizes="100vw" />
        <div className="absolute inset-0 bg-linear-to-t from-black via-transparent to-black/30" />
        <div className="header-safe-top relative z-10 mx-auto max-w-4xl px-4 pb-16 text-center">
          <span className="mb-4 block text-sm font-bold uppercase tracking-[0.3em] text-accent">Established 2026</span>
          <h1 className="mb-6 font-serif text-5xl font-bold leading-tight md:text-7xl">Capturing the <br /> Spirit of the Wild</h1>
          <p className="mx-auto max-w-2xl text-lg font-light leading-relaxed text-gray-300 md:text-xl">OpenÉire Studios is an Ireland-based aerial photography and stock footage studio dedicated to the raw, unspoken beauty of the Irish landscape and beyond.</p>
        </div>
      </section>

      <section className="container mx-auto grid items-center gap-16 px-4 py-24 md:grid-cols-2 lg:px-8">
        <div className="space-y-8">
          <h2 className="font-serif text-3xl font-bold md:text-4xl">More than just pixels.<br /><span className="text-gray-500">It&apos;s about the feeling.</span></h2>
          <div className="space-y-6 text-lg leading-loose text-gray-400">
            <p>It started with a single drone flight over the cliffs of Moher. The way the light hit the water and the sheer scale of the Atlantic was not just a view; it was an emotion.</p>
            <p>We believe photography should transport you. From Galway Bay in New Zealand to Galway in Ireland, our mission is to freeze those fleeting moments in time.</p>
            <p>We specialise in <strong className="text-white">high-fidelity 4K stock footage</strong> for creators and <strong className="text-white">museum-grade fine art prints</strong> for collectors who want to bring a piece of the wild into their homes.</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="relative h-64 translate-y-8 overflow-hidden rounded-2xl border border-white/10"><Image src="/ireland-gallery.webp" alt="Irish aerial landscape" fill className="object-cover" sizes="(max-width: 768px) 50vw, 25vw" /></div>
          <div className="relative h-64 -translate-y-8 overflow-hidden rounded-2xl border border-white/10"><Image src="/thai-sunset.webp" alt="Landscape photographed abroad" fill className="object-cover" sizes="(max-width: 768px) 50vw, 25vw" /></div>
        </div>
      </section>

      <section className="border-y border-white/10 bg-gray-900/30"><div className="container mx-auto grid grid-cols-2 gap-8 px-4 py-16 text-center md:grid-cols-4">{stats.map(({ icon: Icon, value, label }) => <article key={label}><Icon className="mx-auto mb-4 text-3xl text-brand-500" /><p className="font-serif text-4xl font-bold">{value}</p><p className="mt-2 text-xs uppercase tracking-widest text-gray-500">{label}</p></article>)}</div></section>

      <section className="container mx-auto px-4 py-24 lg:px-8">
        <div className="mb-16 text-center"><h2 className="mb-6 font-serif text-3xl font-bold md:text-5xl">How We Work</h2><p className="mx-auto max-w-2xl text-gray-400">From the raw capture in the field to the final print in your hands, we obsess over every detail.</p></div>
        <div className="grid gap-8 md:grid-cols-3">{process.map((step) => <article key={step.number} className="relative overflow-hidden rounded-2xl border border-white/10 bg-gray-900 p-8"><span className="absolute right-8 top-5 font-serif text-6xl font-bold text-white/5">{step.number}</span><h3 className="relative mb-4 text-xl font-bold">{step.title}</h3><p className="relative text-sm leading-relaxed text-gray-400">{step.text}</p></article>)}</div>
      </section>

      <section className="relative flex min-h-[50vh] items-center justify-center overflow-hidden">
        <Image src="/thai-sunset.webp" alt="" fill className="object-cover opacity-65" sizes="100vw" />
        <div className="absolute inset-0 bg-linear-to-t from-black via-black/50 to-transparent" />
        <div className="relative z-10 px-4 text-center"><h2 className="mb-6 font-serif text-4xl font-bold md:text-6xl">Ready to explore?</h2><div className="flex flex-col justify-center gap-4 sm:flex-row"><Link href="/gallery/physical" className="rounded-full bg-white px-8 py-4 font-bold text-black transition-colors hover:bg-accent">View Gallery</Link><Link href="/contact" className="rounded-full border border-white px-8 py-4 font-bold text-white transition-colors hover:bg-white hover:text-black">Contact Us</Link></div></div>
      </section>
    </div>
  );
}
