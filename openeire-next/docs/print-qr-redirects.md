# Print QR destinations

The four stable URLs `/go/flyer`, `/go/portfolio-card`, `/go/office-drop`
and `/go/qr-sticker` return temporary HTTP 307 redirects to the public
`/real-estate/portfolio` page. The redirect adds `utm_medium=print`,
`utm_campaign=property_media` and the route slug as `utm_source`.
Unknown sources return 404. Request query parameters cannot override the
destination or attribution. Responses use `Cache-Control: private, no-store,
max-age=0` and `X-Robots-Tag: noindex, nofollow`.

Update the shared destination in `lib/printAttribution.ts` if the portfolio
location changes; keep the printed `/go/` URLs stable. A standard portfolio
card left in an office keeps its portfolio-card code. Use office-drop only
for the separately identified office version.

Portfolio service/enquiry links carry the approved campaign parameters into
the real-estate page, retaining any package query and enquiry anchor. Existing
consent-aware page views include the query string. Portfolio CTA events and a
`generate_lead` event after a successful enquiry include approved print-source
parameters. No cookies or browser storage are added. Events continue to depend
on analytics consent. Failed or invalid enquiries do not emit a lead event.

This is attribution for the direct portfolio-to-enquiry journey, not a unique
QR-scan counter. It does not persist attribution through unrelated navigation
or later visits. Successful form submissions also send the optional `print_source`
to the API, which stores it on the enquiry and exposes it as a read-only admin
field, list filter and internal notification field. This does not automatically
sync to the Notion CRM. The customer's how-heard answer is kept separate. Deploy
the API migration before this frontend change. No production test enquiries should
be sent merely to verify analytics. Configure/check GA reporting after deployment.

Before printing: verify all four live redirect responses and destinations on
desktop/mobile, check consent-aware analytics, generate actual deterministic QR
codes, decode-test each asset, add it to the chosen Canva design and scan a physical
proof. Review artwork still contains QR placeholders.
