# Phase 1 Migration Preparation Map

These notes cover only the routes requested for future Phase 1 migration. PR 2
creates placeholders and architecture; it does not migrate content.

## `/`

- Existing data dependencies: `getTestimonials` through `TestimonialCarousel`.
- Existing components: `HeroSection`, `ServicesSection`, lazy `TestimonialCarousel`, SEO/head utilities.
- API calls: `GET home/testimonials/`.
- SEO requirements: Organization schema, WebSite schema, canonical homepage URL, default hero social image.
- Structured data opportunities: Organization, WebSite, possibly Service/OfferCatalog later.
- Candidate split: Server Component page with client carousel/testimonial island.

## `/licensing`

- Existing data dependencies: none for static overview content.
- Existing components: `LicensingOverviewPage`, navigation CTAs into gallery/product licence flow.
- API calls: none on page load.
- SEO requirements: commercial aerial footage licensing title/description/canonical.
- Structured data opportunities: BreadcrumbList, Service, FAQ if licensing FAQs move here.
- Candidate split: Server Component.

## `/art-prints`

- Existing data dependencies: none for landing page content.
- Existing components: `ArtPrintsPage`, print CTA blocks, gallery links.
- API calls: none on page load.
- SEO requirements: art prints title/description/canonical and strong social image.
- Structured data opportunities: BreadcrumbList, CollectionPage, FAQ if relevant content is added.
- Candidate split: Server Component.

## `/footage`

- Existing data dependencies: none for static landing content.
- Existing components: `FootageLandingPage`.
- API calls: none on page load.
- SEO requirements: drone footage landing metadata, canonical, FAQ schema.
- Structured data opportunities: BreadcrumbList, FAQPage, Service.
- Candidate split: Server Component.

## `/real-estate`

- Existing data dependencies: none for static content; form submits to backend.
- Existing components: `RealEstatePage`, custom enquiry form, Iubenda consent integration, analytics.
- API calls: `POST real-estate/enquiries/`.
- SEO requirements: real estate photography/video landing metadata, canonical, FAQ schema.
- Structured data opportunities: BreadcrumbList, FAQPage, LocalBusiness/Service only if content supports it.
- Candidate split: Server Component page with client enquiry form island.

## `/us`

- Existing data dependencies: no current `/us` route; existing US pages live below `/us/*`.
- Existing components: future hub can reuse US print landing sections/cards.
- API calls: none expected for first migration.
- SEO requirements: avoid duplicate intent with child US landing pages; canonical `/us`.
- Structured data opportunities: BreadcrumbList, CollectionPage.
- Candidate split: Server Component.

## `/blog`

- Existing data dependencies: blog post list.
- Existing components: `BlogListPage`, `BlogPostCard`.
- API calls: `GET blog/` with optional tag filter.
- SEO requirements: blog index metadata, canonical, no tag duplication without canonical rules.
- Structured data opportunities: Blog, BreadcrumbList, ItemList.
- Candidate split: Server Component list with optional client filter controls.

## `/blog/[slug]`

- Existing data dependencies: article detail, comments, likes.
- Existing components: `BlogDetailPage`, sanitized HTML render, comment form/list, related posts.
- API calls: `GET blog/{slug}/`, `GET blog/{slug}/comments/`, `POST blog/{slug}/like/`, `POST blog/{slug}/comments/`.
- SEO requirements: dynamic title/description/canonical, article image, published/modified dates.
- Structured data opportunities: Article, BreadcrumbList.
- Candidate split: Server Component article; comments/likes as client island.
