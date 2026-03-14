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

### Backend Auth Compatibility
- Current frontend behavior is JWT header mode:
  - Expects `POST /api/auth/login/` and `POST /api/auth/google/` to return `access` and `refresh`.
  - Sends `Authorization: Bearer <access>` on authenticated requests.
- Backend may support HttpOnly cookie mode, but this frontend is not currently configured for cookie auth-only flow:
  - `withCredentials` is not globally enabled on the axios client.
  - CSRF cookie/header handling for auth-protected writes is not implemented in this client.

## Error Handling Strategy

1. Endpoint-level handling
- Most service methods catch axios errors and throw backend response payload for UI handling.

2. Global interceptor handling
- GET request failures can trigger route-level error pages via `emitErrorRoute`:
  - `403` -> `/403` (except scoped gallery endpoints)
  - `5xx` -> `/500`

3. UI-level handling
- Forms and pages display toast or inline error states using returned payload details.

## Backend Endpoint Contracts Used by Frontend

- Auth:
  - `POST auth/register/`
  - `POST auth/login/`
  - `POST auth/google/`
  - `POST auth/verify-email/confirm/`
  - `POST auth/resend-verification/`
  - `POST auth/password/reset/`
  - `POST auth/password/reset/confirm/`
  - `PUT auth/password/change/`
  - `GET/PATCH auth/profile/`
  - `DELETE auth/delete/`
  - `GET auth/countries/`
- Gallery/products:
  - `GET gallery/`
  - `POST gallery-request/`
  - `POST gallery-verify/`
  - `GET photos/:id/`
  - `GET videos/:id/`
  - `GET products/:id/`
  - `GET products/recommendations/`
  - `GET products/download/:type/:id/`
  - `GET/POST :productType/:id/reviews/`
  - `POST license-requests/`
- Checkout:
  - `POST checkout/create-payment-intent/`
  - `GET checkout/order-history/`
- Blog:
  - `GET blog/`
  - `GET blog/:slug/`
  - `POST blog/:slug/like/`
  - `GET/POST blog/:slug/comments/`
  - `GET blog/liked/`
- Home:
  - `GET home/testimonials/`
  - `POST home/newsletter-signup/`
  - `POST home/contact/`

## Configuration Required

Backend contracts are assumed by this frontend for:
- Authentication endpoints and JWT payload shape (`access`, `refresh`).
- Checkout payment intent contract (`clientSecret`, optional `shippingCost`).
- Gallery access verification/session payload (`gallery_access` shape with `code` and expiry handling in guard flow).
- API base path prefix (`/api/`) and endpoint paths above.
- CORS/trusted-origin settings that allow this frontend host.

If backend contracts differ, update service method payload/response types in `src/services/api.ts` and dependent UI logic.
