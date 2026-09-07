<?php
/**
 * The template for displaying pages.
 *
 * @package ConstructEdge
 */

get_header(); ?>

<main id="primary" class="site-main">
    <?php
    while ( have_posts() ) :
        the_post();
        ?>
        <div id="root" class="ce-root"></div>
        <?php
    endwhile;
    ?>
</main>

<?php get_footer();
