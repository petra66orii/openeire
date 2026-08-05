import Image from "next/image";
import Link from "next/link";

type Qualification = {
  title: string;
  alt: string;
  src: string;
  width: number;
  height: number;
  imageClassName: string;
  fullDescription: string;
  conciseDescription: string;
};

const qualifications: readonly Qualification[] = [
  {
    title: "IAA Registered",
    alt: "Irish Aviation Authority",
    src: "/qualifications/iaa.png",
    width: 381,
    height: 254,
    imageClassName: "max-h-14 max-w-32",
    fullDescription:
      "OpenÉire Studios is registered as a drone operator with the Irish Aviation Authority. Before a flight, we review the property location, relevant airspace and applicable operating restrictions.",
    conciseDescription:
      "Registered Irish drone operator with locations reviewed for relevant airspace and operating restrictions.",
  },
  {
    title: "EASA A1/A3 and A2",
    alt: "European Union Aviation Safety Agency",
    src: "/qualifications/easa.png",
    width: 1280,
    height: 431,
    imageClassName: "max-h-16 max-w-40",
    fullDescription:
      "Our remote pilot holds EASA Open Category A1/A3 and A2 competency certificates, covering remote-pilot responsibilities, flight safety, operating limitations and awareness of risk around other people.",
    conciseDescription:
      "Remote-pilot competency covering Open Category responsibilities, safety and operating limitations.",
  },
  {
    title: "Safe Pass",
    alt: "Safe Pass",
    src: "/qualifications/safe-pass.png",
    width: 1500,
    height: 473,
    imageClassName: "max-h-14 max-w-40",
    fullDescription:
      "Safe Pass construction-safety training supports work on suitable active construction and development sites, subject to client permission, site-specific induction and the safety requirements of the principal contractor.",
    conciseDescription:
      "Construction-safety training for suitable development and active-site work.",
  },
  {
    title: "Coverdrone Insured",
    alt: "Coverdrone",
    src: "/qualifications/coverdrone.png",
    width: 600,
    height: 113,
    imageClassName: "max-h-11 max-w-44",
    fullDescription:
      "OpenÉire Studios carries specialist commercial drone insurance through Coverdrone, including public-liability cover of up to €6.5 million per occurrence.",
    conciseDescription:
      "Specialist commercial drone insurance with public-liability cover of up to €6.5 million per occurrence.",
  },
] as const;

export function DroneQualificationsSection({
  variant,
}: {
  variant: "full" | "concise";
}) {
  const isFull = variant === "full";
  const headingId = `drone-qualifications-${variant}`;

  return (
    <section
      aria-labelledby={headingId}
      className={`relative overflow-hidden border-y border-white/10 ${
        isFull ? "bg-gray-950 py-20" : "bg-brand-900 py-16"
      }`}
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(14,165,233,0.12),transparent_42%)]"
        aria-hidden="true"
      />
      <div className="container relative mx-auto max-w-7xl px-4 lg:px-8">
        <div className={isFull ? "max-w-4xl" : "mx-auto max-w-3xl text-center"}>
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-accent">
            Qualifications, safety and insurance
          </p>
          <h2
            id={headingId}
            className="mt-3 font-serif text-3xl font-bold text-white md:text-5xl"
          >
            {isFull
              ? "Qualified, Insured and Safety-Conscious Drone Operations"
              : "Qualified and Insured Drone Operations"}
          </h2>
          {isFull ? (
            <>
              <p className="mt-5 leading-relaxed text-gray-300">
                Professional aerial property media involves more than launching
                a drone and taking photographs. Each flight must account for the
                location, surrounding people and property, airspace
                restrictions, weather and the operating limits of the aircraft.
              </p>
              <p className="mt-4 leading-relaxed text-gray-300">
                OpenÉire Studios combines Irish Aviation Authority operator
                registration, EASA remote-pilot competency, Safe Pass
                construction-safety training and specialist commercial drone
                insurance.
              </p>
            </>
          ) : (
            <p className="mt-5 leading-relaxed text-brand-100">
              OpenÉire Studios combines IAA operator registration, EASA A1/A3
              and A2 remote-pilot competency, Safe Pass training and specialist
              Coverdrone commercial insurance.
            </p>
          )}
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {qualifications.map((qualification) => (
            <article
              key={qualification.title}
              className="rounded-3xl border border-white/10 bg-black/55 p-5 shadow-sm"
            >
              <div className="flex h-24 items-center justify-center rounded-2xl border border-white/10 bg-white/15 px-5">
                <Image
                  src={qualification.src}
                  alt={qualification.alt}
                  width={qualification.width}
                  height={qualification.height}
                  sizes="(min-width: 1280px) 220px, (min-width: 640px) 40vw, 80vw"
                  className={`h-auto w-auto object-contain ${qualification.imageClassName}`}
                />
              </div>
              <h3 className="mt-5 font-serif text-xl font-bold text-white">
                {qualification.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-gray-300">
                {isFull
                  ? qualification.fullDescription
                  : qualification.conciseDescription}
              </p>
            </article>
          ))}
        </div>

        {isFull ? (
          <p className="mt-8 max-w-5xl leading-relaxed text-gray-300">
            Drone coverage is completed only where the flight can be carried out
            safely and lawfully. Evidence of relevant insurance and remote-pilot
            credentials can be supplied where reasonably required for a
            commercial or construction-site booking.
          </p>
        ) : (
          <div className="mt-9 text-center">
            <Link
              href="/real-estate"
              className="inline-flex rounded-full border border-white/30 px-6 py-3 text-xs font-bold uppercase tracking-[0.16em] text-white transition hover:border-accent hover:text-accent focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-brand-900"
            >
              Explore Property Media Services
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
