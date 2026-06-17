# PR 8 Product Reviews Audit

## Existing Vite implementation

- Components: `ReviewForm.tsx`, `ProductReviewList.tsx`, `ReviewCard.tsx`, and `StarRating.tsx`.
- Product detail integration: review sections render below product purchase/detail content.
- API helpers: `getProductReviews(productType, productId)` and `submitProductReview(productType, productId, data)`.
- Product types used by the Vite review API are `photo` and `video`; the backend also accepts `product`.
- Payload shape for submission: `{ rating: number, comment?: string }`.
- Public review fields: `id`, `user`, `rating`, `comment`, `created_at`, and optional `admin_reply`.
- The Vite UI validates that a rating is selected, prevents duplicate pending submits, shows a login prompt for unauthenticated users, and shows a moderation success message after submit.

## Backend endpoint contract

- Route: `GET/POST /api/<product_type>/<pk>/reviews/`.
- Backend URL name: `review_list_create`.
- Supported `product_type` values: `photo`, `video`, and `product`.
- `GET` is public and returns only `approved=True` reviews ordered newest first.
- `POST` requires authentication through the existing bearer-token auth flow.
- Duplicate reviews by the same user for the same product are blocked by serializer validation.
- Newly created reviews default to pending moderation and are not included in the public list until approved.
- Backend validation remains the source of truth for rating bounds, duplicate review checks, and object availability.

## Next.js implementation notes

- API helpers live in `lib/api/reviews.ts` and use the existing native fetch client.
- Review UI lives in `components/reviews/`.
- The migrated public physical product page wires reviews with `productType="photo"` because `products/<id>/` returns the public physical `Photo` detail payload.
- Approved reviews are fetched server-side for useful initial HTML.
- Authenticated submission is client-side via the PR 7 auth provider and bearer-token fetch client.
- Submitted reviews are shown locally as `Pending approval`; they are not included in server HTML or structured data until approved by the backend.

## Structured data

- `aggregateRating` is emitted only when real `average_rating` and `review_count` values exist.
- `review` entries are emitted only from real approved reviews returned by the public backend endpoint.
- Pending local reviews are never included in JSON-LD.

## Deferred integration

- Private `photo` and `video` detail pages are still behind gallery-access placeholders in this migration stage.
- Once those detail pages are fully migrated, reuse the same review components with `productType="photo"` or `productType="video"`.
- No auth, gallery, checkout, Stripe, Prodigi, or backend endpoint contracts were changed in this PR.
