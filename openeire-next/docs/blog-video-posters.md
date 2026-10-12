# Video blocks in the Django blog editor

Blog content continues to be authored in Django admin (Summernote). Raw iframe
HTML remains blocked by the API and frontend sanitizers.

To insert a click-to-play YouTube player, paste a standalone linked-poster
paragraph into the editor's source view:

```html
<p><a href="https://www.youtube.com/watch?v=VIDEO_ID"
  title="OpenÉire video: landscape"><img
  src="https://media.openeire.ie/APPROVED_POSTER.webp"
  alt="Description of the approved video poster"
  width="1600" height="900">Descriptive video title</a></p>
```

Use `OpenÉire video: portrait` for a 9:16 player. Replace VIDEO_ID with the
actual 11-character ID. Standard watch URLs, Shorts URLs and youtu.be links
are supported. Poster sources must be local absolute paths or HTTPS URLs on
the existing API/media image origins. The API must allow the poster host in
BLOG_ALLOWED_IMAGE_HOSTS. Save as Draft and check the saved source markup.

Only explicitly marked paragraphs become players; ordinary links remain
links. Invalid or unsupported blocks remain linked posters. The existing
portfolio player loads YouTube only on a play action, includes the existing
consent integration and offers a direct YouTube link if playback fails.

Deploy the API image-allowlist configuration before importing a post using
external portfolio photos, otherwise source URLs may be removed on save.
Deploy the frontend renderer before reviewing the embedded players. Confirm
that the videos allow embedding; tests cannot establish external availability.
