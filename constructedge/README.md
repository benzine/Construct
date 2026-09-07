# ConstructEdge WordPress Theme (revision R23)

The frontend IS the original React app — the same compiled bundle runs
unchanged inside WordPress. All design values are driven by the WP
Customizer (Appearance → Customize) and injected as window.wpReactSettings.

## Install
1. WP admin → Appearance → Themes → Add New → Upload Theme → upload this ZIP.
2. Activate. Dashboard shows 'One-Click Import Demo Content'.
3. Click it → pages, media, menus, widgets and Customizer defaults are applied.

## If assets/build is empty
Run a production build of the React app and copy dist/assets/index-*.js and
index-*.css into assets/build/, then add a manifest.json:
  { "js": "index-XXXX.js", "css": "index-XXXX.css" }
