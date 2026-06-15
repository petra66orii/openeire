# PR 5 Public Gallery Migration Audit

## Route Inventory

| Route | Vite Source | API | Next Strategy |
| --- | --- | --- | --- |
| `/gallery` | `src/pages/GalleryPage.tsx` | `GET /api/gallery/` | Redirects to `/gallery/physical` to preserve the public entry point without broadening catalogue exposure. |
| `/gallery/physical` | `src/pages/GalleryPage.tsx` | `GET /api/gallery/?type=physical` | Server-rendered public print listing with URL-backed collection/search/sort. |
| `/gallery/physical/:id` | `src/pages/ProductDetailPage.tsx` | `GET /api/products/:id/` | Server-rendered public physical print detail. |
| `/gallery/digital` | `GalleryGuard` + `GalleryPage` | `GET /api/gallery/?type=digital` returns `403` without access | Noindex access-required page; no protected API fetch. |
| `/gallery/photo` | `GalleryGuard` + `GalleryPage` | Protected gallery data | Noindex access-required page; no protected API fetch. |
| `/gallery/video` | `GalleryGuard` + `GalleryPage` | Protected gallery data | Noindex access-required page; no protected API fetch. |
| `/gallery/photo/:id` | `GalleryGuard` + `ProductDetailPage` | `GET /api/photos/:id/` returns `401` without auth | Noindex access-required page; no protected API fetch. |
| `/gallery/video/:id` | `GalleryGuard` + `ProductDetailPage` | `GET /api/videos/:id/` returns `401` without auth | Noindex access-required page; no protected API fetch. |

## Confirmed Public API Fields

`GET /api/gallery/?type=physical` returns public physical records with:

- `id`
- `title`
- `description`
- `collection`
- `preview_image`
- `starting_price`
- `product_type`
- `purchase_flows`
- `default_purchase_flow`

`GET /api/products/:id/` returns public physical detail records with:

- public preview image
- description/tags/collection
- physical print variants and prices
- public related products
- ratings summary
- purchase-flow labels

## Security Notes

- Digital listing and detail endpoints are not migrated as public pages because the live API returns `403`/`401` without gallery access.
- Next pages use public preview media fields only.
- No signed download URLs, delivery tokens, private master files, R2 object keys, Stripe values, Prodigi values, or staff upload fields are rendered.
- Cart, checkout, authenticated likes, reviews, and private gallery functionality remain out of scope for this PR.

## Canonical and Indexing

- `/gallery/physical` is the canonical indexable listing.
- Search-filtered listing URLs are `noindex, follow`.
- Collection filters canonicalize to `/gallery/physical` to avoid uncontrolled duplicate listing pages.
- Protected digital route shells are `noindex, nofollow`.
- Sitemap includes `/gallery/physical` and public `/gallery/physical/:id` URLs only.
