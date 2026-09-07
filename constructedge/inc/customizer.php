<?php
/**
 * Customizer panel.
 *
 * Registers every setting (show_in_rest => true) and groups them into the
 * sections required by the spec: Colors, Typography, Layout, Header, Footer,
 * Buttons, Animations, Service Selector, Contact Form, Search, Advanced.
 * All settings transport via postMessage and are applied live by
 * assets/customizer-preview.js.
 *
 * @package ConstructEdge
 */
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
/**
 * Register Customizer settings, sections and controls.
 *
 * @param WP_Customize_Manager $wp_customize Customizer manager.
 */
function constructedge_customize_register( $wp_customize ) {
	$map = constructedge_settings_map();
	// Section definitions: id => [ title, description ].
	$sections = array(
		'ce_colors'     => array( __( 'Colors', 'constructedge' ), __( 'Primary, accent and shift palettes.', 'constructedge' ) ),
		'ce_typography' => array( __( 'Typography', 'constructedge' ), __( 'Fonts, sizes and weights.', 'constructedge' ) ),
		'ce_layout'     => array( __( 'Layout', 'constructedge' ), __( 'Container, spacing and radius.', 'constructedge' ) ),
		'ce_header'     => array( __( 'Header', 'constructedge' ), __( 'Logo and sticky behaviour.', 'constructedge' ) ),
		'ce_footer'     => array( __( 'Footer', 'constructedge' ), __( 'Copyright and columns.', 'constructedge' ) ),
		'ce_buttons'    => array( __( 'Buttons', 'constructedge' ), __( 'CTA colors and radius.', 'constructedge' ) ),
		'ce_animations' => array( __( 'Animations', 'constructedge' ), __( 'Master toggle and speed.', 'constructedge' ) ),
		'ce_selector'   => array( __( 'Service Selector', 'constructedge' ), __( 'Three-question service router. Separate options with the | (pipe) character.', 'constructedge' ) ),
		'ce_contact'    => array( __( 'Contact Form', 'constructedge' ), __( 'Work order email delivery and anti-spam.', 'constructedge' ) ),
		'ce_search'     => array( __( 'Search', 'constructedge' ), __( 'Search overlay z-index and behaviour.', 'constructedge' ) ),
		'ce_advanced'   => array( __( 'Advanced', 'constructedge' ), __( 'Custom CSS injection.', 'constructedge' ) ),
	);
	foreach ( $sections as $id => $sec ) {
		$wp_customize->add_section(
			$id,
			array(
				'title'       => $sec[0],
				'description' => $sec[1],
				'priority'    => 30,
			)
		);
	}
	// Map each setting to a section.
	$section_for = array(
		'ce_accent' => 'ce_colors', 'ce_rust' => 'ce_colors', 'ce_brass' => 'ce_colors',
		'ce_steel' => 'ce_colors', 'ce_muted' => 'ce_colors', 'ce_dark_bg' => 'ce_colors',
		'ce_dark_ink' => 'ce_colors', 'ce_light_bg' => 'ce_colors', 'ce_light_ink' => 'ce_colors',
		'ce_font_body' => 'ce_typography', 'ce_font_display' => 'ce_typography',
		'ce_font_mono' => 'ce_typography', 'ce_base_size' => 'ce_typography',
		'ce_heading_weight' => 'ce_typography',
		'ce_container' => 'ce_layout', 'ce_section_pad' => 'ce_layout',
		'ce_gutter' => 'ce_layout', 'ce_radius' => 'ce_layout',
		'ce_logo_text' => 'ce_header', 'ce_sticky_header' => 'ce_header',
		'ce_copyright' => 'ce_footer', 'ce_footer_cols' => 'ce_footer',
		'ce_button_bg' => 'ce_buttons', 'ce_button_hover' => 'ce_buttons',
		'ce_button_text' => 'ce_buttons', 'ce_button_radius' => 'ce_buttons',
		'ce_anim_master' => 'ce_animations', 'ce_anim_speed' => 'ce_animations',
		'ce_scroll_reveal' => 'ce_animations',
		'ce_sel_q1_label' => 'ce_selector', 'ce_sel_q1_opts' => 'ce_selector',
		'ce_sel_q2_label' => 'ce_selector', 'ce_sel_q2_opts' => 'ce_selector',
		'ce_sel_q3_label' => 'ce_selector', 'ce_sel_q3_opts' => 'ce_selector',
		'ce_contact_email' => 'ce_contact', 'ce_contact_subject' => 'ce_contact',
		'ce_contact_honeypot' => 'ce_contact', 'ce_contact_recaptcha' => 'ce_contact',
		'ce_contact_recaptcha_key' => 'ce_contact', 'ce_contact_recaptcha_secret' => 'ce_contact',
		'ce_search_zindex' => 'ce_search',
		'ce_custom_css' => 'ce_advanced',
	);
	// Fields that should use a textarea (pipe-separated option lists, long text).
	$textarea_fields = array( 'ce_sel_q1_opts', 'ce_sel_q2_opts', 'ce_sel_q3_opts', 'ce_custom_css' );
	// Fields that should use email type.
	$email_fields = array( 'ce_contact_email' );
	foreach ( $map as $mod => $def ) {
		list( $js_key, $default, $type ) = $def;
		$section = isset( $section_for[ $mod ] ) ? $section_for[ $mod ] : 'ce_advanced';
		$wp_customize->add_setting(
			$mod,
			array(
				'default'           => $default,
				'type'              => 'theme_mod',
				'transport'         => 'postMessage',
				'sanitize_callback' => 'color' === $type ? 'sanitize_hex_color' : ( 'boolean' === $type ? 'rest_sanitize_boolean' : 'sanitize_text_field' ),
				'show_in_rest'      => true, // Available via /wp-json (Rule 3).
			)
		);
		$label = ucwords( str_replace( array( 'ce_', '_' ), array( '', ' ' ), $mod ) );
		// Per-field descriptions for clarity.
		$description = '';
		if ( in_array( $mod, array( 'ce_sel_q1_opts', 'ce_sel_q2_opts', 'ce_sel_q3_opts' ), true ) ) {
			$description = __( 'Separate options with the | (pipe) character. The React selector matches keywords to route answers to service codes.', 'constructedge' );
		}
		if ( 'ce_contact_email' === $mod ) {
			$description = __( 'Leave blank to use the WordPress admin email. Submissions are sent here via wp_mail().', 'constructedge' );
		}
		if ( 'ce_contact_subject' === $mod ) {
			$description = __( 'Use {ref} as a placeholder for the auto-generated reference number.', 'constructedge' );
		}
		if ( 'ce_contact_honeypot' === $mod ) {
			$description = __( 'Adds a hidden "website" field that bots fill in — blocks most spam without user friction.', 'constructedge' );
		}
		if ( 'ce_search_zindex' === $mod ) {
			$description = __( 'Raise this if the search close button sits behind the navigation menu.', 'constructedge' );
		}
		$control_args = array(
			'label'       => $label,
			'section'     => $section,
			'description' => $description,
		);
		if ( 'color' === $type ) {
			$wp_customize->add_control(
				new WP_Customize_Color_Control(
					$wp_customize,
					$mod,
					array(
						'label'   => $label,
						'section' => $section,
					)
				)
			);
		} elseif ( 'boolean' === $type ) {
			$wp_customize->add_control(
				$mod,
				array(
					'label'       => $label,
					'section'     => $section,
					'type'        => 'checkbox',
					'description' => $description,
				)
			);
		} elseif ( 'select' === $type ) {
			$choices = array();
			if ( 'ce_heading_weight' === $mod ) {
				$choices = array( '400' => '400', '500' => '500', '600' => '600', '700' => '700', '800' => '800' );
			}
			if ( 'ce_footer_cols' === $mod ) {
				$choices = array( '2' => '2', '3' => '3', '4' => '4', '5' => '5', '6' => '6' );
			}
			$wp_customize->add_control(
				$mod,
				array(
					'label'       => $label,
					'section'     => $section,
					'type'        => 'select',
					'choices'     => $choices,
					'description' => $description,
				)
			);
		} elseif ( in_array( $mod, $textarea_fields, true ) ) {
			$wp_customize->add_control(
				$mod,
				array_merge(
					$control_args,
					array(
						'type' => 'textarea',
					)
				)
			);
		} else {
			$control_type = 'text';
			if ( in_array( $mod, $email_fields, true ) ) {
				$control_type = 'email';
			} elseif ( 'number' === $type || strpos( $mod, 'size' ) || strpos( $mod, 'pad' ) || strpos( $mod, 'gutter' ) || strpos( $mod, 'radius' ) || strpos( $mod, 'container' ) || strpos( $mod, 'speed' ) || strpos( $mod, 'zindex' ) ) {
				$control_type = 'number';
			}
			$wp_customize->add_control(
				$mod,
				array_merge(
					$control_args,
					array(
						'type' => $control_type,
					)
				)
			);
		}
	}
	// Native custom logo control (WP media library) into the Header section.
	$wp_customize->add_control(
		new WP_Customize_Cropped_Image_Control(
			$wp_customize,
			'custom_logo',
			array(
				'label'   => __( 'Logo', 'constructedge' ),
				'section' => 'ce_header',
			)
		)
	);
}
add_action( 'customize_register', 'constructedge_customize_register' );
