/**
 * External dependencies
 */

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import domReady from '@wordpress/dom-ready';
import { registerBlockVariation } from '@wordpress/blocks';
import { createHigherOrderComponent } from '@wordpress/compose';
import { addFilter } from '@wordpress/hooks';

/**
 * Internal dependencies
 */
import SlidesSliderInspectorControls from './inspector-controls';

const SLIDES_SLIDER = 'csblo/slides-slider';

domReady( () => {
	registerBlockVariation( 'csblo/slides', {
		name: SLIDES_SLIDER,
		title: __( 'Creative Slider Block', 'creative-slider-block' ),
		description: __(
			'Display multiple blocks in the form of a slideshow, one slide at a time.',
			'creative-slider-block'
		),
		isDefault: true,
		scope: [ 'block', 'inserter', 'transform' ],
		isActive: ( blockAttributes ) =>
			! blockAttributes.type ||
			blockAttributes.type === 'default' ||
			blockAttributes.type === 'slider',
		attributes: {
			type: 'slider',
			className: 'csblo-slides-slider',
		},
	} );
} );

function addSlidesSliderVariationAttributes( settings ) {
	if ( settings.name === 'csblo/slides' ) {
		return {
			...settings,
			attributes: {
				...settings.attributes,
				sliderEffect: {
					type: 'string',
					default: 'slide',
				},
				sliderSlideDirection: {
					type: 'string',
				},
				sliderSlideGap: {
					type: 'number',
				},
				sliderCreativeKeyframes: {
					type: 'object',
					properties: {
						opacityNext: {
							type: 'number',
						},
						scaleNext: {
							type: 'number',
						},
						translateXNext: {
							type: 'number',
						},
						translateYNext: {
							type: 'number',
						},
						translateZNext: {
							type: 'number',
						},
						rotateXNext: {
							type: 'number',
						},
						rotateYNext: {
							type: 'number',
						},
						rotateZNext: {
							type: 'number',
						},
						opacityPrev: {
							type: 'number',
						},
						scalePrev: {
							type: 'number',
						},
						translateXPrev: {
							type: 'number',
						},
						translateYPrev: {
							type: 'number',
						},
						translateZPrev: {
							type: 'number',
						},
						rotateXPrev: {
							type: 'number',
						},
						rotateYPrev: {
							type: 'number',
						},
						rotateZPrev: {
							type: 'number',
						},
					},
				},
			},
		};
	}

	return settings;
}

addFilter(
	'blocks.registerBlockType',
	`csblo/add-slides-slider-variation-attributes`,
	addSlidesSliderVariationAttributes
);

const withSlidesSliderInspectorControls = createHigherOrderComponent(
	( BlockEdit ) => {
		return ( props ) => {
			const { name, attributes } = props;

			if ( name !== 'csblo/slides' ) {
				return <BlockEdit { ...props } />;
			}

			const type = attributes?.type ?? '';

			if ( type !== 'slider' ) {
				return <BlockEdit { ...props } />;
			}

			return (
				<>
					<SlidesSliderInspectorControls { ...props } />
					<BlockEdit { ...props } />
				</>
			);
		};
	},
	'withSlidesSliderInspectorControls'
);

addFilter(
	'editor.BlockEdit',
	'csblo/slide-slider-inspector-controls',
	withSlidesSliderInspectorControls
);

function addSlidesSliderSwiperConfig( swiperConfig, attributes ) {
	if ( attributes?.type !== 'slider' ) {
		return swiperConfig;
	}

	const effect = attributes?.sliderEffect ?? 'slide';
	const slideDirection = attributes?.sliderSlideDirection ?? 'horizontal';
	const slideGap = attributes?.sliderSlideGap ?? 0;
	const sliderCreativeKeyframes = attributes?.sliderCreativeKeyframes;

	if ( effect === 'slide' ) {
		swiperConfig = {
			...swiperConfig,
			effect,
			direction: slideDirection,
			spaceBetween: slideGap,
		};
	}

	if ( effect === 'fade' ) {
		swiperConfig = {
			...swiperConfig,
			effect,
			direction: slideDirection,
		};
	}

	if ( effect === 'creative' ) {
		const opacityNext =
			!! sliderCreativeKeyframes?.opacityNext ||
			sliderCreativeKeyframes?.opacityNext === 0
				? parseFloat( sliderCreativeKeyframes?.opacityNext )
				: 1;
		const scaleNext =
			!! sliderCreativeKeyframes?.scaleNext ||
			sliderCreativeKeyframes?.scaleNext === 0
				? parseFloat( sliderCreativeKeyframes?.scaleNext )
				: 1;
		const translateXNext =
			!! sliderCreativeKeyframes?.translateXNext ||
			sliderCreativeKeyframes?.translateXNext === 0
				? parseInt( sliderCreativeKeyframes?.translateXNext, 10 )
				: 0;
		const translateYNext =
			!! sliderCreativeKeyframes?.translateYNext ||
			sliderCreativeKeyframes?.translateYNext === 0
				? parseInt( sliderCreativeKeyframes?.translateYNext, 10 )
				: 0;
		const translateZNext =
			!! sliderCreativeKeyframes?.translateZNext ||
			sliderCreativeKeyframes?.translateZNext === 0
				? parseInt( sliderCreativeKeyframes?.translateZNext, 10 )
				: 0;
		const rotateXNext =
			!! sliderCreativeKeyframes?.rotateXNext ||
			sliderCreativeKeyframes?.rotateXNext === 0
				? parseInt( sliderCreativeKeyframes?.rotateXNext, 10 )
				: 0;
		const rotateYNext =
			!! sliderCreativeKeyframes?.rotateYNext ||
			sliderCreativeKeyframes?.rotateYNext === 0
				? parseInt( sliderCreativeKeyframes?.rotateYNext, 10 )
				: 0;
		const rotateZNext =
			!! sliderCreativeKeyframes?.rotateZNext ||
			sliderCreativeKeyframes?.rotateZNext === 0
				? parseInt( sliderCreativeKeyframes?.rotateZNext, 10 )
				: 0;

		const opacityPrev =
			!! sliderCreativeKeyframes?.opacityPrev ||
			sliderCreativeKeyframes?.opacityPrev === 0
				? parseFloat( sliderCreativeKeyframes?.opacityPrev )
				: 1;
		const scalePrev =
			!! sliderCreativeKeyframes?.scalePrev ||
			sliderCreativeKeyframes?.scalePrev === 0
				? parseFloat( sliderCreativeKeyframes?.scalePrev )
				: 1;
		const translateXPrev =
			!! sliderCreativeKeyframes?.translateXPrev ||
			sliderCreativeKeyframes?.translateXPrev === 0
				? parseInt( sliderCreativeKeyframes?.translateXPrev, 10 )
				: 0;
		const translateYPrev =
			!! sliderCreativeKeyframes?.translateYPrev ||
			sliderCreativeKeyframes?.translateYPrev === 0
				? parseInt( sliderCreativeKeyframes?.translateYPrev, 10 )
				: 0;
		const translateZPrev =
			!! sliderCreativeKeyframes?.translateZPrev ||
			sliderCreativeKeyframes?.translateZPrev === 0
				? parseInt( sliderCreativeKeyframes?.translateZPrev, 10 )
				: 0;
		const rotateXPrev =
			!! sliderCreativeKeyframes?.rotateXPrev ||
			sliderCreativeKeyframes?.rotateXPrev === 0
				? parseInt( sliderCreativeKeyframes?.rotateXPrev, 10 )
				: 0;
		const rotateYPrev =
			!! sliderCreativeKeyframes?.rotateYPrev ||
			sliderCreativeKeyframes?.rotateYPrev === 0
				? parseInt( sliderCreativeKeyframes?.rotateYPrev, 10 )
				: 0;
		const rotateZPrev =
			!! sliderCreativeKeyframes?.rotateZPrev ||
			sliderCreativeKeyframes?.rotateZPrev === 0
				? parseInt( sliderCreativeKeyframes?.rotateZPrev, 10 )
				: 0;

		swiperConfig = {
			...swiperConfig,
			effect,
			direction: slideDirection,

			creativeEffect: {
				next: {
					opacity: opacityNext,
					scale: scaleNext,
					translate: [
						`${ translateXNext }%`,
						`${ translateYNext }%`,
						`${ translateZNext }px`,
					],
					rotate: [ rotateXNext, rotateYNext, rotateZNext ],
				},
				prev: {
					opacity: opacityPrev,
					scale: scalePrev,
					translate: [
						`${ translateXPrev }%`,
						`${ translateYPrev }%`,
						`${ translateZPrev }px`,
					],
					rotate: [ rotateXPrev, rotateYPrev, rotateZPrev ],
				},
			},
		};
	}

	return swiperConfig;
}

addFilter( 'csbloSwiperConfigEditor', 'csblo/slides', addSlidesSliderSwiperConfig );
