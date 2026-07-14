# Legacy frontend removal — Phase 1

`openeire-next` is the sole active frontend. The `openeire` Vite/React directory
and repository-root Vite package files are retained only until Phase 2 removal
is explicitly approved.

## Package ownership

- `openeire-next/package.json` and `openeire-next/package-lock.json` belong to
  the active Next.js application and are used by CI.
- Repository-root `package.json` and `package-lock.json` describe a separate
  React 18/Vite 5 application and are legacy-only.
- `openeire/package.json` and `openeire/package-lock.json` belong exclusively to
  the nested legacy React 19/Vite 7 application.

The intended post-removal layout keeps the active application in
`openeire-next`. Moving it to the repository root would create unnecessary
deployment and history churn and is not part of Phase 2.

## Manual smoke-test checklist

Complete this checklist against the deployment candidate before approving
legacy removal.

### Authentication and account

- [ ] Register, verify email, sign in, sign out, and reset a password using email/password.
- [ ] Sign in with Google and confirm the configured redirect/origin succeeds.
- [ ] Edit profile and shipping details.
- [ ] Change password and exercise relevant security/account controls.

### Galleries and commerce

- [ ] Browse the physical gallery, open a product, choose options, and add it to the bag.
- [ ] Request and verify gallery access, then browse protected digital photos and videos.
- [ ] Open digital photo and video detail pages with valid access.
- [ ] Complete Stripe checkout and return through `/checkout-success`.
- [ ] Confirm order history displays the completed order.
- [ ] Confirm purchased downloads and licence documents are available.

### Community and operations

- [ ] Add and load blog comments.
- [ ] Like and unlike a blog post.
- [ ] Load approved product reviews and submit a review for moderation.
- [ ] As staff, start, complete, and verify a video upload.
- [ ] Submit the real-estate enquiry form and verify validation and success states.

### General

- [ ] Check desktop and mobile layouts for the flows above.
- [ ] Confirm there are no unexpected browser console errors.
- [ ] Confirm loading, empty, validation, and API error states remain usable.

## Phase 2 deletion boundary

After explicit approval, Phase 2 may delete:

- The complete `openeire/` legacy application directory.
- Repository-root `package.json` and `package-lock.json`.
- `SEO_IMPLEMENTATION_SUMMARY.md`, after any still-useful historical content is archived.

Do not delete `.github`, `openeire-next`, or repository-level Git metadata.
