<?php
/**
 * Plugin Name:       Creative Slider Block
 * Plugin URI:        https://creativesliderblock.github.io
 * Description:       A custom Gutenberg Block that allows to showcase any content in a slider.
 * Requires at least: 6.2
 * Requires PHP:      7.1
 * Version:           1.0.1
 * Author:            Teva Studio
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       creative-slider-block
 *
 * @package CSBLO
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

if ( function_exists( 'csblo_fs' ) ) {
	csblo_fs()->set_basename( true, __FILE__ );
} else {

	if ( ! function_exists( 'csblo_fs' ) ) {
		// Create a helper function for easy SDK access.
		function csblo_fs() {
			global $csblo_fs;
	
			if ( ! isset( $csblo_fs ) ) {
				// Include Freemius SDK.
				require_once dirname(__FILE__) . '/freemius/start.php';
	
				$csblo_fs = fs_dynamic_init( array(
					'id'                  => '16506',
					'slug'                => 'creative-slider-block',
					'type'                => 'plugin',
					'public_key'          => 'pk_3068d1ccebb53a095adbc34f695eb',
					'is_premium'          => false,
					'has_addons'          => false,
					'has_paid_plans'      => false,
					'menu'                => array(
						'slug'           => 'csblo-page-settings',
						'account'        => false,
						'support'        => false,
					),
				) );
			}
	
			return $csblo_fs;
		}
	
		// Init Freemius.
		csblo_fs();
		// Signal that SDK was initiated.
		do_action( 'csblo_fs_loaded' );
	}

	// ... Your plugin's main file logic ...

	/**
	 * Main plugin class.
	 */
	class CSBLO_Init {

		/**
		 * Plugin version
		 *
		 * @var String
		 */
		public $version = '1.0.1';

		/**
		 * Class instance.
		 *
		 * @var CSBLO_Init
		 */
		private static $instance;

		/**
		 * Gets the instance
		 *
		 * @return CSBLO_Init
		 */
		public static function instance() {
			if ( ! isset( self::$instance ) ) {
				self::$instance = new self();

				/**
				 * Creative Slider Block loaded.
				 *
				 * Fires when Creative Slider Block is fully loaded and instantiated.
				 */
				do_action( 'csblo_loaded' );
			}
			return self::$instance;
		}

		/**
		 * Constructor.
		 */
		public function __construct() {
			$this->define_constants();
			$this->run();
			$this->includes();
		}

		/**
		 * Defines constants.
		 */
		public function define_constants() {
			define( 'CSBLO_VERSION', $this->version );
			define( 'CSBLO_ROOT_FILE', __FILE__ );
			define( 'CSBLO_DIR', plugin_dir_path( CSBLO_ROOT_FILE ) );
			define( 'CSBLO_URL', plugin_dir_url( CSBLO_ROOT_FILE ) );
		}

		/**
		 * Hooks.
		 */
		public function run() {
			add_action( 'plugins_loaded', array( $this, 'load_textdomain' ) );
			add_action( 'init', array( $this, 'init_blocks' ) );
		}

		/**
		 * Load text domain.
		 */
		public function load_textdomain() {
			load_plugin_textdomain( 'creative-slider-block', false, plugin_basename( realpath( __DIR__ . '/languages' ) ) );
		}

		/**
		 * Blocks initialization.
		 */
		public function init_blocks() {
			wp_register_script( 'csblo-swiper', CSBLO_URL . 'assets/vendor/swiper-bundle.min.js', array(), '11.1.11', true );

			register_block_type( CSBLO_DIR . 'dist/blocks/slides' );
			register_block_type( CSBLO_DIR . 'dist/blocks/slide' );

			// Load available translations.
			wp_set_script_translations( 'csblo-slides-editor-script-js', 'creative-slider-block' );
			wp_set_script_translations( 'csblo-slide-editor-script-js', 'creative-slider-block' );
		}

		/**
		 * Include required files.
		 */
		public function includes() {
			if ( is_admin() ) {
				require_once CSBLO_DIR . 'includes/admin/admin.php';
			}

			require_once CSBLO_DIR . 'includes/slides-slider-variation.php';
		}
	}

	/**
	 * Function responsible for returning the one true CSBLO_Init instance.
	 *
	 * @return CSBLO_Init instance
	 */
	function csblo_get_instance() {
		return CSBLO_Init::instance();
	}

	// Instantiate. Load on plugins_loaded action to avoid issue on multisite.
	if ( function_exists( 'is_multisite' ) && is_multisite() ) {
		// Priority (e.g., 90) ensures that some other plugins are fully initialized before plugin runs.
		add_action( 'plugins_loaded', 'csblo_get_instance', 90 );
	} else {
		csblo_get_instance();
	}
}
