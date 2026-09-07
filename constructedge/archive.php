<?php
/**
 * The template for displaying archive pages.
 *
 * @package ConstructEdge
 */

get_header(); ?>

<main id="primary" class="site-main">
    <?php
    if ( have_posts() ) :
        ?>
        <div id="root" class="ce-root"></div>
        <?php
    else :
        ?>
        <div id="root" class="ce-root"></div>
        <?php
    endif;
    ?>
</main>

<?php get_footer();
