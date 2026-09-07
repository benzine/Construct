=== ConstructEdge ===
Contributors: constructedge
Requires at least: 6.0
Tested up to: 6.7
Requires PHP: 7.4
Stable tag: 1.0.0
License: GPLv2 or later
License URI: http://www.gnu.org/licenses/gpl-2.0.html

Headless React theme for a construction & civil-engineering firm. The frontend IS the original React app — fully customizable from the Customizer.

== Description ==

ConstructEdge embeds the original React website as the complete frontend renderer. The same compiled bundle runs unchanged inside WordPress, so every animation, layout and micro-interaction is identical to the source. WordPress handles admin, content, settings storage and demo import; React renders everything visitors see.

Every color, font, spacing, radius and animation value is a Customizer setting (Appearance → Customize) injected as `window.wpReactSettings` and also served at `GET /wp-json/constructedge/v1/settings`. Nothing is hardcoded in the React components.

== Installation ==

1. Upload the theme ZIP via Appearance → Themes → Add New → Upload Theme.
2. Activate ConstructEdge.
3. On the Dashboard, click "One-Click Import Demo Content".
4. Done — the site matches the demo. Customize via Appearance → Customize.

== Customizer Sections ==

* Colors — primary, accent, secondary, shift palettes, buttons
* Typography — body / display / mono fonts, base size, heading weight
* Layout — container, section padding, gutter, radius
* Header — logo (media library), logo text, sticky behaviour
* Footer — copyright, columns
* Buttons — background, hover, text, radius
* Animations — master toggle, speed multiplier, scroll-reveal toggle
* Advanced — custom CSS injection

All settings use `show_in_rest = true` and transport via `postMessage` for instant live preview.

== Changelog ==

= 1.0.0 =
* Initial release.
