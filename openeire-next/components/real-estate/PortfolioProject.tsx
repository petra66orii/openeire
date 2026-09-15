import Link from "next/link";
import { FaCheckCircle, FaMapMarkerAlt } from "react-icons/fa";
import { PortfolioGallery } from "@/components/real-estate/PortfolioGallery";
import { PortfolioImageWithFallback } from "@/components/real-estate/PortfolioImageWithFallback";
import { PortfolioTrackedLink } from "@/components/real-estate/PortfolioTrackedLink";
import { PortfolioVideo } from "@/components/real-estate/PortfolioVideo";
import type { RealEstatePortfolioProject } from "@/lib/realEstatePortfolio";

export function PortfolioProject({
  project,
}: {
  project: RealEstatePortfolioProject;
}) {
  const propertyFilmCount = [
    project.groundVideo,
    project.aerialVideo,
    project.propertyFilm,
  ].filter(Boolean).length;
  const hasMultiplePropertyFilms = propertyFilmCount > 1;

  return (
    <article
      id={project.anchorId}
      className="scroll-mt-[calc(var(--site-header-height,96px)+1.5rem)] border-t border-white/10 bg-black py-20 md:py-24"
      data-project-layout="editorial"
    >
      <header className="container mx-auto grid max-w-7xl gap-10 px-4 lg:grid-cols-[0.8fr_1.2fr] lg:px-8">
        <div>
          <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.22em] text-accent">
            <FaMapMarkerAlt aria-hidden="true" />
            {project.generalLocation} · {project.propertyType}
          </p>
          <h2 className="mt-4 text-3xl font-bold text-white md:text-5xl">
            {project.title}
          </h2>
          <p className="mt-4 text-sm text-gray-400">
            {project.packageName} · {project.imageCount} selected photographs
          </p>
        </div>
        <p className="text-lg leading-8 text-gray-300">{project.summary}</p>
      </header>

      {project.heroImage ? (
        <div className="container mx-auto mt-12 max-w-7xl px-4 lg:px-8">
          <div
            className="relative overflow-hidden rounded-[2rem] bg-gray-900"
            style={{
              aspectRatio: `${project.heroImage.width} / ${project.heroImage.height}`,
            }}
          >
            <PortfolioImageWithFallback
              image={project.heroImage}
              sizes="(max-width: 1280px) 100vw, 1280px"
              className="object-cover"
            />
          </div>
        </div>
      ) : null}

      <section className="container mx-auto mt-16 max-w-7xl px-4 lg:px-8">
        <h3 className="text-2xl font-bold text-white">Selected deliverables</h3>
        <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {project.deliverables.map((deliverable) => (
            <li
              key={deliverable}
              className="flex gap-3 rounded-2xl border border-white/10 bg-gray-950 p-5 text-sm text-gray-300"
            >
              <FaCheckCircle
                className="mt-0.5 shrink-0 text-brand-500"
                aria-hidden="true"
              />
              {deliverable}
            </li>
          ))}
        </ul>
      </section>

      {project.groundVideo || project.aerialVideo || project.propertyFilm ? (
        <section className="container mx-auto mt-16 max-w-7xl px-4 lg:px-8">
          <div
            className={
              hasMultiplePropertyFilms
                ? "grid items-start gap-8 lg:grid-cols-2"
                : "mx-auto max-w-4xl"
            }
            data-property-video-layout={
              hasMultiplePropertyFilms ? "split" : "featured"
            }
          >
            <h3
              className={
                hasMultiplePropertyFilms
                  ? "mb-7 text-2xl font-bold text-white lg:col-span-2"
                  : "mb-7 text-2xl font-bold text-white"
              }
            >
              Property film
            </h3>
            {project.groundVideo ? (
              <PortfolioVideo
                video={project.groundVideo}
                projectSlug={project.slug}
              />
            ) : null}
            {project.aerialVideo ? (
              <PortfolioVideo
                video={project.aerialVideo}
                projectSlug={project.slug}
              />
            ) : null}
            {project.propertyFilm ? (
              <PortfolioVideo
                video={project.propertyFilm}
                projectSlug={project.slug}
              />
            ) : null}
          </div>
        </section>
      ) : null}

      {project.galleryImages.length ? (
        <section className="mt-16">
          <div className="container mx-auto max-w-7xl px-4 lg:px-8">
            <h3 className="mb-7 text-2xl font-bold text-white">
              Property photography
            </h3>
          </div>
          <PortfolioGallery
            images={project.galleryImages}
            projectSlug={project.slug}
          />
        </section>
      ) : null}

      {project.socialVideos?.length ? (
        <section className="container mx-auto mt-16 max-w-7xl px-4 lg:px-8">
          <h3 className="mb-7 text-2xl font-bold text-white">
            Social-media films
          </h3>
          <div className="grid items-start gap-8 md:grid-cols-2 lg:grid-cols-3">
            {project.socialVideos.map((video) => (
              <PortfolioVideo
                key={video.youtubeVideoId}
                video={video}
                projectSlug={project.slug}
              />
            ))}
          </div>
        </section>
      ) : null}

      {project.floorPlanImages?.length ? (
        <section className="container mx-auto mt-16 max-w-7xl px-4 lg:px-8">
          <h3 className="mb-7 text-2xl font-bold text-white">
            Measured 2D floor plan
          </h3>
          <PortfolioGallery
            images={project.floorPlanImages}
            projectSlug={project.slug}
            mode="floorPlan"
            galleryLabel="Measured 2D floor plan"
            viewerLabel="Measured 2D floor plan viewer"
          />
        </section>
      ) : null}

      <div className="container mx-auto mt-14 flex max-w-7xl flex-col gap-4 px-4 sm:flex-row lg:px-8">
        <PortfolioTrackedLink
          href="/real-estate#enquiry"
          eventName="portfolio_enquiry_cta"
          eventLocation={`project:${project.slug}`}
          className="rounded-full bg-brand-500 px-7 py-4 text-center text-sm font-bold uppercase tracking-[0.16em] text-white hover:bg-brand-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          Discuss a similar property
        </PortfolioTrackedLink>
        <Link
          href="/real-estate"
          className="rounded-full border border-white/20 px-7 py-4 text-center text-sm font-bold uppercase tracking-[0.16em] text-white hover:border-accent hover:text-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          View services and packages
        </Link>
      </div>
    </article>
  );
}
