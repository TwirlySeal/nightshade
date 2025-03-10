## Canvas API data caching with invalidation
  - Location: `src/injected` (entry point is main.ts`)
  - `main.ts` fetches courses for the sidebar, `dashboard.ts` fetches announcements for the dashboard page
  - Canvas API response time is too slow, so we should cache it to improve performance
  - Store data in [`browser.storage.local`](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/storage/local)
  - Alongside the data, store a timestamp of when it was saved. Then when data is needed, check whether difference from current time meets threshold to invalidate the cache

## Manifest Python script
  - Location: `package/main.py`
  - `main.py` generates `manifest.json` from `manifest.kdl`
  - Currently, paths point to `build/<filename>` but we need to generate separate manifests for Chrome and Firefox pointing to respective files
  - Need a way to resolve browser-specific paths from common paths in the KDL manifest
  - Save manifests to `build/firefox/` and `build/chrome/`

## Package Python script
- Prerequisite: Manifest Python script
- Location: `package/` (not created yet)
- Package `build/firefox/` and `build/chrome/` into zip files using the `zipfile` module
- Resolves required files from manifest.json files
- These zip files are needed to submit to the extension stores

## Other
- Design: dashboard, elsewhere
- CSS
- Fix popup CSS in Firefox
