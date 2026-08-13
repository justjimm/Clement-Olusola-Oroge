# Celebrating the Life of Clement Ayodeji Olusola Oroge

A static memorial website. No server, no database, no build step — it runs on
GitHub Pages' free tier exactly as it is.

---

## 1. Put it online (about 5 minutes)

1. On GitHub, create a new **public** repository. If you name it
   `<your-username>.github.io` the site lives at that address; any other name
   works too and gives you `https://<your-username>.github.io/<repo-name>/`.
2. Upload everything in this folder to the repository (drag and drop into
   **Add file → Upload files** works fine — keep the folder structure).
3. Go to **Settings → Pages**. Under *Build and deployment*, set
   **Source: Deploy from a branch**, **Branch: `main`**, **Folder: `/ (root)`**.
   Press **Save**.
4. Wait a minute, refresh, and GitHub shows the live address at the top of that
   page.

Every time you commit a change, the site rebuilds itself within a minute.

**Custom domain (optional).** Buy a domain, add a file called `CNAME`
containing just the domain name, and point the domain's DNS at GitHub. The
instructions are on the same Settings → Pages screen.

---

## 2. Things that still need filling in

Open **`assets/js/config.js`**. Everything a non-technical person would want to
change is in that one file, and each remaining gap is marked with a `←` arrow.

| What | Where | Status |
|---|---|---|
| Thanksgiving YouTube video ID | `events[2].youtubeId` | pending — links to the church channel search until the service is streamed |
| Family email / WhatsApp | `contribute.fallbackEmail`, `.whatsapp` | optional |

Everything else — all three venues, dates, times, RSVP numbers and the Google
Form — is filled in.

`mapQuery` can be any address or place name; it is passed straight to Google
Maps, so whatever you would type into the Maps search box will work.

---

## 3. Collecting tributes and media

The site has no server, so submissions go to a Google Form that drops
everything into the family's Google Drive. This is free and has no limit.

The form is already connected:
`assets/js/config.js` → `contribute.googleFormUrl`.

**Two things to check on the form itself**, at forms.google.com:

1. **Settings → Responses** — make sure it is *not* restricted to your
   organisation, or people outside it will see "you need permission".
2. It should have a **File upload** question so people can send photographs and
   video. Google requires anyone uploading a file to be signed in to a Google
   account; people writing text-only tributes do not need to sign in.

Then open the site in a private browsing window and check the form appears at
the bottom of the page. If it does not, go to **Send → link** in the form,
copy that address, and paste it over `googleFormUrl`.

To replace the form later, paste a different link in the same place. To turn
the form off and collect by email instead, blank out `googleFormUrl` and fill in
`fallbackEmail` and `whatsapp`.

---

## 4. Adding a tribute to the page

Tributes live in **`assets/js/data-tributes.js`**. Copy an existing block,
paste it at the bottom (before the final `];`) and fill it in:

```js
{
  id: "a-unique-name",          // lowercase, no spaces
  author: "Their Name",
  relation: "Niece",            // shown as the small gold label
  title: "A short heading",
  body: [
    "First paragraph.",
    "Second paragraph."
  ]
},
```

Rules of thumb:

- Each paragraph is its own line in quotes, separated by commas.
- If the text contains a double quote, write it as `\"`.
- `featured: true` pins one tribute to the top as the long, opening piece.
  Only one should have it.
- The card on the grid automatically shows the first real paragraph as a
  preview; the whole thing opens in a pop-up.

---

## 5. Adding photographs

1. Save the picture into `assets/photos/`. Any web format works (`.webp`,
   `.jpg`, `.png`).
2. Add a line to **`assets/js/data-photos.js`**:

```js
{ src: "assets/photos/my-photo.jpg", thumb: "assets/photos/my-photo.jpg",
  caption: "What is happening in the picture" },
```

`thumb` can be the same file as `src`. `w` and `h` are the large image's pixel
dimensions — they stop the page jumping about as photographs load; leave them
out if you don't know them.

Captions are deliberately switched off, because the family would rather show a
photograph with no caption than one with the wrong caption. If you know the
occasion or the people in a particular photograph, add `caption: "..."` to its
line and it will appear on hover and in the full-screen view.

**Keep files reasonably small.** GitHub Pages is free but has a soft limit of
1 GB per repository and 100 GB of traffic a month — nowhere near a problem for
a site like this, but photos straight off a phone are often 5 MB each and make
the page slow on Nigerian mobile data. Around 300 KB per photo is plenty.

---

## 6. Replacing the programmes

The PDFs live in `downloads/`. Overwrite them with the same filenames and
nothing else needs changing — the file size shown on the page is read from the
file itself.

To add a third programme, give the Thanksgiving event a `programme:` path in
`config.js` and it appears automatically. Anything else you want to offer —
the invitation image, an order of service, a photograph pack — goes in
`config.extraDownloads`.

---

## 7. The YouTube thumbnails

The three cards in the *Watch* section are real images in `assets/img/`
(`thumb-service-of-songs.webp`, `thumb-celebration-of-life.webp`,
`thumb-thanksgiving.webp`), not pulled from YouTube. Each event in `config.js`
points at one via `thumb:`. Remove that line and the site falls back to
YouTube's own thumbnail.

Full-size PNGs of all three are also good as the custom thumbnail on the
YouTube video itself (YouTube wants 1280×720, under 2 MB — these fit).

---

## 8. The music

A small player sits in the bottom-right corner playing *Unto Thee, O Lord*
(Maranatha Singers) — the hymn sung twice at the Service of Songs.

It **does not play by itself**. Browsers block sound that starts on its own,
and unexpected music on a memorial page is jarring, so a visitor has to press
play. To change the track, put a different YouTube video ID in
`config.music.videoId`. To remove it entirely, set `videoId: ""`.

---

## 9. What is in each file

```
index.html                  the page itself
assets/css/style.css        all the styling
assets/js/config.js         ← names, dates, venues, links (edit this)
assets/js/data-tributes.js  ← the tributes (edit this)
assets/js/data-photos.js    ← the gallery (edit this)
assets/js/app.js            the code that builds the page — no need to touch
assets/img/                 portrait, poster, and the three YouTube thumbnails
assets/photos/              gallery photographs
downloads/                  the programme PDFs and the invitation image
.nojekyll                   tells GitHub Pages to serve the files as they are
```

Nothing loads from a paid service. The only outside things the page uses are
Google Fonts, Google Maps embeds, and YouTube — all free and all optional; if
any of them is blocked, the page still works, it just looks plainer.
