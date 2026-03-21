# Deployment Guide

## Build Command

From the frontend root (`openeire/`):

```bash
npm install
npm run build
```

Optional quality gates before release:

```bash
npm run lint
npx tsc --noEmit
npm run test
```

## Environment Variables

Configure these values in your deployment environment:

- `VITE_API_BASE_URL`
  - Example: `https://api.yourdomain.com/api/`
  - If omitted, frontend defaults to `/api/`.
- `VITE_MEDIA_BASE_URL` (optional)
  - Example: `https://api.yourdomain.com`
  - Needed when media is served from a different origin/path than API defaults.
- `VITE_STRIPE_PUBLIC_KEY`
  - Stripe publishable key for checkout.
- `VITE_GOOGLE_CLIENT_ID`
  - Google OAuth client ID for login/register social sign-in.
  - If omitted, Google sign-in is disabled in the frontend.

## Production Build Output

- Output directory: `dist/`
- Deploy `dist/` as static assets via CDN or static web host.

## Hosting Setup Assumptions

This frontend assumes:
- Static hosting for built assets.
- SPA route fallback enabled to `index.html` for client-side routes.
- Backend API reachable at `VITE_API_BASE_URL` (or `/api/` relative path).
- Media assets reachable either:
  - from same origin/API-derived origin, or
  - from explicit `VITE_MEDIA_BASE_URL`.

## Reverse Proxy and Backend Integration

In local development (`vite.config.js`), the dev server proxies:
- `/api` -> `http://127.0.0.1:8000`
- `/media` -> `http://127.0.0.1:8000`

In production, this proxy is not used. Equivalent routing must be handled by:
- your reverse proxy, or
- your `VITE_API_BASE_URL` / `VITE_MEDIA_BASE_URL` configuration.

## Required Backend Configuration

Frontend deployment depends on backend runtime settings being aligned:

- API path prefix:
  - Backend routes are exposed under `/api/`.
- CORS and trusted origins:
  - Frontend production origin must be allowed by backend CORS and origin trust settings.
- Auth mode:
  - Frontend currently uses JWT bearer token headers from login responses.
  - If backend is switched to HttpOnly cookie-only mode, frontend needs client updates (`withCredentials` + CSRF support) before release.
- Gallery token flow:
  - Backend must accept `X-Gallery-Access-Token` for digital gallery/photo/video endpoints.
- Media hosting:
  - If backend media is hosted on a different origin, configure `VITE_MEDIA_BASE_URL` accordingly.
- Checkout:
  - Backend Stripe configuration must be valid for `checkout/create-payment-intent/` and webhook processing, otherwise frontend checkout will fail.

## Deployment Checklist

1. Set production env variables.
2. Build frontend with `npm run build`.
3. Publish `dist/` to host.
4. Verify:
   - Auth login/profile flow
   - Gallery gate + digital routes
   - Product detail + cart
   - Checkout (Stripe Elements initialization)
   - Blog detail rendering and comments
   - 403/500 route behavior on backend errors

## Configuration Required

The following production concerns are outside this repository and must be configured per environment:
- CORS policy on backend for frontend origin.
- HTTPS/TLS termination.
- Stripe webhook/backend payment processing setup.
- Google OAuth client configuration aligned with `VITE_GOOGLE_CLIENT_ID`.
- Cache strategy and CDN invalidation policy.
