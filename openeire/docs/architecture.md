# Frontend Architecture

## Application Structure
The app is a React SPA bootstrapped in `src/main.tsx` and routed in `src/App.tsx`.

Primary layers:
- `src/pages`: Route-level screens.
- `src/components`: Reusable UI/feature building blocks.
- `src/services`: API service layer and request/response behavior.
- `src/context`: Shared application state (auth, cart, breadcrumb metadata).
- `src/config`: Backend/media base URL normalization and resolution.
- `src/utils`: Shared utility logic and cross-cutting helpers.

## Routing Approach
Routing uses `react-router-dom` with `BrowserRouter`.

`src/App.tsx` defines:
- Public routes: home, auth, blog, contact, licensing, public gallery/physical detail, error pages.
- Gallery-guarded routes: digital gallery and digital product detail routes wrapped by `GalleryGuard`.
- Auth-protected route: profile wrapped by `ProtectedRoute`.
- Shared app shell around routes: `Navbar`, `Breadcrumbs`, `Footer`, `BackToTop`.

## Component Hierarchy
High-level tree:

```text
main.tsx
  GoogleOAuthProvider
    QueryClientProvider
      BrowserRouter
        AppErrorBoundary
          AuthProvider
            CartProvider
              App
                BreadcrumbProvider
                  Navbar
                  Breadcrumbs
                  Routes(...)
                  BackToTop
                  Footer
```

Feature examples:
- Gallery page composes `VisualCategoryHero`, `MinimalToolbar`, and virtualized `ProductCard` rendering.
- Product detail composes review components (`ReviewForm`, `ProductReviewList`) and `RelatedProducts`.
- Checkout composes `OrderSummary` + `CheckoutForm` with Stripe `Elements`.

## API Service Layer
`src/services/api.ts` centralizes:
- Axios client setup (`api`) with `baseURL` from `src/config/backend.ts`.
- Request interceptor for auth + scoped gallery token headers.
- Response interceptor that emits global error route events for selected GET failures.
- Typed endpoint helper functions grouped by domain (auth, profile, gallery, products, reviews, blog, checkout, contact, licensing).

## State Management Approach
This codebase uses a mix of:
- React Context:
  - `AuthContext`: auth/session + profile refresh.
  - `CartContext`: cart persistence/sanitization + totals + cart mutations.
  - `BreadcrumbContext`: dynamic breadcrumb titles.
- Local component state for form, modal, and page-level interactions.
- TanStack Query for selected data-fetch flows (for example testimonials and order history).

## Styling System
- Tailwind CSS is enabled through `@tailwindcss/vite`.
- `src/index.css` defines theme tokens (`@theme`) for brand colors, fonts, and animations.
- Components are primarily styled with utility classes.
- A small set of global utility classes and keyframes are defined centrally.

## Request Flow
```text
User -> React UI -> Service Layer (axios in src/services/api.ts) -> Backend API
```

Expanded:
1. User interaction updates local/context state.
2. Page/component invokes a typed API function from `src/services/api.ts`.
3. Axios interceptor applies auth/gallery headers as needed.
4. Backend responds with data or error.
5. UI updates state, renders success, or routes to standard error pages (`/403`, `/500`) for selected cases.
