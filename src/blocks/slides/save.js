/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * WordPress dependencies
 */
import {
	useInnerBlocksProps,
	useBlockProps,
} from '@wordpress/block-editor';
import { Icon, arrowRight, chevronRight } from '@wordpress/icons';

/**
 * Internal dependencies
 */
import { getCustomColorValue, mediaPosition } from '../shared';

export default function save( { attributes } ) {
	const {
		height,
		autoHeight,

		backgroundUrl,
		backgroundType,
		backgroundAlt,
		backgroundFocalPoint,
		backgroundParallaxEnable,
		backgroundParallaxMovement,

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
		paginationPosition,
		paginationBulletsSize,
		paginationProgressbarSize,
		paginationColor,
	} = attributes;

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

	const className = classnames( {
		'is-auto-height': autoHeight,
		'has-background-parallax':
			backgroundUrl &&
			backgroundParallaxEnable &&
			!! backgroundParallaxMovement,

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
	const blockProps = useBlockProps.save( {
		className,
		style: inlineStyles,
	} );
	const { children, ...innerBlocksProps } =
		useInnerBlocksProps.save( blockProps );

	const SliderNavigation = () => {
		return (
			<div
				className={ classnames( 'wp-block-csblo-slides__prevnext', {} ) }
			>
				<button className="wp-block-csblo-slides__prev">
					{ 'chevron-right' === navigationIcon && (
						<Icon icon={ chevronRight } />
					) }
					{ 'arrow-right' === navigationIcon && (
						<Icon icon={ arrowRight } />
					) }
				</button>
				<button className="wp-block-csblo-slides__next">
					{ 'chevron-right' === navigationIcon && (
						<Icon icon={ chevronRight } />
					) }
					{ 'arrow-right' === navigationIcon && (
						<Icon icon={ arrowRight } />
					) }
				</button>
			</div>
		);
	};

	return (
		<div { ...innerBlocksProps }>
			<div className="swiper loading">
				{ backgroundUrl && 'image' === backgroundType && (
					<img
						className="csblo-slides__image-background"
						alt={ backgroundAlt }
						src={ backgroundUrl }
						style={ backgroundMediaStyle }
						{ ...backgroundMediaExtraAttr }
					/>
				) }
				{ backgroundUrl && 'video' === backgroundType && (
					<video
						className="csblo-slides__video-background"
						autoPlay
						muted
						loop
						src={ backgroundUrl }
						style={ backgroundMediaStyle }
						{ ...backgroundMediaExtraAttr }
					/>
				) }

				<div className="swiper-wrapper">{ children }</div>

				{ paginationEnable && (
					<div className="swiper-pagination"></div>
				) }
			</div>

			{ navigationEnable && <SliderNavigation /> }
		</div>
	);
}
