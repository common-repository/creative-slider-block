/**
 * External dependencies
 */
import classnames from 'classnames';
import { Swiper } from 'swiper';
import {
	Autoplay,
	Navigation,
	Pagination,
	Parallax,
	EffectFade,
	EffectCoverflow,
	EffectCreative,
} from 'swiper/modules';

/**
 * WordPress dependencies
 */
import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';
import { memo, useRef, useEffect } from '@wordpress/element';
import { Disabled } from '@wordpress/components';
import { Icon, arrowRight, chevronRight } from '@wordpress/icons';
import { applyFilters } from '@wordpress/hooks';

/**
 * Internal Dependencies
 */
import {
	getCustomColorValue,
	mediaPosition,
	SLIDES_ALLOWED_BLOCKS,
} from '../../shared';

const SlidesPreview = memo( ( props ) => {
	const { attributes, backgroundMediaElement } = props;

	const {
		height,
		autoHeight,

		backgroundUrl,
		backgroundType,
		backgroundAlt,
		backgroundFocalPoint,
		backgroundParallaxEnable,
		backgroundParallaxMovement,

		speed,
		loop,
		autoplayEnable,
		autoplayDelay,
		autoplayHoverPause,
		autoplayDisableInteraction,
		autoplayStopLast,

		navigationEnable,
		navigationIcon,
		navigationSize,
		navigationRadius,
		navigationIconColor,
		navigationBackgroundColor,
		navigationPosition,
		navigationJustify,
		navigationAlign,
		navigationHoverReveal,

		paginationEnable,
		paginationType,
		paginationPosition,
		paginationBulletsSize,
		paginationProgressbarSize,
		paginationColor,
	} = attributes;

	const sliderRef = useRef( null );
	const prevRef = useRef( null );
	const nextRef = useRef( null );
	const paginationRef = useRef( null );

	useEffect( () => {
		// Before initializing the Swiper instance, check if all references are attached to the DOM elements.
		// If not, the Swiper initialization is skipped until the next render cycle when the elements are available.
		if (
			! sliderRef.current ||
			! prevRef.current ||
			! nextRef.current ||
			! paginationRef.current
		)
			return;

		let autoplay = false;
		const autoplaySettings = {};
		if ( autoplayEnable ) {
			autoplaySettings[ 'delay' ] = autoplayDelay
				? parseInt( autoplayDelay, 10 )
				: 3000;
			autoplaySettings[ 'pauseOnMouseEnter' ] =
				autoplayHoverPause ?? false;
			autoplaySettings[ 'disableOnInteraction' ] =
				autoplayDisableInteraction ?? false;
			autoplaySettings[ 'stopOnLastSlide' ] = autoplayStopLast ?? false;

			autoplay = autoplaySettings;
		}

		let pagination = false;
		const paginationSettings = {};
		if ( paginationEnable ) {
			paginationSettings[ 'el' ] = paginationRef.current;
			paginationSettings[ 'clickable' ] = true;
			paginationSettings[ 'type' ] = paginationType ?? 'bullets';

			pagination = paginationSettings;
		}

		let swiperConfig = {
			modules: [
				Autoplay,
				Navigation,
				Pagination,
				Parallax,
				EffectFade,
				EffectCoverflow,
				EffectCreative,
			],
			init: false,
			grabCursor: false,
			parallax: true,

			// In the editor, disable swiping
			allowTouchMove: false,

			speed: parseInt( speed, 10 ) ?? 300,
			loop: loop ?? false,

			autoplay,

			// In the editor, always display navigation buttons since swiping is not available
			navigation: {
				prevEl: prevRef.current,
				nextEl: nextRef.current,
			},

			pagination,
		};

		swiperConfig = applyFilters(
			'csbloSwiperConfigEditor',
			swiperConfig,
			attributes
		);

		const slider = new Swiper( sliderRef.current, swiperConfig );

		slider.init();

		return () => {
			slider.destroy();
		};
	} );

	const backgroundMediaStyle = {
		objectPosition: backgroundFocalPoint
			? mediaPosition( backgroundFocalPoint )
			: undefined,
	};
	const backgroundMediaExtraAttr = {
		'data-swiper-parallax':
			!! backgroundParallaxEnable && !! backgroundParallaxMovement
				? `-${ backgroundParallaxMovement }`
				: undefined,
	};

	const navigationIconColorValue = getCustomColorValue(
		navigationIconColor ?? {}
	);
	const navigationBackgroundColorValue = getCustomColorValue(
		navigationBackgroundColor ?? {}
	);
	const paginationColorValue = getCustomColorValue( paginationColor ?? {} );

	const classes = classnames( {
		'is-auto-height': autoHeight,
		'has-background-parallax':
			backgroundUrl &&
			backgroundParallaxEnable &&
			!! backgroundParallaxMovement,

		'no-navigation-editor': ! navigationEnable,
		'is-navigation-below':
			navigationEnable && navigationPosition === 'below',
		'is-navigation-hover-reveal': navigationEnable && navigationHoverReveal,

		'is-pagination-top': paginationEnable && paginationPosition === 'top',
	} );
	const inlineStyles = {
		'--csblo--slides--height':
			!! height && height !== '400px' ? height : undefined,
		'--csblo--slides--background-parallax':
			backgroundUrl &&
			backgroundParallaxEnable &&
			!! backgroundParallaxMovement &&
			backgroundParallaxMovement !== 200
				? `${ backgroundParallaxMovement }px`
				: undefined,

		'--csblo--slides--nav-size':
			navigationEnable && !! navigationSize && navigationSize !== 35
				? `${ navigationSize }px`
				: undefined,
		'--csblo--slides--nav-radius':
			navigationEnable &&
			( !! navigationRadius || navigationRadius === 0 ) &&
			navigationRadius !== 100
				? `${ navigationRadius }px`
				: undefined,
		'--csblo--slides--nav-color':
			navigationEnable && !! navigationIconColorValue
				? navigationIconColorValue
				: undefined,
		'--csblo--slides--nav-bg-color':
			navigationEnable && !! navigationBackgroundColorValue
				? navigationBackgroundColorValue
				: undefined,
		'--csblo--slides--nav-justify':
			navigationEnable && !! navigationJustify
				? navigationJustify
				: undefined,
		'--csblo--slides--nav-align':
			navigationEnable && !! navigationAlign
				? navigationAlign
				: undefined,

		'--swiper-pagination-bullet-size':
			paginationEnable && !! paginationBulletsSize
				? `${ paginationBulletsSize }px`
				: undefined,
		'--swiper-pagination-progressbar-size':
			paginationEnable && !! paginationProgressbarSize
				? `${ paginationProgressbarSize }px`
				: undefined,
		'--swiper-pagination-color':
			paginationEnable && !! paginationColorValue
				? paginationColorValue
				: undefined,
	};
	const blockProps = useBlockProps( {
		className: classes,
		style: inlineStyles,
	} );
	const { children, ...innerBlocksProps } = useInnerBlocksProps(
		{
			...blockProps,
		},
		{
			template: [],
			allowedBlocks: SLIDES_ALLOWED_BLOCKS,
			orientation: 'horizontal',
			renderAppender: false,
			templateInsertUpdateSelection: true,
		}
	);

	return (
		<>
			<div { ...innerBlocksProps }>
				<div className="swiper" ref={ sliderRef }>
					{ backgroundUrl && 'image' === backgroundType && (
						<img
							ref={ backgroundMediaElement }
							className="csblo-slides__image-background"
							alt={ backgroundAlt }
							src={ backgroundUrl }
							style={ backgroundMediaStyle }
							{ ...backgroundMediaExtraAttr }
						/>
					) }
					{ backgroundUrl && 'video' === backgroundType && (
						<video
							ref={ backgroundMediaElement }
							className="csblo-slides__video-background"
							autoPlay
							muted
							loop
							src={ backgroundUrl }
							style={ backgroundMediaStyle }
							{ ...backgroundMediaExtraAttr }
						/>
					) }

					<Disabled className="swiper-wrapper">{ children }</Disabled>

					<div
						className="swiper-pagination"
						ref={ paginationRef }
					></div>
				</div>

				<div
					className={ classnames(
						'wp-block-csblo-slides__prevnext',
						{}
					) }
				>
					<button
						className="wp-block-csblo-slides__prev"
						ref={ prevRef }
					>
						{ 'chevron-right' === navigationIcon && (
							<Icon icon={ chevronRight } />
						) }
						{ 'arrow-right' === navigationIcon && (
							<Icon icon={ arrowRight } />
						) }
					</button>
					<button
						className="wp-block-csblo-slides__next"
						ref={ nextRef }
					>
						{ 'chevron-right' === navigationIcon && (
							<Icon icon={ chevronRight } />
						) }
						{ 'arrow-right' === navigationIcon && (
							<Icon icon={ arrowRight } />
						) }
					</button>
				</div>
			</div>
		</>
	);
} );

export default SlidesPreview;
