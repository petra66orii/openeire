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
3. Describe the public scope shown rather than applying a historical package
   label. Package contents and names may change over time.
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
`public/`. Do not commit camera originals, delivery archives or video masters.
The Next.js image configuration currently permits only the OpenÉire API and
media hosts.

Recommended exports:

- photographs: AVIF or WebP where the pipeline supports it, with JPEG fallback
  when needed; retain a long edge suitable for the displayed size and compress
  for the web;
- hero photographs: 2400-2560 pixels on the long edge;
- gallery photographs: 1800-2200 pixels on the long edge;
- use sRGB, remove GPS and unnecessary EXIF metadata, and target roughly
  200-500 KB per gallery image;
- poster: compressed WebP or JPEG matching the video's aspect ratio;
- floor plan: cleaned WebP, PNG or accessible PDF preview with all identifying
  address blocks removed unless separately approved.

Use descriptive filenames for distinct views and reserve the final `-v1`,
`-v2` segment for asset revisions. For example, prefer
`kitchen-island-v1.webp` and `kitchen-dining-v1.webp` for two different angles.
Existing approved objects named `kitchen-v1.webp` and `kitchen-v2.webp` remain
valid and do not need to be renamed.

Portfolio films are delivered by YouTube rather than directly from the media
bucket. Upload the best-quality 4K MP4 to the OpenÉire Studios YouTube channel,
allow embedding, and use either Public or Unlisted visibility as appropriate.
Wait for 4K processing to finish before publication.

Add only the 11-character YouTube video ID to `youtubeVideoId`, not a full
YouTube URL. Supply a locally controlled compressed poster for every video.
The portfolio renders that poster as a lightweight facade and does not contact
YouTube until the visitor presses Play. Playback then uses YouTube Privacy
Enhanced Mode through `youtube-nocookie.com`.

Recommended YouTube export:

- MP4 with H.264 High Profile and AAC audio at 48 kHz;
- 3840 x 2160 for landscape 4K, retaining the captured frame rate;
- variable bitrate, BT.709 for SDR footage, and web/fast-start enabled;
- 35-45 Mbps for 24/25/30 fps, or 53-68 Mbps for 48/50/60 fps.

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

## Before enabling a project

- a signed written portfolio/self-promotional approval from an authorised
  client or property representative;
- an approved general location and property-category description;
- confirmation of whether client credit is required;
- final approved image selections with alt text;
- web-sized image exports and a designated hero image;
- a processed, embeddable YouTube upload for each approved film;
- the 11-character YouTube video ID for each approved film;
- compressed poster images for each approved video;
- a redacted, web-sized floor-plan preview, if approved;
- the accurate package/scope wording and approved completion month;
- an internal, non-public permission reference for the catalogue.

The demonstrated-format cards are derived from authorised, published project
data. Photography formats require an actual hero or gallery image. Ground,
aerial and social video formats require their corresponding video fields, and
the floor-plan format requires an actual approved floor-plan image. Do not add
format fields merely to advertise services; the commercial package catalogue
is the authority for what OpenÉire sells.
