<?php
/**
 * One-click demo importer.
 *
 * After activation a dashboard notice offers "One-Click Import Demo Content".
 * Clicking it imports pages, media (the bundled artwork), navigation menus,
 * widgets and every Customizer default — then sets the static front page.
 *
 * @package ConstructEdge
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Dashboard notice with the import button.
 */
function constructedge_import_notice() {
	if ( get_option( 'constructedge_demo_imported' ) ) {
		return;
	}
	$nonce = wp_create_nonce( 'constructedge_import' );
	?>
	<div class="notice notice-info is-dismissible" id="constructedge-import-notice">
		<h2><?php esc_html_e( 'ConstructEdge — set up your site', 'constructedge' ); ?></h2>
		<p><?php esc_html_e( 'Import the demo content (pages, media, menus, widgets and all Customizer settings) to make your site look exactly like the demo.', 'constructedge' ); ?></p>
		<p>
			<button type="button" class="button button-primary" id="constructedge-import-btn" data-nonce="<?php echo esc_attr( $nonce ); ?>">
				<?php esc_html_e( 'One-Click Import Demo Content', 'constructedge' ); ?>
			</button>
			<span id="constructedge-import-status" style="margin-left:12px;"></span>
		</p>
	</div>
	<?php
}
add_action( 'admin_notices', 'constructedge_import_notice' );

/**
 * Enqueue the admin import script on the dashboard.
 */
function constructedge_import_admin_assets( $hook ) {
	if ( 'index.php' !== $hook ) {
		return;
	}
	wp_enqueue_script(
		'constructedge-import-admin',
		CONSTRUCTEDGE_URI . '/assets/import-admin.js',
		array( 'jquery' ),
		CONSTRUCTEDGE_VERSION,
		true
	);
	wp_localize_script(
		'constructedge-import-admin',
		'constructedgeImport',
		array( 'ajaxUrl' => admin_url( 'admin-ajax.php' ) )
	);
}
add_action( 'admin_enqueue_scripts', 'constructedge_import_admin_assets' );

/**
 * AJAX handler — runs the import.
 */
function constructedge_run_import() {
	check_ajax_referer( 'constructedge_import', 'nonce' );

	if ( ! current_user_can( 'manage_options' ) ) {
		wp_send_json_error( array( 'message' => 'Insufficient permissions.' ) );
	}

	constructedge_import_customizer();
	constructedge_import_pages();
	constructedge_import_media();
	constructedge_import_menus();
	constructedge_import_widgets();

	update_option( 'constructedge_demo_imported', 1 );
	wp_send_json_success( array( 'message' => 'Demo content imported.' ) );
}
add_action( 'wp_ajax_constructedge_import', 'constructedge_run_import' );

/**
 * Apply every Customizer default from demo-import/customizer.json.
 */
function constructedge_import_customizer() {
	$file = CONSTRUCTEDGE_DIR . '/demo-import/customizer.json';
	if ( ! file_exists( $file ) ) {
		return;
	}
	$settings = json_decode( file_get_contents( $file ), true ); // phpcs:ignore WordPress.WP.AlternativeFunctions.file_get_contents_file_get_contents
	if ( ! is_array( $settings ) ) {
		return;
	}
	$map = constructedge_settings_map();
	foreach ( $map as $mod => $def ) {
		list( $js_key ) = $def;
		if ( array_key_exists( $js_key, $settings ) ) {
			set_theme_mod( $mod, $settings[ $js_key ] );
		}
	}
}

/**
 * Create the demo pages and set the static front page.
 */
function constructedge_import_pages() {
	$pages = array( 'Home', 'About', 'Services', 'Work', 'Contact' );

	foreach ( $pages as $title ) {
		$slug = sanitize_title( $title );
		if ( get_page_by_path( $slug ) ) {
			continue;
		}
		wp_insert_post(
			array(
				'post_title'   => $title,
				'post_name'    => $slug,
				'post_status'  => 'publish',
				'post_type'    => 'page',
				'post_content' => '<!-- wp:paragraph --><p>Rendered by the ConstructEdge React app.</p><!-- /wp:paragraph -->',
			)
		);
	}

	$home = get_page_by_path( 'home' );
	if ( $home ) {
		update_option( 'show_on_front', 'page' );
		update_option( 'page_on_front', $home->ID );
	}
}

/**
 * Sideload the bundled artwork into the media library.
 */
function constructedge_import_media() {
	$images_dir = CONSTRUCTEDGE_DIR . '/assets/images';
	if ( ! is_dir( $images_dir ) ) {
		return;
	}
	require_once ABSPATH . 'wp-admin/includes/media.php';
	require_once ABSPATH . 'wp-admin/includes/file.php';
	require_once ABSPATH . 'wp-admin/includes/image.php';

	foreach ( glob( $images_dir . '/*.svg' ) as $file ) {
		$upload = media_sideload_image( $file, 0, basename( $file ), 'id' );
		if ( is_wp_error( $upload ) ) {
			continue;
		}
	}
}

/**
 * Create the primary + footer menus and assign locations.
 */
function constructedge_import_menus() {
	$primary = wp_get_nav_menu_object( 'Primary' );
	if ( ! $primary ) {
		$primary_id = wp_create_nav_menu( 'Primary' );
		$items      = array(
			'Services'   => '#services',
			'Work'       => '#work',
			'Method'     => '#method',
			'Calculator' => '#calculator',
			'Crew'       => '#crew',
			'Safety'     => '#safety',
		);
		foreach ( $items as $label => $url ) {
			wp_update_nav_menu_item(
				$primary_id,
				0,
				array(
					'menu-item-title'  => $label,
					'menu-item-url'    => $url,
					'menu-item-status' => 'publish',
					'menu-item-type'   => 'custom',
				)
			);
		}
	}

	$locations = get_theme_mod( 'nav_menu_locations', array() );
	$primary   = wp_get_nav_menu_object( 'Primary' );
	if ( $primary ) {
		$locations['primary'] = $primary->term_id;
		set_theme_mod( 'nav_menu_locations', $locations );
	}
}

/**
 * Populate the footer widget area from demo-import/widgets.json.
 */
function constructedge_import_widgets() {
	$file = CONSTRUCTEDGE_DIR . '/demo-import/widgets.json';
	if ( ! file_exists( $file ) ) {
		return;
	}
	$config = json_decode( file_get_contents( $file ), true ); // phpcs:ignore WordPress.WP.AlternativeFunctions.file_get_contents_file_get_contents
	if ( ! is_array( $config ) ) {
		return;
	}

	foreach ( $config as $sidebar => $widgets ) {
		$sidebars = get_option( 'sidebars_widgets', array() );
		if ( empty( $sidebars[ $sidebar ] ) ) {
			$sidebars[ $sidebar ] = array();
		}
		foreach ( $widgets as $type => $instance ) {
			$widget_option = get_option( 'widget_' . $type, array() );
			$next_id       = empty( $widget_option ) ? 2 : ( max( array_keys( $widget_option ) ) + 1 );
			$widget_option[ $next_id ]            = $instance;
			$widget_option['_multiwidget']        = 1;
			update_option( 'widget_' . $type, $widget_option );
			$sidebars[ $sidebar ][] = $type . '-' . $next_id;
		}
		update_option( 'sidebars_widgets', $sidebars );
	}
}
