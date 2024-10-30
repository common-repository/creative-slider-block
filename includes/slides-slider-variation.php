<?php
/**
 * Responsible for registering Slider block variation of csblo/slides block
 *
 * @package CSBLO
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

function csblo_add_slides_slider_variation() {

	$asset_file = include CSBLO_DIR . 'dist/variations/slides-slider-variation/slides-slider-variation.asset.php';
	$deps = $asset_file['dependencies'];

	wp_enqueue_script(
		'csblo-slides-slider-variation',
		CSBLO_URL . 'dist/variations/slides-slider-variation/slides-slider-variation.js',
		$deps,
		CSBLO_VERSION,
		true
	);

	wp_set_script_translations( 'csblo-slides-slider-variation', 'creative-slider-block' );
}
add_action( 'enqueue_block_editor_assets', 'csblo_add_slides_slider_variation' );

/**
 * Register front end assets.
 */
function csblo_slides_slider_variation_frontend_assets() {

	$asset_file = include( CSBLO_DIR . 'dist/variations/slides-slider-variation/slides-slider-variation-frontend.asset.php' );
	wp_register_script(
		'csblo-slides-slider-frontend',
		CSBLO_URL . 'dist/variations/slides-slider-variation/slides-slider-variation-frontend.js',
		array_merge( $asset_file['dependencies'], array( 'csblo-swiper' ) ),
		CSBLO_VERSION,
		true
	);
}
add_action( 'wp_enqueue_scripts', 'csblo_slides_slider_variation_frontend_assets' );

/**
 * Server-side filter block
 * 
 * @param string $block_content Rendered block content.
 * @param array  $block         The full block, including name and attribute.
 * @return string               The filtered $block_content.
 */
function csblo_slides_slider_variation_render( $block_content, $block ) {

	if ( $block['blockName'] !== 'csblo/slides' ) {
		return $block_content;
	}

	$is_slider_variation = isset( $block['attrs']['type'] ) && 'slider' === $block['attrs']['type'];
	if ( ! $is_slider_variation ) {
		return $block_content;
	}

	wp_enqueue_script( 'csblo-slides-slider-frontend' );

	$swiper_options = array();
	$slider_effect = ! empty( $block['attrs']['sliderEffect'] ) ? $block['attrs']['sliderEffect'] : 'slide';

	$swiper_options['effect'] = $slider_effect;
	$swiper_options['speed'] = isset( $block['attrs']['speed'] ) && is_numeric( $block['attrs']['speed'] ) ? $block['attrs']['speed'] : 300;
	$swiper_options['loop'] = isset( $block['attrs']['loop'] ) && $block['attrs']['loop'] ? true : false;
	if ( isset( $block['attrs']['autoplayEnable'] ) && $block['attrs']['autoplayEnable'] ) {
		$swiper_options['autoplay']['enable'] = true;
		if ( isset( $block['attrs']['autoplayDelay'] ) && is_numeric( $block['attrs']['autoplayDelay'] ) ) {
			$swiper_options['autoplay']['delay'] = $block['attrs']['autoplayDelay'];
		}
		if ( isset( $block['attrs']['autoplayHoverPause'] ) && $block['attrs']['autoplayHoverPause'] ) {
			$swiper_options['autoplay']['hoverPause'] = true;
		}
		if ( isset( $block['attrs']['autoplayDisableInteraction'] ) && $block['attrs']['autoplayDisableInteraction'] ) {
			$swiper_options['autoplay']['disableInteraction'] = true;
		}
		if ( isset( $block['attrs']['autoplayStopLast'] ) && $block['attrs']['autoplayStopLast'] ) {
			$swiper_options['autoplay']['stopLast'] = true;
		}
	}
	if ( isset( $block['attrs']['paginationEnable'] ) && $block['attrs']['paginationEnable'] ) {
		$swiper_options['pagination']['enable'] = true;
		$swiper_options['pagination']['type'] = ! empty( $block['attrs']['paginationType'] ) ? $block['attrs']['paginationType'] : 'bullets';
	}

	$swiper_options['direction'] = ! empty( $block['attrs']['sliderSlideDirection'] ) ? $block['attrs']['sliderSlideDirection'] : 'horizontal';

	if ( 'slide' === $slider_effect ) {
		$swiper_options['spaceBetween'] = isset( $block['attrs']['sliderSlideGap'] ) && is_numeric( $block['attrs']['sliderSlideGap'] ) ? $block['attrs']['sliderSlideGap'] : 0;
	}

	if ( 'creative' === $slider_effect ) {
		$keyframes_properties = array( 'opacityNext', 'scaleNext', 'translateXNext', 'translateYNext', 'translateZNext', 'rotateXNext', 'rotateYNext', 'rotateZNext', 'opacityPrev', 'scalePrev', 'translateXPrev', 'translateYPrev', 'translateZPrev', 'rotateXPrev', 'rotateYPrev', 'rotateZPrev' );
	
		foreach ( $keyframes_properties as $property) {
			if ( isset( $block['attrs']['sliderCreativeKeyframes'][$property] ) && is_numeric( $block['attrs']['sliderCreativeKeyframes'][$property] ) ) {
				$swiper_options['creativeKeyframes'][$property] = $block['attrs']['sliderCreativeKeyframes'][$property];
			}
		}
	}

	$p = new WP_HTML_Tag_Processor( $block_content );
	$swiper_query = array(
		'class_name' => 'swiper',
	);
	if ( $p->next_tag( $swiper_query ) ) {
		$p->set_attribute( 'data-csblo-swiper-options', wp_json_encode( $swiper_options ) );
	}

	$block_content = $p->get_updated_html();

	return $block_content;
}
add_filter( 'render_block', 'csblo_slides_slider_variation_render', 10, 2 );
