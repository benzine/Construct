<?php
/**
 * Asset enqueue.
 *
 * Reads assets/build/manifest.json (written by the React build pipeline) to
 * find the hashed JS/CSS, enqueues them, and localizes window.wpReactSettings
 * so the React app can consume Customizer values with zero hardcoding.
 *
 * @package ConstructEdge
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Enqueue the compiled React bundle + settings.
 */
function constructedge_enqueue_assets() {
	$build_dir = CONSTRUCTEDGE_DIR . '/assets/build';
	$build_uri = CONSTRUCTEDGE_URI . '/assets/build';

	$js_file  = null;
	$css_file = null;

	// Prefer the manifest emitted by the build pipeline.
	$manifest_path = $build_dir . '/manifest.json';
	if ( file_exists( $manifest_path ) ) {
		$manifest = json_decode( file_get_contents( $manifest_path ), true ); // phpcs:ignore WordPress.WP.AlternativeFunctions.file_get_contents_file_get_contents
		if ( is_array( $manifest ) ) {
			$js_file  = isset( $manifest['js'] ) ? $manifest['js'] : null;
			$css_file = isset( $manifest['css'] ) ? $manifest['css'] : null;
		}
	}

	// Fall back to scanning for hashed files.
	if ( ! $js_file || ! $css_file ) {
		foreach ( glob( $build_dir . '/index-*.js' ) as $f ) {
			$js_file = basename( $f );
		}
		foreach ( glob( $build_dir . '/index-*.css' ) as $f ) {
			$css_file = basename( $f );
		}
	}

	// The Vite build may wrap CSS in a JS module (for HMR). If styles-raw.css
	// exists (extracted real CSS), prefer it for the stylesheet link.
	$raw_css_path = $build_dir . '/styles-raw.css';
	if ( $css_file && file_exists( $raw_css_path ) ) {
		// Verify the manifest CSS is actually a JS wrapper before swapping.
		$manifest_css_head = file_get_contents( $build_dir . '/' . $css_file, false, null, 0, 30 ); // phpcs:ignore WordPress.WP.AlternativeFunctions.file_get_contents_file_get_contents
		if ( strpos( $manifest_css_head, 'import ' ) === 0 || strpos( $manifest_css_head, 'const __vite__' ) !== false ) {
			$css_file = 'styles-raw.css';
		}
	}
	if ( $css_file && file_exists( $build_dir . '/' . $css_file ) ) {
		wp_enqueue_style(
			'constructedge-app',
			$build_uri . '/' . $css_file,
			array(),
			CONSTRUCTEDGE_VERSION
		);
	}

	if ( $js_file && file_exists( $build_dir . '/' . $js_file ) ) {
		wp_enqueue_script(
			'constructedge-app',
			$build_uri . '/' . $js_file,
			array(),
			CONSTRUCTEDGE_VERSION,
			true
		);

		// Inject Customizer settings for the React app (Rule 3: zero hardcoding).
		wp_localize_script( 'constructedge-app', 'wpReactSettings', constructedge_get_settings() );
	}

	// Customizer live-preview bridge (only loaded inside the Customizer).
	if ( is_customize_preview() ) {
		wp_enqueue_script(
			'constructedge-customizer-preview',
			CONSTRUCTEDGE_URI . '/assets/customizer-preview.js',
			array( 'customize-preview', 'constructedge-app' ),
			CONSTRUCTEDGE_VERSION,
			true
		);
	}
}
add_action( 'wp_enqueue_scripts', 'constructedge_enqueue_assets' );
/**
 * Add type="module" to the React app script — the Vite build emits ES
 * module exports which require a module script context.
 *
 * @param string $tag    Script tag.
 * @param string $handle Script handle.
 * @return string Filtered script tag.
 */
function constructedge_module_script( $tag, $handle ) {
	if ( 'constructedge-app' === $handle ) {
		$tag = str_replace( "<script ", "<script type=\"module\" ", $tag );
	}
	return $tag;
}
add_filter( 'script_loader_tag', 'constructedge_module_script', 10, 2 );
