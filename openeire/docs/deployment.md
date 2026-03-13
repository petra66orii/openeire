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
- Google OAuth client configuration (frontend currently uses a client ID in `src/main.tsx`).
- Cache strategy and CDN invalidation policy.
