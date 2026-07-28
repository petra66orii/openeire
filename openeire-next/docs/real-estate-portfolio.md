# Real estate portfolio publishing guide

The public portfolio lives at `/real-estate/portfolio`. Its catalogue is
`lib/realEstatePortfolio.ts`. Rendering fails closed: a project is public only
when `published` and `portfolioPermissionConfirmed` are both `true` and
`permissionReference` contains a non-public internal reference.

## Permission and privacy requirements

Before adding any media, obtain a separate written approval that expressly
allows OpenÉire Studios to use the named project's photographs, films and any
floor plan for portfolio and self-promotional use. The approval should identify:

- the property or commissioned project;
- every media type approved for display;
- the public channels covered, including `openeire.ie`;
- whether an agent/client credit is required;
- any location wording or other restrictions;
- the approver's authority, name, date and written confirmation.

Copyright ownership, payment, prior listing publication and the standard client
licence are not portfolio permission. The current Property Media Service Terms,
Package Booking Agreement v1.3 and retainer template do not grant this use.

Store the approval in the restricted business record system. Put only a safe
internal approval reference in `permissionReference`. Never put an address,
Eircode, owner/vendor name, booking reference, access instruction, payment
detail or private communication in frontend code, filenames, alt text, captions
or metadata. Use a general location such as `County Galway`.

## Add and publish a project

1. Prepare a `RealEstatePortfolioProject` entry in
   `lib/realEstatePortfolio.ts` with `published: false` and
   `portfolioPermissionConfirmed: false`.
2. Add meaningful, non-identifying alt text and explicit pixel dimensions for
   every image. Omit video and floor-plan fields when those formats were not
   delivered or are not approved.
3. Verify the package name against the signed scope. For example, describe a
   Pro booking with a floor-plan add-on exactly that way, not as Premium.
4. Complete the privacy review and record the written approval.
5. Add the safe internal approval reference, set
   `portfolioPermissionConfirmed: true`, then set `published: true`.
6. Run the checks below and review the generated HTML for private identifiers.

To unpublish immediately, set either `published` or
`portfolioPermissionConfirmed` to `false`. The filter requires both flags plus
the reference, so omitted or incomplete permission data cannot render.

## Media delivery

Host public portfolio media on the existing approved OpenÉire media origin
(`https://media.openeire.ie`) or a local, intentionally web-sized asset in
`public/`. Do not commit camera originals, delivery archives or multi-gigabyte
video masters. The Next.js image configuration currently permits only the
OpenÉire API and media hosts.

Recommended exports:

- photographs: AVIF or WebP where the pipeline supports it, with JPEG fallback
  when needed; retain a long edge suitable for the displayed size and compress
  for the web;
- landscape film: H.264 MP4, 1920 x 1080, streaming-friendly bitrate and fast
  start;
- vertical cut: H.264 MP4, 1080 x 1920;
- poster: compressed WebP or JPEG matching the video's aspect ratio;
- optional WebM only when the existing media pipeline produces and serves it;
- floor plan: cleaned WebP, PNG or accessible PDF preview with all identifying
  address blocks removed unless separately approved.

Videos use native controls, do not autoplay, use `preload="none"` and attach
their source only near the viewport. Supply a compressed poster for every
video.

## Local checks

From `openeire-next`:

```powershell
npm.cmd run test
npm.cmd run lint
npm.cmd run typecheck
npm.cmd run build
git diff --check
```

Review the empty state and every enabled project at mobile, tablet and desktop
widths. Test the image viewer with keyboard-only input: opening, previous/next,
focus trapping, Escape to close and focus restoration. Confirm missing video or
floor-plan fields produce no empty section.

Search the production output for exact addresses and Irish Eircodes before
release. Historical booking data must never be imported into this catalogue.

## First real project: still required

- a signed written portfolio/self-promotional approval from an authorised
  client or property representative;
- an approved general location and property-category description;
- confirmation of whether client credit is required;
- final approved image selections with alt text;
- web-sized image exports and a designated hero image;
- H.264 landscape and vertical exports, if approved for display;
- compressed poster images for each approved video;
- a redacted, web-sized floor-plan preview, if approved;
- the accurate package/scope wording and approved completion month;
- an internal, non-public permission reference for the catalogue.
