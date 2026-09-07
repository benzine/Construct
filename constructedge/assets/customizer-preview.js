/**
 * Customizer live-preview bridge.
 *
 * Runs inside the Customizer preview iframe. When any setting changes we
 * rebuild the settings object and hand it to the running React app via the
 * window.__ceApplyWpSettings hook (defined by the React bridge), so the
 * frontend re-renders tokens instantly without a full reload.
 */
(function (api) {
  'use strict';

  // theme_mod name -> JS key (must match inc/settings-helpers.php).
  var MAP = {
    ce_accent: 'accent', ce_rust: 'rust', ce_brass: 'brass', ce_steel: 'steel',
    ce_muted: 'muted', ce_dark_bg: 'darkBg', ce_dark_ink: 'darkInk',
    ce_light_bg: 'lightBg', ce_light_ink: 'lightInk',
    ce_button_bg: 'buttonBg', ce_button_hover: 'buttonHover', ce_button_text: 'buttonText',
    ce_font_body: 'fontBody', ce_font_display: 'fontDisplay', ce_font_mono: 'fontMono',
    ce_base_size: 'baseSize', ce_heading_weight: 'headingWeight',
    ce_container: 'container', ce_section_pad: 'sectionPad', ce_gutter: 'gutter', ce_radius: 'radius',
    ce_logo_text: 'logoText', ce_sticky_header: 'stickyHeader',
    ce_copyright: 'copyright', ce_footer_cols: 'footerCols',
    ce_button_radius: 'buttonRadius',
    ce_anim_master: 'animMaster', ce_anim_speed: 'animSpeed', ce_scroll_reveal: 'scrollReveal',
    ce_custom_css: 'customCss'
  };

  function collect() {
    var out = {};
    Object.keys(MAP).forEach(function (mod) {
      var s = api(mod);
      if (s) {
        out[MAP[mod]] = s.get();
      }
    });
    var logo = api('custom_logo');
    out.logoUrl = logo ? logo.get() : '';
    return out;
  }

  function push() {
    var settings = collect();
    if (typeof window.__ceApplyWpSettings === 'function') {
      window.__ceApplyWpSettings(settings);
    }
  }

  // Debounce so rapid color drags don't thrash.
  var timer = null;
  function schedule() {
    if (timer) { window.clearTimeout(timer); }
    timer = window.setTimeout(push, 60);
  }

  Object.keys(MAP).forEach(function (mod) {
    api(mod, function (value) { value.bind(schedule); });
  });
  api('custom_logo', function (value) { value.bind(schedule); });

  // Initial apply once the preview boots.
  api.bind('preview-ready', push);
})(wp.customize);
