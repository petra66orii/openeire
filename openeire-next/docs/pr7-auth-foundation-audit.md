# PR 7 Authentication Foundation Audit

> Historical migration record. Current behaviour is defined by the active
> `openeire-next` source and tests.

## Existing Vite Auth Flow

- Tokens are stored in `sessionStorage` as `accessToken` and `refreshToken`.
- Legacy tokens in `localStorage` are migrated once into `sessionStorage` and then removed.
- Logout is client-side only: clear tokens, clear user state, clear gallery access intent, then route away.
- Authenticated API requests send `Authorization: Bearer <accessToken>`.
- Login posts to `auth/login/` with `{ username, password }`.
- Registration posts to `auth/register/` with `{ username, email, password }`.
- Profile reads use `auth/profile/`.
- Email verification posts to `auth/verify-email/confirm/` with `{ token }`.
- Password reset request posts to `auth/password/reset/` with `{ email }`.
- Password reset confirmation posts to `auth/password/reset/confirm/` with `{ password, confirm_password, token }`.
- Verification email resend posts to `auth/resend-verification/` with `{ email }`.

## Gallery Access Intent

Vite stores gallery verification intent in `sessionStorage`:

- `galleryRequestedEmail`
- `pendingGalleryAccessCode`
- `pendingGalleryRedirect`

The Next auth foundation preserves these keys and clears them during logout.

## Next Implementation

- `components/auth/AuthProvider.tsx` restores auth state, migrates legacy tokens, fetches the profile, and exposes login/register/logout helpers.
- `lib/api/client.ts` attaches bearer tokens for browser requests and retries safe requests once after refreshing an expired access token.
- `components/auth/ProtectedRoute.tsx` provides client-side protected route gating for future account/staff/gallery migrations.
- Public auth routes now exist for login, registration, verification pending, email verification confirmation, password reset request, password reset confirmation, and logout.
- The shared navbar now reflects authenticated state with `Profile` and `Logout` links.

## Auth Review Follow-Up

- Refresh retry is limited to safe HTTP methods (`GET`, `HEAD`, `OPTIONS`) by default to avoid replaying non-idempotent mutations after a token refresh.
- Future callers can opt in with `retryOnAuthRefresh` only when a mutation is known to be idempotent.
- Failed refresh requests only clear tokens when the backend explicitly rejects the refresh token (`401`/`403`) or returns a malformed successful payload. Transient network errors leave the existing session state intact.
- The shared refresh promise is created synchronously before network work starts, so concurrent `401` responses share one refresh call in the browser event loop.
- CSRF protection is not relied on for this token flow because bearer tokens are read from `sessionStorage` and sent via the `Authorization` header, not automatically attached cookies.

## Refresh Token Assumption

The Vite app did not call a refresh endpoint directly. The Next fetch client assumes the backend exposes the standard SimpleJWT refresh endpoint:

```text
auth/token/refresh/
```

If the backend uses a different refresh route, update `lib/api/auth.ts` and `lib/api/client.ts` before migrating authenticated account/gallery flows.

## Authentication Requirements For Future PRs

- Product review submission requires an authenticated user and must wait for the full auth/client boundary.
- Account/profile pages should use `ProtectedRoute`.
- Staff pages should use `ProtectedRoute staffOnly`.
- Gallery access pages should use this auth context plus the existing backend gallery access truth.
- Checkout and Stripe flows are intentionally untouched in this PR.

## Known Gaps

- Google social login was intentionally deferred from PR 7 because the Vite app used `@react-oauth/google`, and that auth-foundation PR did not add new auth dependencies.
- `/profile` is not migrated yet; successful login keeps the production redirect target for parity, but the page itself belongs to a later account PR.
- There is no dedicated test script in `openeire-next` yet, so auth validation is currently covered by lint/build and manual browser checks.

## Manual Checks

- Visit `/login`, submit invalid credentials, and confirm a safe error message appears.
- Visit `/login`, use a valid account, and confirm tokens are stored in `sessionStorage`.
- Confirm the navbar switches from `Login/Get Started` to `Profile/Logout`.
- Visit `/logout`, confirm logout clears `sessionStorage` tokens and gallery intent.
- Visit `/request-password-reset` and confirm the backend accepts the email payload.
- Visit an email verification link and confirm the token is posted to the existing backend endpoint.
