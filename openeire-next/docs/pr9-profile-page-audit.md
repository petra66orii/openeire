# PR 9 Profile Page Audit

> Historical migration record. Current behaviour is defined by the active
> `openeire-next` source and tests.

## Existing Vite profile behaviour

- Route: `/profile`, protected by the existing React auth context.
- Page tabs: Profile & Shipping, Order History, Saved Items, and Security.
- Profile tab renders `EditProfileForm` with the current authenticated profile.
- Security tab includes account/security actions such as email/password/account flows.
- Order and saved-item sections depend on additional API areas that are not migrated in this PR.
- Staff users see an extra staff uploader entry point in the Vite page.

## Backend profile endpoint

- Route: `GET/PATCH /api/auth/profile/`.
- View: `UserProfileView`.
- Permissions: `IsAuthenticated`.
- This PR uses only `GET auth/profile/` through the existing PR 7 auth provider.
- Response fields exposed by `UserProfileSerializer`:
  - `username`
  - `first_name`
  - `last_name`
  - `email`
  - `is_staff`
  - `default_phone_number`
  - `default_street_address1`
  - `default_street_address2`
  - `default_town`
  - `default_county`
  - `default_postcode`
  - `country`
  - `can_access_gallery`
- Email verification status is not currently exposed by the profile response.

## Next.js implementation notes

- Route added at `app/profile/page.tsx`.
- The route is wrapped in `ProtectedRoute`, so authenticated content is not rendered while auth restoration is unresolved.
- Profile content lives in `components/profile/ProfilePageClient.tsx` and uses the existing `useAuth()` context.
- The profile page is marked `noindex`.
- Account-area navigation is prepared for Profile, Orders, Downloads, Licences, and Gallery Access.
- Only Profile is active in this PR; the other sections are disabled placeholders for future migrations.

## Account actions

- Logout uses the existing auth provider and clears session tokens.
- The login page keeps using `auth/resend-verification/` for users who cannot sign in yet.
- The profile page does not call `auth/resend-verification/` because authenticated profile users are already active/verified in the normal backend auth flow, and the backend intentionally returns the same generic success message for already-active users without sending an email.
- Password reset links to the existing Next password reset request page.

## Deferred work

- Profile editing is not implemented in this PR, even though `PATCH auth/profile/` exists.
- Orders, downloads, licences, gallery access management, saved items, and staff tools remain future PRs.
- No checkout, Stripe, Prodigi, gallery gate, review, backend, or database contracts changed.
