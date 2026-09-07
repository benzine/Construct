<?php
/**
 * The main template.
 *
 * The React app mounts into #root and renders the ENTIRE frontend, so this
 * file is intentionally a minimal shell. wp_head() attaches the compiled
 * React bundle plus the wpReactSettings object (see inc/enqueue.php).
 *
 * @package ConstructEdge
 */

get_header(); ?>

<div id="root" class="ce-root"></div>

<?php get_footer();
