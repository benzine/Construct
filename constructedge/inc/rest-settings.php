<?php
/**
 * REST settings + form submission endpoints.
 *
 * Exposes:
 *   GET  /wp-json/constructedge/v1/settings   — aggregated design tokens
 *   POST /wp-json/constructedge/v1/submit     — contact form → email
 *
 * @package ConstructEdge
 */
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
/**
 * Register the settings route.
 */
function constructedge_register_settings_route() {
	register_rest_route(
		'constructedge/v1',
		'/settings',
		array(
			'methods'             => WP_REST_Server::READABLE,
			'permission_callback' => '__return_true', // Settings are public design tokens.
			'callback'            => 'constructedge_rest_settings',
		)
	);
}
add_action( 'rest_api_init', 'constructedge_register_settings_route' );
/**
 * Return the settings object.
 *
 * @return WP_REST_Response
 */
function constructedge_rest_settings() {
	return rest_ensure_response( constructedge_get_settings() );
}
/* ====================================================================== */
/* Form submission endpoint — validates, sanitises and emails a work     */
/* order. Honeypot + optional reCAPTCHA v2 keep the bots out.            */
/* ====================================================================== */
/**
 * Register the submission route.
 */
function constructedge_register_submit_route() {
	register_rest_route(
		'constructedge/v1',
		'/submit',
		array(
			'methods'             => WP_REST_Server::CREATABLE,
			'permission_callback' => '__return_true', // Public form — protected by honeypot + recaptcha.
			'callback'            => 'constructedge_rest_submit',
		)
	);
}
add_action( 'rest_api_init', 'constructedge_register_submit_route' );
/**
 * Very light rate-limit: max 3 submissions per IP per 5 minutes.
 *
 * @param string $ip Client IP.
 * @return bool True if allowed.
 */
function constructedge_rate_limit_ok( $ip ) {
	$key    = 'ce_submit_' . md5( $ip );
	$window = 300; // 5 minutes.
	$max    = 3;
	$hits   = (array) get_transient( $key );
	$now    = time();
	$hits   = array_filter( $hits, function ( $t ) use ( $now, $window ) {
		return ( $now - $t ) < $window;
	} );
	if ( count( $hits ) >= $max ) {
		return false;
	}
	$hits[] = $now;
	set_transient( $key, $hits, $window );
	return true;
}
/**
 * Verify a reCAPTCHA v2 "I'm not a robot" response token.
 *
 * @param string $token  User response token.
 * @param string $secret Site secret key.
 * @return bool
 */
function constructedge_verify_recaptcha( $token, $secret ) {
	if ( ! $token || ! $secret ) {
		return false;
	}
	$resp = wp_remote_post(
		'https://www.google.com/recaptcha/api/siteverify',
		array(
			'body' => array(
				'secret'   => $secret,
				'response' => $token,
			),
		)
	);
	if ( is_wp_error( $resp ) ) {
		return false;
	}
	$data = json_decode( wp_remote_retrieve_body( $resp ), true );
	return ! empty( $data['success'] );
}
/**
 * Build the plain-text email body from submission data.
 *
 * @param array  $f   Sanitised form fields.
 * @param string $ref Reference number.
 * @return string
 */
function constructedge_build_email_body( $f, $ref ) {
	$lines   = array();
	$lines[] = '══════════════════════════════════════════';
	$lines[] = '  CONSTRUCTEDGE — WORK ORDER';
	$lines[] = '  REF: ' . $ref;
	$lines[] = '══════════════════════════════════════════';
	$lines[] = '';
	$lines[] = '── PROJECT ──────────────────────────────';
	$lines[] = 'Type:        ' . ( $f['projType'] ?? '—' );
	$lines[] = 'Footprint:   ' . ( $f['sqft'] ?? '—' ) . ' sq-ft';
	$lines[] = 'Site:        ' . ( $f['city'] ?? '—' );
	$lines[] = 'Budget:      ' . ( $f['budget'] ?? '—' );
	$lines[] = 'Timeline:    ' . ( $f['timeline'] ?? '—' );
	if ( ! empty( $f['scope'] ) ) {
		$lines[] = 'Scope notes: ' . $f['scope'];
	}
	$lines[] = '';
	$lines[] = '── CONTACT ──────────────────────────────';
	$lines[] = 'Name:        ' . ( $f['name'] ?? '—' );
	$lines[] = 'Company:     ' . ( $f['company'] ?? '—' );
	$lines[] = 'Email:       ' . ( $f['email'] ?? '—' );
	$lines[] = 'Phone:       ' . ( $f['phone'] ?? '—' );
	if ( ! empty( $f['message'] ) ) {
		$lines[] = '';
		$lines[] = '── MESSAGE ──────────────────────────────';
		$lines[] = $f['message'];
	}
	if ( ! empty( $f['selector'] ) ) {
		$lines[] = '';
		$lines[] = '── SERVICE SELECTOR ─────────────────────';
		$sel = $f['selector'];
		if ( ! empty( $sel['service'] ) ) {
			$lines[] = 'Dispatched:  ' . $sel['service'];
		}
		if ( ! empty( $sel['code'] ) ) {
			$lines[] = 'Zone code:   ' . $sel['code'];
		}
		if ( ! empty( $sel['answers'] ) && is_array( $sel['answers'] ) ) {
			$lines[] = 'Answers:     ' . implode( '  →  ', $sel['answers'] );
		}
	}
	$lines[] = '';
	$lines[] = '──────────────────────────────────────────';
	$lines[] = 'Sent from ' . home_url() . ' on ' . gmdate( 'c' );
	$lines[] = '';
	return implode( "\n", $lines );
}
/**
 * POST /constructedge/v1/submit — validate, sanitise, email.
 *
 * @param WP_REST_Request $request Incoming request.
 * @return WP_REST_Response|WP_Error
 */
function constructedge_rest_submit( $request ) {
	$settings = constructedge_get_settings();
	$contact  = $settings['contact'];
	$params   = $request->get_json_params();
	if ( empty( $params ) ) {
		$params = $request->get_body_params();
	}
	// --- Rate limit ----------------------------------------------------
	$ip = isset( $_SERVER['REMOTE_ADDR'] ) ? sanitize_text_field( wp_unslash( $_SERVER['REMOTE_ADDR'] ) ) : 'unknown';
	if ( ! constructedge_rate_limit_ok( $ip ) ) {
		return new WP_Error(
			'ce_rate_limited',
			'Too many submissions. Please wait a few minutes and try again.',
			array( 'status' => 429 )
		);
	}
	// --- Honeypot ------------------------------------------------------
	if ( ! empty( $contact['honeypot'] ) && ! empty( $params['website'] ) ) {
		// Bot filled the hidden field — silently accept but don't email.
		return rest_ensure_response(
			array(
				'ok'   => true,
				'ref'  => 'CE-' . gmdate( 'Y' ) . '-' . wp_rand( 1000, 9999 ),
				'note' => 'silent',
			)
		);
	}
	// --- reCAPTCHA v2 --------------------------------------------------
	if ( ! empty( $contact['recaptcha']['enabled'] ) ) {
		$secret = get_theme_mod( 'ce_contact_recaptcha_secret', '' );
		$token  = isset( $params['recaptchaToken'] ) ? sanitize_text_field( $params['recaptchaToken'] ) : '';
		if ( ! $token || ! $secret || ! constructedge_verify_recaptcha( $token, $secret ) ) {
			return new WP_Error(
				'ce_recaptcha_fail',
				'Please verify you are not a robot.',
				array( 'status' => 400 )
			);
		}
	}
	// --- Required-field validation ------------------------------------
	$required = array( 'name', 'email' );
	$missing  = array();
	foreach ( $required as $k ) {
		if ( empty( $params[ $k ] ) ) {
			$missing[] = $k;
		}
	}
	// Also require the visible project-level fields if present in the payload.
	if ( isset( $params['projType'] ) && empty( $params['projType'] ) ) {
		$missing[] = 'projType';
	}
	if ( ! empty( $missing ) ) {
		return new WP_Error(
			'ce_validation',
			'Please complete all required fields.',
			array(
				'status'  => 400,
				'fields'  => $missing,
			)
		);
	}
	if ( ! empty( $params['email'] ) && ! is_email( $params['email'] ) ) {
		return new WP_Error(
			'ce_validation',
			'Please enter a valid email address.',
			array( 'status' => 400, 'fields' => array( 'email' ) )
		);
	}
	// --- Sanitise ------------------------------------------------------
	$f = array(
		'projType' => isset( $params['projType'] ) ? sanitize_text_field( $params['projType'] ) : '',
		'sqft'     => isset( $params['sqft'] ) ? sanitize_text_field( $params['sqft'] ) : '',
		'city'     => isset( $params['city'] ) ? sanitize_text_field( $params['city'] ) : '',
		'budget'   => isset( $params['budget'] ) ? sanitize_text_field( $params['budget'] ) : '',
		'timeline' => isset( $params['timeline'] ) ? sanitize_text_field( $params['timeline'] ) : '',
		'scope'    => isset( $params['scope'] ) ? sanitize_textarea_field( $params['scope'] ) : '',
		'name'     => isset( $params['name'] ) ? sanitize_text_field( $params['name'] ) : '',
		'company'  => isset( $params['company'] ) ? sanitize_text_field( $params['company'] ) : '',
		'email'    => isset( $params['email'] ) ? sanitize_email( $params['email'] ) : '',
		'phone'    => isset( $params['phone'] ) ? sanitize_text_field( $params['phone'] ) : '',
		'message'  => isset( $params['message'] ) ? sanitize_textarea_field( $params['message'] ) : '',
	);
	// Selector draft (read-only pass-through).
	if ( ! empty( $params['selector'] ) && is_array( $params['selector'] ) ) {
		$f['selector'] = array(
			'code'    => isset( $params['selector']['code'] ) ? sanitize_text_field( $params['selector']['code'] ) : '',
			'service' => isset( $params['selector']['service'] ) ? sanitize_text_field( $params['selector']['service'] ) : '',
			'answers' => isset( $params['selector']['answers'] ) && is_array( $params['selector']['answers'] )
				? array_map( 'sanitize_text_field', $params['selector']['answers'] )
				: array(),
		);
	}
	// --- Reference number ---------------------------------------------
	$ref = 'CE-' . gmdate( 'Y' ) . '-' . wp_rand( 1000, 9999 );
	// --- Build email ---------------------------------------------------
	$recipient = ! empty( $contact['recipient'] ) ? $contact['recipient'] : get_option( 'admin_email' );
	$subject   = ! empty( $contact['subjectPattern'] )
		? str_replace( '{ref}', $ref, $contact['subjectPattern'] )
		: 'CE Work Order — ' . $ref;
	$sender_name = ! empty( $f['name'] ) ? $f['name'] : 'Website';
	$sender_addr = ! empty( $f['email'] ) ? $f['email'] : 'no-reply@' . wp_parse_url( home_url(), PHP_URL_HOST );
	$body = constructedge_build_email_body( $f, $ref );
	$headers = array(
		'Content-Type: text/plain; charset=UTF-8',
		'From: ' . $sender_name . ' <' . $sender_addr . '>',
		'Reply-To: ' . $sender_name . ' <' . $sender_addr . '>',
		'X-ConstructEdge-Ref: ' . $ref,
	);
	// --- Send ----------------------------------------------------------
	$sent = wp_mail( $recipient, $subject, $body, $headers );
	/**
	 * Fires after a work order is submitted (whether email succeeded or not).
	 * Hook here to log to a CPT, CRM webhook, Slack, etc.
	 */
	do_action( 'constructedge_submission', $f, $ref, $sent );
	return rest_ensure_response(
		array(
			'ok'   => $sent,
			'ref'  => $ref,
			'note' => $sent ? 'delivered' : 'queued',
		)
	);
}
