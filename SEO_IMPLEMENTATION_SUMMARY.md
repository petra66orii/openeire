# OpenEire SEO Implementation Summary

## What changed in the backend repo

- `../openeire-api/openeire_api/site_views.py`
  - `robots.txt` now allows crawling of public content while disallowing backend utility surfaces such as `/api/`, `/accounts/`, `/admin/`, and `/summernote/`.
  - `robots.txt` continues to reference the backend sitemap index.
- `../openeire-api/openeire_api/sitemaps.py`
  - Backend sitemap generation remains the crawl/index source of truth.
  - Only real public frontend URLs are emitted.
  - Sitemap sections currently exposed:
    - static pages
    - published blog posts
    - printable physical photo/product pages
- `../openeire-api/openeire_api/tests.py`
  - Updated robots and sitemap tests to match the new indexability policy.

## What changed in the frontend repo

- `openeire/index.html`
  - Removed the hard-coded GA snippet.
  - Removed conflicting base page description metadata.
  - Reduced base HTML to safe defaults only.
- `openeire/public/robots.txt`
  - Keeps the public-site robots policy for the React host.
  - Disallows utility/auth/checkout/gated routes.
  - Points sitemap discovery at the backend sitemap index.
- `openeire/src/components/SEOHead.tsx`
  - Acts as the single frontend source of truth for page titles, descriptions, robots, canonical URLs, Open Graph tags, Twitter tags, and JSON-LD.
  - Added structured-data support.
- `openeire/src/lib/seoSchema.ts`
  - Shared JSON-LD builders for:
    - Organization
    - WebSite
    - BreadcrumbList
    - Article
    - Product
    - VisualArtwork
- `openeire/src/pages/HomePage.tsx`
  - Rebalanced homepage metadata toward fine art prints and commercial licensing.
  - Added Organization and WebSite schema.
- `openeire/src/pages/LicensingOverviewPage.tsx`
  - Added the main commercial licensing overview page at `/licensing`.
  - Keeps the licensing journey buyer-friendly and conversion-focused.
  - Refined the hero copy and CTA wording so the overview page reflects the asset-first request flow.
- `openeire/src/pages/ArtPrintsPage.tsx`
  - Added a dedicated indexable landing page for premium print intent.
  - Links naturally into the physical gallery and contact pages.
- `openeire/src/pages/GalleryPage.tsx`
  - Improved gallery metadata and commercial wording.
  - Physical gallery metadata now supports stronger print intent.
  - Added BreadcrumbList schema for indexable gallery routes.
- `openeire/src/pages/ProductDetailPage.tsx`
  - Added Product schema for physical print pages.
  - Added VisualArtwork schema for physical print pages where truthful.
  - Added BreadcrumbList schema for physical product detail pages.
  - Digital product pages remain noindex.
- `openeire/src/pages/BlogListPage.tsx`
  - Improved journal metadata.
  - Added BreadcrumbList schema for the main journal index.
- `openeire/src/pages/BlogDetailPage.tsx`
  - Added BreadcrumbList schema.
  - Added Article schema.
  - Set breadcrumb titles from loaded post data.
- `openeire/src/pages/AboutPage.tsx`
  - Updated metadata for drone photography / fine art print positioning.
  - Added BreadcrumbList schema.
- `openeire/src/pages/ContactPage.tsx`
  - Updated metadata for print, licensing, and commission intent.
  - Added BreadcrumbList schema.
- `openeire/src/pages/LicensingPage.tsx`
  - Reframed as the legal licensing terms page at `/licensing/terms`.
  - Added `noindex` and a link back to the commercial overview.
  - Added BreadcrumbList schema.
- `openeire/src/components/HeroSection.tsx`
  - Updated the homepage licensing CTA to `Explore Licensing` so it points to the overview page without implying a direct request flow.
- `openeire/src/components/ErrorPageLayout.tsx`
  - Error pages now receive `noindex` metadata centrally.
- `openeire/src/pages/CheckoutPage.tsx`
- `openeire/src/pages/CheckoutSuccessPage.tsx`
- `openeire/src/pages/ShoppingBagPage.tsx`
- `openeire/src/pages/ProfilePage.tsx`
- `openeire/src/pages/LoginPage.tsx`
- `openeire/src/pages/RegisterPage.tsx`
- `openeire/src/pages/LogoutPage.tsx`
- `openeire/src/pages/RequestPasswordResetPage.tsx`
- `openeire/src/pages/ConfirmPasswordResetPage.tsx`
- `openeire/src/pages/VerificationPendingPage.tsx`
- `openeire/src/pages/VerificationStatusPage.tsx`
- `openeire/src/pages/GalleryGatePage.tsx`
  - Added explicit `noindex` metadata to utility, auth, checkout, profile, and gated routes.

## Source of truth

- Robots policy for the React public site:
  - `openeire/public/robots.txt`
- Backend crawl/index infrastructure and sitemap index:
  - `../openeire-api/openeire_api/site_views.py`
  - `../openeire-api/openeire_api/sitemaps.py`
- Route-level page metadata:
  - `openeire/src/components/SEOHead.tsx`
- Canonical URL helpers:
  - `openeire/src/config/site.ts`
- Structured data builders:
  - `openeire/src/lib/seoSchema.ts`

## Intentionally indexable pages

- `/`
- `/art-prints`
- `/gallery`
- `/gallery/physical`
- `/gallery/physical/:id`
- `/blog`
- `/blog/:slug`
- `/about`
- `/contact`
- `/licensing`
- `/terms`
- `/shipping`
- `/refunds`
- `/privacy`

## Intentionally non-indexable pages

- `/bag`
- `/checkout`
- `/checkout-success`
- `/profile`
- `/login`
- `/register`
- `/logout`
- `/request-password-reset`
- `/password-reset/confirm/:token`
- `/verify-pending`
- `/verify-email/confirm/:token`
- `/gallery-gate`
- `/licensing/terms`
- `/gallery/digital`
- `/gallery/photo`
- `/gallery/video`
- `/403`
- `/404`
- `/500`

## Limitations still remaining

- Digital gallery and digital product detail pages are intentionally noindex because access is gated.
- The backend sitemap currently only includes public pages that are truly canonical and SEO-ready today.
- The dedicated `/art-prints` page is now included in the backend sitemap and acts as the primary print-intent landing page.
- No FAQ schema or review schema was added, because the site does not expose a safe, verified source of truth for those claims yet.
- The build environment in this session did not successfully complete a frontend production build, so the final validation here is limited to diff checks and targeted code review.

## Recommended next SEO/content moves

1. Expand blog content around commercial intent keywords:
   - drone footage Ireland
   - aerial stock footage Ireland
   - cinematic stock footage Ireland
   - fine art prints Ireland
2. Add a few dedicated landing pages for high-intent commercial queries if they are genuinely useful and non-duplicative.
3. Add more internal links from blog posts to gallery, licensing, and print pages using descriptive anchors.
4. Keep updating blog post Article schema with strong featured images and clear publication dates.
5. Add a small FAQ section to licensing or contact pages if it helps answer buyer objections without adding thin content.

