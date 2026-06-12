# OpenÉire Studios Route Inventory

This inventory reflects the current React + Vite router in `openeire/src/App.tsx`.
PR 2 does not migrate any of these routes; it only prepares the parallel Next.js app.

## Public Marketing Pages

| Route | Current page | Shape | Next candidate |
| --- | --- | --- | --- |
| `/` | `HomePage` | Static with lazy testimonial data | Server Component shell with small client islands |
| `/about` | `AboutPage` | Static | Server Component |
| `/art-prints` | `ArtPrintsPage` | Static landing | Server Component |
| `/footage` | `FootageLandingPage` | Static landing with FAQ schema | Server Component |
| `/licensing` | `LicensingOverviewPage` | Static landing | Server Component |
| `/real-estate` | `RealEstatePage` | Static landing plus enquiry form | Server Component shell with client form island |
| `/contact` | `ContactPage` | Public form | Client Component form inside Server Component page |

## Public SEO Pages

| Route | Current page | Shape | Next candidate |
| --- | --- | --- | --- |
| `/faq` | `FAQIndexPage` | Static | Server Component |
| `/faq/art-prints` | `ArtPrintsFAQPage` | Static FAQ schema | Server Component |
| `/faq/drone-footage-licensing` | `DroneFootageLicensingFAQPage` | Static FAQ schema | Server Component |
| `/faq/drone-footage-usage` | `DroneFootageUsageFAQPage` | Static FAQ schema | Server Component |
| `/us/fine-art-prints` | `USFineArtPrintsPage` | Static US SEO page | Server Component |
| `/us/wall-art-prints` | `USWallArtPrintsPage` | Static US SEO page | Server Component |
| `/us/aerial-photography-prints` | `USAerialPhotographyPrintsPage` | Static US SEO page | Server Component |
| `/us/landscape-wall-art` | `USLandscapeWallArtPage` | Static US SEO page | Server Component |
| `/us/large-wall-art` | `USLargeWallArtPage` | Static US SEO page | Server Component |
| `/us/wall-art-for-living-room` | `USWallArtForLivingRoomPage` | Static US SEO page | Server Component |
| `/us/wall-art-for-office` | `USWallArtForOfficePage` | Static US SEO page | Server Component |
| `/terms` | `TermsAndConditions` | Static legal | Server Component |
| `/shipping` | `ShippingPolicy` | Static legal | Server Component |
| `/refunds` | `RefundPolicy` | Static legal | Server Component |
| `/privacy` | `PrivacyPolicy` | Static legal | Server Component |
| `/cookie-policy` | `PrivacyPolicy` | Static legal alias | Server Component |

## Blog Pages

| Route | Current page | Shape | Next candidate |
| --- | --- | --- | --- |
| `/blog` | `BlogListPage` | Dynamic list via `getBlogPosts` | Server Component with fetch revalidation |
| `/blog/:slug` | `BlogDetailPage` | Dynamic article, comments, likes | Server Component article plus client comments/likes |

## Photo, Video, And Gallery Pages

| Route | Current page | Shape | Next candidate |
| --- | --- | --- | --- |
| `/gallery` | `GalleryPage` | Dynamic public listing | Client Component candidate until filters/swiper are split |
| `/gallery/physical` | `GalleryPage` | Dynamic public physical listing | Client Component candidate |
| `/gallery/physical/:id` | `ProductDetailPage` | Dynamic public product detail | Server Component candidate with client purchase/review islands |
| `/gallery/digital` | `GalleryPage` behind `GalleryGuard` | Protected dynamic listing | Client Component candidate, later protected route group |
| `/gallery/photo` | `GalleryPage` behind `GalleryGuard` | Protected dynamic listing | Client Component candidate |
| `/gallery/video` | `GalleryPage` behind `GalleryGuard` | Protected dynamic listing | Client Component candidate |
| `/gallery/photo/:id` | `ProductDetailPage` behind `GalleryGuard` | Protected dynamic detail | Client Component candidate until auth/access strategy is ported |
| `/gallery/video/:id` | `ProductDetailPage` behind `GalleryGuard` | Protected dynamic detail | Client Component candidate until auth/access strategy is ported |
| `/gallery-gate` | `GalleryGatePage` | Public access-code form | Client Component |

## Checkout Pages

| Route | Current page | Shape | Next candidate |
| --- | --- | --- | --- |
| `/bag` | `ShoppingBagPage` | Cart state and recommendations | Client Component |
| `/checkout` | `CheckoutPage` | Stripe Elements, payment intent creation | Client Component only; do not migrate in early phases |
| `/checkout-success` | `CheckoutSuccessPage` | Post-payment client analytics/context | Client Component |

## Auth Pages

| Route | Current page | Shape | Next candidate |
| --- | --- | --- | --- |
| `/register` | `RegisterPage` | Public form | Client Component |
| `/login` | `LoginPage` | Public form/social auth | Client Component |
| `/logout` | `LogoutPage` | Client auth side effect | Client Component |
| `/request-password-reset` | `RequestPasswordResetPage` | Public form | Client Component |
| `/password-reset/confirm/:token` | `ConfirmPasswordResetPage` | Token form | Client Component |
| `/verify-pending` | `VerificationPendingPage` | Static/account state | Client Component |
| `/verify-email/confirm/:token` | `VerificationStatusPage` | Token action | Client Component |

## Account Pages

| Route | Current page | Shape | Next candidate |
| --- | --- | --- | --- |
| `/profile` | `ProfilePage` behind `ProtectedRoute` | Authenticated account dashboard | Client Component |

## Admin / Staff Pages

| Route | Current page | Shape | Next candidate |
| --- | --- | --- | --- |
| `/staff/uploads/videos` | `StaffVideoUploadsPage` behind `StaffRoute` | Staff-only upload workflow | Client Component; migrate late |

## Error Pages

| Route | Current page | Shape | Next candidate |
| --- | --- | --- | --- |
| `/403` | `ForbiddenPage` | Static error | Server Component |
| `/404` | `NotFoundPage` | Static error | Next `not-found.tsx` later |
| `/500` | `ServerErrorPage` | Static error | Next error boundary later |
| `*` | `NotFoundPage` | Catch-all | Next `not-found.tsx` later |
