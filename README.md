# Sendwave Africa

## What's in this package

The real app — `sendwave.jsx`, with profile creation, phone verification,
live currency conversion across 20+ African countries and 9 mobile-money
networks, and offline mode — is now actually wired up and buildable end to
end. Previously:

1. `index.html` was a disconnected static mockup that never loaded React or
   `sendwave.jsx`.
2. `capacitor.config.json` was saved as `capacitor_config.json` (underscore),
   which Capacitor silently ignores.
3. There was no `www/` folder, so Capacitor (which packages `webDir: "www"`
   into the native app) had nothing to ship — hence a blank screen.

All three are fixed here: `index.html` mounts `Sendwave` from `sendwave.jsx`,
`build.js` bundles React + the app into `www/bundle.js` with esbuild (fully
offline, no CDN dependency), and `capacitor.config.json` has the correct
filename. The service worker is registered. This has been test-built in a
sandboxed environment already — `npm install && npm run build` completes
with no errors, and `npx cap add android` successfully generates the native
`android/` project included in this zip.

## Getting an actual installed app — three options

### Option A — Cloud build via GitHub Actions (recommended, no local installs)

This repo includes `.github/workflows/build-apk.yml`, which builds a real
signed-for-testing `.apk` automatically using GitHub's servers (which have
full internet access to the Android SDK/Gradle, unlike some sandboxes).

1. Create a free GitHub account if you don't have one, and create a new
   **private or public repo**.
2. Upload this entire folder's contents to that repo (drag-and-drop on
   GitHub's web UI works fine — no `git` command line required — or use
   `git push` if you're comfortable with it).
3. Go to the repo's **Actions** tab. The workflow runs automatically on
   push, or click **"Build Android APK" → "Run workflow"** to trigger it
   manually.
4. Wait a few minutes, then open the finished run and download the
   `sendwave-debug-apk` artifact from the bottom of the page. Unzip it to
   get `app-debug.apk`.
5. Transfer that `.apk` to an Android phone (email, Google Drive, USB) and
   open it. You'll need to allow "Install unknown apps" for whichever app
   you used to open the file — Android will prompt you for this the first
   time.

### Option B — Local build with Android Studio

1. Install [Android Studio](https://developer.android.com/studio) (free,
   includes the Android SDK and Gradle).
2. In this project folder:
   ```
   npm install
   npm run build
   npx cap sync android
   npx cap open android
   ```
3. In Android Studio: **Build → Build Bundle(s) / APK(s) → Build APK(s)**.
4. The `.apk` lands in `android/app/build/outputs/apk/debug/app-debug.apk`.

### Option C — Skip the APK entirely: install as a PWA

Since the app already has a manifest and service worker, you can get an app
icon on an Android home screen with zero building:

1. Host the `www/` folder (after running `npm run build`) on any free
   static host — GitHub Pages, Netlify, Vercel, Cloudflare Pages.
2. Open the hosted URL in Chrome on the phone → menu (⋮) → **"Add to Home
   screen"/"Install app"**.

It installs full-screen with its own icon and works offline.

## Local development

```bash
npm install
npm run build        # bundles sendwave.jsx + React into www/bundle.js
```

Open `www/index.html` directly in a browser to preview — no server needed.
Re-run `npm run build` (or `npm run capacitor:sync`) after every change to
`sendwave.jsx` or `index.html` before rebuilding the native app — this is
the most common cause of an installed app showing stale content.

## Project structure

- `index.html` — HTML shell (loads `bundle.js`, registers the service worker)
- `sendwave.jsx` — the app itself (React, JSX, uses global `React`)
- `build.js` — bundles `sendwave.jsx` + React into `www/bundle.js`, copies
  static assets into `www/`
- `manifest.json`, `sw.js`, `icon-192.svg`, `icon-512.svg` — PWA assets
- `capacitor.config.json` — Capacitor config (`webDir` → `www/`)
- `android/` — **pre-generated** native Android project (already ran
  `npx cap add android` for you)
- `.github/workflows/build-apk.yml` — cloud build workflow (Option A)
- `www/` — **generated** build output (not included until you run
  `npm run build`; don't hand-edit files here)
