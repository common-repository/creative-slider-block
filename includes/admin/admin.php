<?php
/**
 * Admin page
 *
 * @package CSBLO
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Create admin menu.
 */
function csblo_admin_menu() {

	add_menu_page(
		__( 'Creative Slider Block', 'creative-slider-block' ),
		__( 'Creative Slider Block', 'creative-slider-block' ),
		'manage_options',
		'csblo-page-settings',
		'csblo_settings_page_render',
		'dashicons-editor-code'
	);
}
add_action( 'admin_menu', 'csblo_admin_menu' );

/**
 * Render settings page.
 */
function csblo_settings_page_render()
{
?>
	<main class='csblo-admin-page-wrap'>
		<h2 class='csblo-admin-page-title'>Welcome to Creative Slider Block</h2>

		<div class='csblo-admin-page-actions'>
			<a href="https://creativesliderblock.github.io/" target="_blank" class='csblo-admin-page-action'>
				Documentation
			</a>
		</div>
	</main>
<?php
}

/**
 * Admin menu assets.
 */
function csblo_admin_assets() {

	$screen = get_current_screen();
	if( strpos( $screen->id, 'csblo-page-settings' ) !== false ) {
		wp_enqueue_style(
			'csblo-admin-page',
			CSBLO_URL . 'dist/admin/admin-page.css',
			array(),
			CSBLO_VERSION
		);
	}
}
add_action( 'admin_enqueue_scripts', 'csblo_admin_assets' );