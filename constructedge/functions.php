<?php
/**
 * ConstructEdge theme functions.
 *
 * Loads the modular includes: settings helpers, asset enqueue, Customizer
 * panel, REST settings endpoint and the one-click demo importer.
 *
 * @package ConstructEdge
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // No direct access.
}

define( 'CONSTRUCTEDGE_VERSION', '1.0.0' );
define( 'CONSTRUCTEDGE_DIR', get_template_directory() );
define( 'CONSTRUCTEDGE_URI', get_template_directory_uri() );

require_once CONSTRUCTEDGE_DIR . '/inc/settings-helpers.php';
require_once CONSTRUCTEDGE_DIR . '/inc/enqueue.php';
require_once CONSTRUCTEDGE_DIR . '/inc/customizer.php';
require_once CONSTRUCTEDGE_DIR . '/inc/rest-settings.php';
require_once CONSTRUCTEDGE_DIR . '/inc/demo-import.php';
require_once CONSTRUCTEDGE_DIR . '/inc/backoffice.php';

/**
 * Register theme features on setup.
 */
function constructedge_setup() {
	load_theme_textdomain( 'constructedge', CONSTRUCTEDGE_DIR . '/languages' );

	add_theme_support( 'title-tag' );
	add_theme_support( 'post-thumbnails' );
	add_theme_support( 'custom-logo' );
	add_theme_support( 'automatic-feed-links' );
	add_theme_support( 'html5', array( 'search-form', 'gallery', 'caption', 'style', 'script' ) );
	add_theme_support( 'responsive-embeds' );

	register_nav_menus(
		array(
			'primary' => esc_html__( 'Primary (crane) menu', 'constructedge' ),
			'footer'  => esc_html__( 'Footer menu', 'constructedge' ),
		)
	);
}
add_action( 'after_setup_theme', 'constructedge_setup' );

/**
 * Register the sidebar widget area used by the importer.
 */
function constructedge_widgets_init() {
	register_sidebar(
		array(
			'name'          => esc_html__( 'Footer Field Notes', 'constructedge' ),
			'id'            => 'footer-1',
			'description'   => esc_html__( 'Appears above the footer bottom bar.', 'constructedge' ),
			'before_widget' => '<div id="%1$s" class="ce-widget %2$s">',
			'after_widget'  => '</div>',
			'before_title'  => '<h4 class="ce-widget-title">',
			'after_title'   => '</h4>',
		)
	);
}
add_action( 'widgets_init', 'constructedge_widgets_init' );
/**
 * Inject runtime CSS variables into <head> so the Customizer can control
 * values that live outside the design-token system (search z-index, etc.).
 * Also applies a safety layer that ensures the search overlay and its close
 * button always sit above the navigation menu.
 */
function constructedge_head_css() {
	$z = (float) get_theme_mod( 'ce_search_zindex', 9999 );
	?>
<style id="constructedge-runtime-css">
:root {
	--ce-search-z: <?php echo esc_attr( $z ); ?>;
}
/* Search overlay + close button must sit above the nav. */
.fixed.z-\[72\],
.fixed[class*="z-\[7"] {
	z-index: <?php echo esc_attr( $z ); ?> !important;
}
/* If the search results page uses a min-h-screen wrapper, lift it too. */
body > div[style*="font-family"]:first-of-type,
body > div.min-h-screen {
	position: relative;
	z-index: <?php echo esc_attr( $z - 1 ); ?>;
}
</style>
	<?php
}
add_action( 'wp_head', 'constructedge_head_css', 5 );
/**
 * Apply the `data-theme` attribute to <html> early so CSS variables resolve
 * on first paint. Defaults to dark; the React app toggles it based on user
 * preference or system setting.
 */
function constructedge_html_theme_attr( $output, $show ) {
	if ( 'schema' === $show ) {
		return $output;
	}
	$output .= ' data-theme="dark"';
	return $output;
}
add_filter( 'language_attributes', 'constructedge_html_theme_attr', 10, 2 );
