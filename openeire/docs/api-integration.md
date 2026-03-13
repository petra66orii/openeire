# API Integration

## API Base URL and Media URL

Backend URL configuration is centralized in:
- `src/config/backend.ts`

Key behavior:
- `API_BASE_URL`
  - Source: `import.meta.env.VITE_API_BASE_URL`
  - Default fallback: `/api/`
  - Normalization handles:
    - absolute URLs (for example `https://api.example.com/api/`)
    - relative values (for example `/api/`)
- `MEDIA_BASE_URL`
  - Source: optional `VITE_MEDIA_BASE_URL`
  - If not provided and API base is absolute, media defaults to API origin.
  - Used by `resolveMediaUrl(assetPath)` for image/video URL resolution.

## Service Layer Files

- `src/services/api.ts`
  - Exports axios instance (`api`).
  - Defines request/response interceptors.
  - Defines typed DTOs and endpoint methods.
- `src/config/backend.ts`
  - API/media base URL normalization and derivation.
- `src/utils/apiPath.ts`
  - Normalizes endpoint path strings.
- `src/utils/errorRouting.ts`
  - Event-based router integration for global API error navigation.

## HTTP Client and Request Pattern

- Library: `axios`
- Default headers:
  - `Content-Type: application/json`
- Pattern:
  - Page/component calls typed service function from `src/services/api.ts`.
  - Service function returns typed data or throws backend error payload.

Examples of domain groups in `api.ts`:
- Auth: `loginUser`, `registerUser`, `verifyEmail`, password reset.
- Profile/account: `getProfile`, `updateProfile`, `changeEmail`, `deleteAccount`.
- Gallery/products: `getGalleryProducts`, `getProductDetail`, reviews.
- Checkout: payment intent flow integration endpoints.
- Blog: list/detail/likes/comments.
- Contact/licensing/newsletter.

## Authentication Method

### User Auth Token
- Request interceptor reads access token from `sessionStorage`:
  - key: `accessToken`
- Header applied:
  - `Authorization: Bearer <token>`

### Gallery Access Token
- Stored separately in `localStorage` as `gallery_access`.
- Request interceptor conditionally adds:
  - `X-Gallery-Access-Token: <code>`
- Scope is path-restricted to gallery/digital endpoints only:
  - `photos/*`, `videos/*`, `gallery/*`
- Also guarded by same-origin checks for absolute URLs.

## Error Handling Strategy

1. Endpoint-level handling
- Most service methods catch axios errors and throw backend response payload for UI handling.

2. Global interceptor handling
- GET request failures can trigger route-level error pages via `emitErrorRoute`:
  - `403` -> `/403` (except scoped gallery endpoints)
  - `5xx` -> `/500`

3. UI-level handling
- Forms and pages display toast or inline error states using returned payload details.

## Configuration Required

Backend contracts are assumed by this frontend for:
- Authentication endpoints and JWT payload shape (`access`, `refresh`).
- Checkout payment intent contract (`clientSecret`, optional `shippingCost`).
- Gallery access verification/session payload (`gallery_access` shape with `code` and expiry handling in guard flow).

If backend contracts differ, update service method payload/response types in `src/services/api.ts` and dependent UI logic.
