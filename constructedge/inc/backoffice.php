<?php
/**
 * Backoffice settings — extends Customizer with full content control.
 *
 * Provides theme_mod settings for ALL editable text content across the site:
 * Hero section (kicker, taglines, phase taglines, CTAs), Services, Projects,
 * Team, Testimonials, Contact, Safety, Method, Footer, Header navigation.
 *
 * All settings transport via postMessage for live preview.
 *
 * @package ConstructEdge
 */
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Register backoffice content settings.
 *
 * @param WP_Customize_Manager $wp_customize Customizer manager.
 */
function constructedge_backoffice_register( $wp_customize ) {
	// Add Backoffice panel.
	$wp_customize->add_panel(
		'ce_backoffice',
		array(
			'title'       => __( 'Backoffice Content', 'constructedge' ),
			'description' => __( 'Edit all website text content from one place.', 'constructedge' ),
			'priority'    => 25,
		)
	);

	// Sections for each content area.
	$sections = array(
		'ce_bo_hero'        => array( 'Hero Section', 'Main headline, kicker, taglines and CTAs.' ),
		'ce_bo_services'    => array( 'Services Section', 'Service names, descriptions, tags and steps.' ),
		'ce_bo_projects'    => array( 'Projects Section', 'Project names, locations, scope details.' ),
		'ce_bo_team'        => array( 'Team Section', 'Crew member bios and credentials.' ),
		'ce_bo_testimonials'=> array( 'Testimonials', 'Client quotes and attributions.' ),
		'ce_bo_contact'     => array( 'Contact Section', 'Form headers, office info.' ),
		'ce_bo_safety'      => array( 'Safety Section', 'Safety stats and certifications.' ),
		'ce_bo_method'      => array( 'Method Section', 'Process phases and descriptions.' ),
		'ce_bo_footer'      => array( 'Footer', 'Copyright, footer menu items.' ),
		'ce_bo_header'      => array( 'Header / Nav', 'Navigation labels, top bar info.' ),
	);

	foreach ( $sections as $id => $sec ) {
		$wp_customize->add_section(
			$id,
			array(
				'title'       => __( $sec[0], 'constructedge' ),
				'description' => __( $sec[1], 'constructedge' ),
				'panel'       => 'ce_backoffice',
			)
		);
	}

	// ===== HERO SECTION =====
	$hero_settings = array(
		'ce_hero_kicker'         => array( 'Hero Kicker', 'Small text above headline', 'From Blueprint to Handover' ),
		'ce_hero_tagline_1'      => array( 'Tagline 1', 'Rotating tagline (idle state)', 'From first line to final beam.' ),
		'ce_hero_tagline_2'      => array( 'Tagline 2', 'Rotating tagline (idle state)', 'Engineered precision. Field discipline.' ),
		'ce_hero_tagline_3'      => array( 'Tagline 3', 'Rotating tagline (idle state)', 'One team. Zero blame games.' ),
		'ce_hero_phase_01'       => array( 'Phase 01 Tagline', 'Blueprint phase', 'Drawing board active.' ),
		'ce_hero_phase_02'       => array( 'Phase 02 Tagline', 'Structural steel phase', 'Steel rising.' ),
		'ce_hero_phase_03'       => array( 'Phase 03 Tagline', 'Concrete & slabs phase', 'Pouring floors.' ),
		'ce_hero_phase_04'       => array( 'Phase 04 Tagline', 'Facade & glazing phase', 'Glass ascending.' ),
		'ce_hero_phase_05'       => array( 'Phase 05 Tagline', 'Site works phase', 'Grounds taking shape.' ),
		'ce_hero_phase_06'       => array( 'Phase 06 Tagline', 'Handover phase', 'Keys ready.' ),
		'ce_hero_cta_primary'    => array( 'Primary CTA Button', 'Main CTA text', 'Start Your Project' ),
		'ce_hero_cta_secondary'  => array( 'Secondary CTA Button', 'Secondary CTA text', 'View Our Work' ),
		'ce_hero_subtext'        => array( 'Hero Subtext', 'Descriptive text below headline', 'High-rise, industrial and civil structures — engineered in-house, erected by our own crews. 1,240 delivered since 1987.' ),
	);

	foreach ( $hero_settings as $mod => $def ) {
		list( $label, $desc, $default ) = $def;
		$wp_customize->add_setting(
			$mod,
			array(
				'default'           => $default,
				'type'              => 'theme_mod',
				'transport'         => 'postMessage',
				'sanitize_callback' => 'wp_kses_post',
				'show_in_rest'      => true,
			)
		);
		$wp_customize->add_control(
			$mod,
			array(
				'label'       => $label,
				'section'     => 'ce_bo_hero',
				'type'        => strpos( $mod, 'phase' ) !== false || strpos( $mod, 'subtext' ) !== false ? 'textarea' : 'text',
				'description' => $desc,
			)
		);
	}

	// ===== SERVICES SECTION =====
	$services = array(
		'SVC-01' => 'Design–Build Delivery',
		'SVC-02' => 'Civil & Structural Engineering',
		'SVC-03' => 'Commercial Construction',
		'SVC-04' => 'Industrial Facilities',
		'SVC-05' => 'Renovation & Seismic Retrofit',
		'SVC-06' => 'Preconstruction & Estimating',
	);

	foreach ( $services as $code => $name ) {
		$suffix = str_replace( '-', '_', $code );
		$wp_customize->add_setting(
			"ce_service_{$suffix}_name",
			array(
				'default'           => $name,
				'type'              => 'theme_mod',
				'transport'         => 'postMessage',
				'sanitize_callback' => 'sanitize_text_field',
				'show_in_rest'      => true,
			)
		);
		$wp_customize->add_control(
			"ce_service_{$suffix}_name",
			array(
				'label'   => "{$code} - Service Name",
				'section' => 'ce_bo_services',
				'type'    => 'text',
			)
		);

		$wp_customize->add_setting(
			"ce_service_{$suffix}_tag",
			array(
				'default'           => '',
				'type'              => 'theme_mod',
				'transport'         => 'postMessage',
				'sanitize_callback' => 'sanitize_text_field',
				'show_in_rest'      => true,
			)
		);
		$wp_customize->add_control(
			"ce_service_{$suffix}_tag",
			array(
				'label'   => "{$code} - Tagline",
				'section' => 'ce_bo_services',
				'type'    => 'text',
			)
		);

		$wp_customize->add_setting(
			"ce_service_{$suffix}_desc",
			array(
				'default'           => '',
				'type'              => 'theme_mod',
				'transport'         => 'postMessage',
				'sanitize_callback' => 'wp_kses_post',
				'show_in_rest'      => true,
			)
		);
		$wp_customize->add_control(
			"ce_service_{$suffix}_desc",
			array(
				'label'   => "{$code} - Description",
				'section' => 'ce_bo_services',
				'type'    => 'textarea',
			)
		);

		$wp_customize->add_setting(
			"ce_service_{$suffix}_duration",
			array(
				'default'           => '',
				'type'              => 'theme_mod',
				'transport'         => 'postMessage',
				'sanitize_callback' => 'sanitize_text_field',
				'show_in_rest'      => true,
			)
		);
		$wp_customize->add_control(
			"ce_service_{$suffix}_duration",
			array(
				'label'   => "{$code} - Duration",
				'section' => 'ce_bo_services',
				'type'    => 'text',
			)
		);
	}

	// ===== PROJECTS SECTION =====
	$projects = array( 'meridian-one', 'harborline', 'apex-plant', 'foundry-lofts', 'cascade-pavilion', 'summit-ridge' );
	foreach ( $projects as $proj ) {
		$wp_customize->add_setting(
			"ce_project_{$proj}_name",
			array(
				'default'           => ucfirst( str_replace( '-', ' ', $proj ) ),
				'type'              => 'theme_mod',
				'transport'         => 'postMessage',
				'sanitize_callback' => 'sanitize_text_field',
				'show_in_rest'      => true,
			)
		);
		$wp_customize->add_control(
			"ce_project_{$proj}_name",
			array(
				'label'   => ucfirst( $proj ) . ' - Project Name',
				'section' => 'ce_bo_projects',
				'type'    => 'text',
			)
		);

		$wp_customize->add_setting(
			"ce_project_{$proj}_scope",
			array(
				'default'           => '',
				'type'              => 'theme_mod',
				'transport'         => 'postMessage',
				'sanitize_callback' => 'sanitize_text_field',
				'show_in_rest'      => true,
			)
		);
		$wp_customize->add_control(
			"ce_project_{$proj}_scope",
			array(
				'label'   => ucfirst( $proj ) . ' - Scope',
				'section' => 'ce_bo_projects',
				'type'    => 'text',
			)
		);
	}

	// ===== TEAM SECTION =====
	$crew = array( 'dana', 'marcus', 'ingrid', 'theo' );
	foreach ( $crew as $member ) {
		$wp_customize->add_setting(
			"ce_crew_{$member}_focus",
			array(
				'default'           => '',
				'type'              => 'theme_mod',
				'transport'         => 'postMessage',
				'sanitize_callback' => 'sanitize_text_field',
				'show_in_rest'      => true,
			)
		);
		$wp_customize->add_control(
			"ce_crew_{$member}_focus",
			array(
				'label'   => ucfirst( $member ) . ' - Focus Area',
				'section' => 'ce_bo_team',
				'type'    => 'text',
			)
		);
	}

	// ===== TESTIMONIALS SECTION =====
	for ( $i = 1; $i <= 4; $i++ ) {
		$wp_customize->add_setting(
			"ce_testimonial_{$i}_quote",
			array(
				'default'           => '',
				'type'              => 'theme_mod',
				'transport'         => 'postMessage',
				'sanitize_callback' => 'wp_kses_post',
				'show_in_rest'      => true,
			)
		);
		$wp_customize->add_control(
			"ce_testimonial_{$i}_quote",
			array(
				'label'   => "Testimonial {$i} - Quote",
				'section' => 'ce_bo_testimonials',
				'type'    => 'textarea',
			)
		);
	}

	// ===== CONTACT SECTION =====
	$wp_customize->add_setting(
		'ce_contact_kicker',
		array(
			'default'           => 'Open a Work Order',
			'type'              => 'theme_mod',
			'transport'         => 'postMessage',
			'sanitize_callback' => 'sanitize_text_field',
			'show_in_rest'      => true,
		)
	);
	$wp_customize->add_control(
		'ce_contact_kicker',
		array(
			'label'   => 'Contact Section Kicker',
			'section' => 'ce_bo_contact',
			'type'    => 'text',
		)
	);

	$wp_customize->add_setting(
		'ce_contact_title',
		array(
			'default'           => 'Put it on our drawing board.',
			'type'              => 'theme_mod',
			'transport'         => 'postMessage',
			'sanitize_callback' => 'sanitize_text_field',
			'show_in_rest'      => true,
		)
	);
	$wp_customize->add_control(
		'ce_contact_title',
		array(
			'label'   => 'Contact Section Title',
			'section' => 'ce_bo_contact',
			'type'    => 'text',
		)
	);

	$wp_customize->add_setting(
		'ce_contact_sub',
		array(
			'default'           => 'Three short steps. A project director — not a sales rep — replies within one business day with a number and a mobilization date.',
			'type'              => 'theme_mod',
			'transport'         => 'postMessage',
			'sanitize_callback' => 'wp_kses_post',
			'show_in_rest'      => true,
		)
	);
	$wp_customize->add_control(
		'ce_contact_sub',
		array(
			'label'   => 'Contact Section Subtitle',
			'section' => 'ce_bo_contact',
			'type'    => 'textarea',
		)
	);

	// ===== SAFETY SECTION =====
	$wp_customize->add_setting(
		'ce_safety_kicker',
		array(
			'default'           => 'Safety & Certifications',
			'type'              => 'theme_mod',
			'transport'         => 'postMessage',
			'sanitize_callback' => 'sanitize_text_field',
			'show_in_rest'      => true,
		)
	);
	$wp_customize->add_control(
		'ce_safety_kicker',
		array(
			'label'   => 'Safety Section Kicker',
			'section' => 'ce_bo_safety',
			'type'    => 'text',
		)
	);

	$wp_customize->add_setting(
		'ce_safety_title',
		array(
			'default'           => 'Everyone goes home. Every shift. No asterisks.',
			'type'              => 'theme_mod',
			'transport'         => 'postMessage',
			'sanitize_callback' => 'sanitize_text_field',
			'show_in_rest'      => true,
		)
	);
	$wp_customize->add_control(
		'ce_safety_title',
		array(
			'label'   => 'Safety Section Title',
			'section' => 'ce_bo_safety',
			'type'    => 'text',
		)
	);

	// ===== METHOD SECTION =====
	$wp_customize->add_setting(
		'ce_method_kicker',
		array(
			'default'           => 'The Method',
			'type'              => 'theme_mod',
			'transport'         => 'postMessage',
			'sanitize_callback' => 'sanitize_text_field',
			'show_in_rest'      => true,
		)
	);
	$wp_customize->add_control(
		'ce_method_kicker',
		array(
			'label'   => 'Method Section Kicker',
			'section' => 'ce_bo_method',
			'type'    => 'text',
		)
	);

	// ===== FOOTER SECTION =====
	$wp_customize->add_setting(
		'ce_footer_copyright',
		array(
			'default'           => '© 2026 ConstructEdge Group · Lic. CGC-04821 · Bonded to $250M',
			'type'              => 'theme_mod',
			'transport'         => 'postMessage',
			'sanitize_callback' => 'wp_kses_post',
			'show_in_rest'      => true,
		)
	);
	$wp_customize->add_control(
		'ce_footer_copyright',
		array(
			'label'   => 'Footer Copyright Text',
			'section' => 'ce_bo_footer',
			'type'    => 'text',
		)
	);

	// ===== HEADER / NAV SECTION =====
	$wp_customize->add_setting(
		'ce_topbar_phone',
		array(
			'default'           => '(312) 555-0148',
			'type'              => 'theme_mod',
			'transport'         => 'postMessage',
			'sanitize_callback' => 'sanitize_text_field',
			'show_in_rest'      => true,
		)
	);
	$wp_customize->add_control(
		'ce_topbar_phone',
		array(
			'label'   => 'Top Bar Emergency Phone',
			'section' => 'ce_bo_header',
			'type'    => 'text',
		)
	);

	$wp_customize->add_setting(
		'ce_topbar_hours',
		array(
			'default'           => 'Field offices open 06:00–18:00 CT',
			'type'              => 'theme_mod',
			'transport'         => 'postMessage',
			'sanitize_callback' => 'sanitize_text_field',
			'show_in_rest'      => true,
		)
	);
	$wp_customize->add_control(
		'ce_topbar_hours',
		array(
			'label'   => 'Top Bar Hours Text',
			'section' => 'ce_bo_header',
			'type'    => 'text',
		)
	);
}
add_action( 'customize_register', 'constructedge_backoffice_register', 20 );

/**
 * Get backoffice content settings.
 *
 * @return array Aggregated backoffice content.
 */
function constructedge_get_backoffice_content() {
	$content = array();

	// Hero.
	$content['hero'] = array(
		'kicker'        => get_theme_mod( 'ce_hero_kicker', 'From Blueprint to Handover' ),
		'taglines'      => array(
			get_theme_mod( 'ce_hero_tagline_1', 'From first line to final beam.' ),
			get_theme_mod( 'ce_hero_tagline_2', 'Engineered precision. Field discipline.' ),
			get_theme_mod( 'ce_hero_tagline_3', 'One team. Zero blame games.' ),
		),
		'phaseTaglines' => array(
			get_theme_mod( 'ce_hero_phase_01', 'Drawing board active.' ),
			get_theme_mod( 'ce_hero_phase_02', 'Steel rising.' ),
			get_theme_mod( 'ce_hero_phase_03', 'Pouring floors.' ),
			get_theme_mod( 'ce_hero_phase_04', 'Glass ascending.' ),
			get_theme_mod( 'ce_hero_phase_05', 'Grounds taking shape.' ),
			get_theme_mod( 'ce_hero_phase_06', 'Keys ready.' ),
		),
		'ctaPrimary'    => get_theme_mod( 'ce_hero_cta_primary', 'Start Your Project' ),
		'ctaSecondary'  => get_theme_mod( 'ce_hero_cta_secondary', 'View Our Work' ),
		'subtext'       => get_theme_mod( 'ce_hero_subtext', 'High-rise, industrial and civil structures — engineered in-house, erected by our own crews. 1,240 delivered since 1987.' ),
	);

	// Services.
	$services = array( 'SVC-01', 'SVC-02', 'SVC-03', 'SVC-04', 'SVC-05', 'SVC-06' );
	$content['services'] = array();
	foreach ( $services as $code ) {
		$suffix = str_replace( '-', '_', $code );
		$content['services'][ $code ] = array(
			'name'     => get_theme_mod( "ce_service_{$suffix}_name", $code ),
			'tag'      => get_theme_mod( "ce_service_{$suffix}_tag", '' ),
			'desc'     => get_theme_mod( "ce_service_{$suffix}_desc", '' ),
			'duration' => get_theme_mod( "ce_service_{$suffix}_duration", '' ),
		);
	}

	// Contact.
	$content['contact'] = array(
		'kicker' => get_theme_mod( 'ce_contact_kicker', 'Open a Work Order' ),
		'title'  => get_theme_mod( 'ce_contact_title', 'Put it on our drawing board.' ),
		'sub'    => get_theme_mod( 'ce_contact_sub', 'Three short steps. A project director — not a sales rep — replies within one business day.' ),
	);

	// Safety.
	$content['safety'] = array(
		'kicker' => get_theme_mod( 'ce_safety_kicker', 'Safety & Certifications' ),
		'title'  => get_theme_mod( 'ce_safety_title', 'Everyone goes home. Every shift. No asterisks.' ),
	);

	// Method.
	$content['method'] = array(
		'kicker' => get_theme_mod( 'ce_method_kicker', 'The Method' ),
	);

	// Footer.
	$content['footer'] = array(
		'copyright' => get_theme_mod( 'ce_footer_copyright', '© 2026 ConstructEdge Group · Lic. CGC-04821 · Bonded to $250M' ),
	);

	// Header.
	$content['header'] = array(
		'topbar_phone'  => get_theme_mod( 'ce_topbar_phone', '(312) 555-0148' ),
		'topbar_hours'  => get_theme_mod( 'ce_topbar_hours', 'Field offices open 06:00–18:00 CT' ),
	);

	return $content;
}
