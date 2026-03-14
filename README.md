# OpenEire Studios Frontend

## Overview
This repository contains the production React frontend for OpenEire Studios.  
It provides public content pages, gated digital gallery browsing, physical print browsing, shopping bag and checkout, user profile/account management, and a blog/comment experience.

## Tech Stack
- React 19 + TypeScript
- Vite 7
- Tailwind CSS 4 (via `@tailwindcss/vite`)
- React Router
- Axios for API communication
- TanStack Query (targeted use for selected queries)
- Stripe Elements (`@stripe/react-stripe-js`)
- Google OAuth (`@react-oauth/google`)
- Swiper (gallery hero carousel)
- Vitest + jsdom (frontend unit tests)

## Repository Structure
```text
openeire/
  public/                 # Static assets (favicons, hero/gallery media)
  src/
    assets/               # Bundled logos and static imports
    components/           # Reusable UI and feature components
    config/               # Backend/API/media URL normalization
    context/              # Auth, cart, breadcrumb context providers
    pages/                # Route-level page components
    services/             # API service layer (axios instance + endpoint functions)
    types/                # Shared type definitions
    utils/                # Utility helpers (sanitization, routing, purchase flow)
    App.tsx               # Main route map and app shell
    main.tsx              # App bootstrap + providers
    index.css             # Tailwind theme + global styles
  tests/                  # Vitest unit tests
  .env.example            # Required frontend environment variables
  vite.config.js          # Vite config + local dev proxy
```

## Key Directories
- `src/pages`: Route views for home, gallery, product detail, profile, checkout, blog, auth, and error pages.
- `src/components`: Shared UI and feature components used across pages.
- `src/services/api.ts`: Centralized API client, interceptors, DTOs/types, and endpoint methods.
- `src/config/backend.ts`: API/media base URL normalization and media URL resolution.
- `src/context`: Global state for auth, cart, and breadcrumb metadata.
- `tests`: Unit tests for URL config/path normalization, gallery token scoping, purchase flow, and HTML sanitization.

## Local Development Setup
1. Install dependencies:
   ```bash
   npm install
   ```
2. Create env file:
   ```bash
   cp .env.example .env
   ```
3. Start dev server:
   ```bash
   npm run dev
   ```
4. App runs on `http://localhost:5173` by default (configured in `vite.config.js`).

## Environment Variables
Defined in `.env.example`:

- `VITE_API_BASE_URL`  
  Base API URL. Supports relative (default behavior falls back to `/api/`) or absolute URLs.
  Backend routes are expected under the `/api/` prefix.

- `VITE_MEDIA_BASE_URL` (optional)  
  Media origin/path used by `resolveMediaUrl` when media is not served from API origin.

- `VITE_STRIPE_PUBLIC_KEY`  
  Stripe publishable key used to initialize Stripe Elements.

### Configuration Required
`src/main.tsx` currently contains a hardcoded Google OAuth client ID.  
If this should vary by environment, move it to a Vite env variable (for example `VITE_GOOGLE_CLIENT_ID`) and inject via `import.meta.env`.

## API Communication Overview
- Axios instance is defined in `src/services/api.ts`.
- `baseURL` comes from `src/config/backend.ts` (`API_BASE_URL`).
- Request interceptor attaches:
  - `Authorization: Bearer <token>` from `sessionStorage` token.
  - `X-Gallery-Access-Token` only for scoped gallery endpoints when a gallery session exists.
- Response interceptor routes GET request errors to app error pages:
  - `403` -> `/403` (except scoped gallery endpoints)
  - `5xx` -> `/500`

## Backend Configuration Requirements
For this frontend to work correctly in staging/production, backend configuration must satisfy:

- API prefix compatibility:
  - Backend endpoints are served under `/api/` (for example `/api/auth/login/`, `/api/gallery/`, `/api/checkout/create-payment-intent/`).
- CORS/trusted origins:
  - Frontend origin must be allowed by backend CORS and trusted-origin settings.
- Auth mode compatibility:
  - Current frontend expects JWT tokens in login/google-login responses and sends `Authorization: Bearer` on requests.
  - If backend enables HttpOnly JWT cookie mode, frontend requires additional `withCredentials` + CSRF integration changes.
- Digital gallery access:
  - Backend must accept `X-Gallery-Access-Token` on scoped digital endpoints (`gallery`, `photos`, `videos`).
- Media delivery:
  - If media is not served from the same origin as API/static host, set `VITE_MEDIA_BASE_URL` to the backend media origin.

## Build Instructions
- Lint:
  ```bash
  npm run lint
  ```
- Type-check:
  ```bash
  npx tsc --noEmit
  ```
- Unit tests:
  ```bash
  npm run test
  ```
- Production build:
  ```bash
  npm run build
  ```
- Preview production build locally:
  ```bash
  npm run preview
  ```

## Deployment Overview
- Build output is generated to `dist/`.
- Deploy `dist/` to a static host/CDN.
- Ensure runtime environment values are set for API/media/Stripe.
- Ensure backend CORS, auth, and checkout endpoints are available to this frontend origin.

Detailed deployment notes: `docs/deployment.md`.

## Maintainer
### Configuration Required
Set this section to your owning team/contact:
- Team name
- Primary on-call/contact channel
- Release owner/process
