<?php
/**
 * Settings helpers — the canonical map between Customizer theme_mod names,
 * the JS keys exposed on window.wpReactSettings, and their default values.
 *
 * Defaults are byte-identical to the original React site's design tokens, so
 * an untouched install looks exactly like the demo.
 *
 * @package ConstructEdge
 */
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
/**
 * Every setting: theme_mod name => [ js key, default, type ].
 * Types: color | text | number | boolean | select
 */
function constructedge_settings_map() {
	return array(
		// Colors
		'ce_accent'        => array( 'accent', '#ff6b00', 'color' ),
		'ce_rust'          => array( 'rust', '#cc4400', 'color' ),
		'ce_brass'         => array( 'brass', '#d4af37', 'color' ),
		'ce_steel'         => array( 'steel', '#7e93ac', 'color' ),
		'ce_muted'         => array( 'muted', '#94a3b8', 'color' ),
		'ce_dark_bg'       => array( 'darkBg', '#0c0f13', 'color' ),
		'ce_dark_ink'      => array( 'darkInk', '#edf2f7', 'color' ),
		'ce_light_bg'      => array( 'lightBg', '#f2f4f6', 'color' ),
		'ce_light_ink'     => array( 'lightInk', '#131920', 'color' ),
		'ce_button_bg'     => array( 'buttonBg', '#ff6b00', 'color' ),
		'ce_button_hover'  => array( 'buttonHover', '#cc4400', 'color' ),
		'ce_button_text'   => array( 'buttonText', '#10141a', 'color' ),
		// Typography
		'ce_font_body'     => array( 'fontBody', 'Barlow, "Segoe UI", sans-serif', 'text' ),
		'ce_font_display'  => array( 'fontDisplay', '"Space Grotesk", Barlow, sans-serif', 'text' ),
		'ce_font_mono'     => array( 'fontMono', '"JetBrains Mono", monospace', 'text' ),
		'ce_base_size'     => array( 'baseSize', '16.5', 'number' ),
		'ce_heading_weight' => array( 'headingWeight', '700', 'select' ),
		// Layout
		'ce_container'     => array( 'container', '1280', 'number' ),
		'ce_section_pad'   => array( 'sectionPad', '96', 'number' ),
		'ce_gutter'        => array( 'gutter', '24', 'number' ),
		'ce_radius'        => array( 'radius', '0', 'number' ),
		// Header
		'ce_logo_text'     => array( 'logoText', 'ConstructEdge', 'text' ),
		'ce_sticky_header' => array( 'stickyHeader', true, 'boolean' ),
		// Footer
		'ce_copyright'     => array( 'copyright', "\xc2\xa9 2026 ConstructEdge Group \xc2\xb7 Lic. CGC-04821 \xc2\xb7 Bonded to \$250M", 'text' ),
		'ce_footer_cols'   => array( 'footerCols', '4', 'select' ),
		// Buttons
		'ce_button_radius' => array( 'buttonRadius', '0', 'number' ),
		// Animations
		'ce_anim_master'   => array( 'animMaster', true, 'boolean' ),
		'ce_anim_speed'    => array( 'animSpeed', '1', 'number' ),
		'ce_scroll_reveal' => array( 'scrollReveal', true, 'boolean' ),
		// Advanced
		'ce_custom_css'    => array( 'customCss', '', 'text' ),
		// Service Selector
		'ce_sel_q1_label'  => array( 'selQ1Label', "What's the asset?", 'text' ),
		'ce_sel_q1_opts'   => array( 'selQ1Opts', "New ground-up build|Existing structure|Still in planning / feasibility", 'text' ),
		'ce_sel_q2_label'  => array( 'selQ2Label', 'Rough footprint?', 'text' ),
		'ce_sel_q2_opts'   => array( 'selQ2Opts', "Under 20K sq-ft|20K – 100K sq-ft|Over 100K sq-ft", 'text' ),
		'ce_sel_q3_label'  => array( 'selQ3Label', 'What matters most?', 'text' ),
		'ce_sel_q3_opts'   => array( 'selQ3Opts', "Speed to occupancy|Budget certainty|Technical complexity", 'text' ),
		// Contact form
		'ce_contact_email' => array( 'contactEmail', '', 'text' ),
		'ce_contact_subject' => array( 'contactSubject', 'CE Work Order — {ref}', 'text' ),
		'ce_contact_honeypot' => array( 'contactHoneypot', true, 'boolean' ),
		'ce_contact_recaptcha' => array( 'contactRecaptcha', false, 'boolean' ),
		'ce_contact_recaptcha_key' => array( 'contactRecaptchaKey', '', 'text' ),
		'ce_contact_recaptcha_secret' => array( 'contactRecaptchaSecret', '', 'text' ),
		// Search
		'ce_search_zindex' => array( 'searchZindex', '9999', 'number' ),
	);
}
/**
 * Default selector result messages keyed by service code.
 */
function constructedge_selector_results_defaults() {
	return array(
		'SVC-01' => 'Design–build under one contract gives you budget certainty: one team owns scope, schedule and price.',
		'SVC-02' => 'Technically heavy work starts in the engineering studio — PE-stamped systems before steel is ordered.',
		'SVC-03' => 'Pull-plan scheduling and our own superintendent corps are why commercial jobs land at 96.4% on-time.',
		'SVC-05' => 'Existing structures are our retrofit lane — scan, strengthen, refit, all while the building stays occupied.',
		'SVC-06' => "You're still shaping the number. A 5D BIM estimate and GMP package de-risks it before capital is committed.",
	);
}
/**
 * Build the full settings array (JS keys => current values), used both to
 * localize the script and to serve via REST.
 */
function constructedge_get_settings() {
	$map  = constructedge_settings_map();
	$out  = array();
	foreach ( $map as $mod => $def ) {
		list( $js_key, $default, $type ) = $def;
		$value = get_theme_mod( $mod, $default );
		if ( 'boolean' === $type ) {
			$value = (bool) $value;
		} elseif ( 'number' === $type ) {
			$value = is_numeric( $value ) ? (float) $value : $default;
		}
		$out[ $js_key ] = $value;
	}
	// Default contact email to WP admin if blank.
	if ( empty( $out['contactEmail'] ) ) {
		$out['contactEmail'] = get_option( 'admin_email' );
	}
	// Custom logo URL (uses WP media library).
	$logo_id        = get_theme_mod( 'custom_logo' );
	$out['logoUrl'] = $logo_id ? wp_get_attachment_image_url( $logo_id, 'full' ) : '';
	// ---------- Service Selector structured data ----------
	$q1_opts = array_map( 'trim', explode( '|', $out['selQ1Opts'] ) );
	$q2_opts = array_map( 'trim', explode( '|', $out['selQ2Opts'] ) );
	$q3_opts = array_map( 'trim', explode( '|', $out['selQ3Opts'] ) );
	$out['selector'] = array(
		'questions' => array(
			array(
				'label'   => $out['selQ1Label'],
				'options' => array_values( array_filter( $q1_opts ) ),
			),
			array(
				'label'   => $out['selQ2Label'],
				'options' => array_values( array_filter( $q2_opts ) ),
			),
			array(
				'label'   => $out['selQ3Label'],
				'options' => array_values( array_filter( $q3_opts ) ),
			),
		),
		'results' => constructedge_selector_results_defaults(),
	);
	// ---------- Contact form structured data ----------
	$out['contact'] = array(
		'recipient'      => $out['contactEmail'],
		'subjectPattern' => $out['contactSubject'],
		'honeypot'       => $out['contactHoneypot'],
		'recaptcha'      => array(
			'enabled' => $out['contactRecaptcha'],
			'siteKey' => $out['contactRecaptchaKey'],
		),
	);
	// ---------- Search ----------
	$out['search'] = array(
		'zIndex' => $out['searchZindex'],
	);
	// ---------- Backoffice Content (full text control) ----------
	$out['bo'] = constructedge_get_backoffice_content();
	return $out;
}
