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
	getColorClassName,
	__experimentalGetGradientClass,
} from '@wordpress/block-editor';

/**
 * Internal dependencies
 */
import {
	mediaPosition,
	getPositionClassName,
	isContentPositionCenter,
} from '../shared';

export default function save( { attributes } ) {
	const {
		backgroundId,
		backgroundUrl,
		backgroundType,
		backgroundAlt,
		backgroundFocalPoint,
		overlayColor,
		customOverlayColor,
		gradient,
		customGradient,
		overlayOpacity,
		contentPosition,
	} = attributes;

	const classes = classnames(
		'swiper-slide',
		getPositionClassName( contentPosition ),
		{
			'has-custom-content-position':
				! isContentPositionCenter( contentPosition ),
		}
	);
	const style = {
		// explicitly convert the numeric value to a string to prevent any implicit unit appending.
		'--csblo--slide--overlay-opacity':
			( !! overlayOpacity || overlayOpacity === 0 ) &&
			overlayOpacity !== 1
				? `${ overlayOpacity }`
				: undefined,
	};

	const overlayColorClass = getColorClassName(
		'background-color',
		overlayColor
	);
	const gradientClass = __experimentalGetGradientClass( gradient );

	const backgroundStyle = {
		backgroundColor: ! overlayColorClass ? customOverlayColor : undefined,
		background: customGradient ? customGradient : undefined,
	};

	const imgClasses = classnames(
		'csblo-slide__image-background',
		backgroundId ? `wp-image-${ backgroundId }` : null
	);
	const backgroundMediaStyle = {
		objectPosition: backgroundFocalPoint
			? mediaPosition( backgroundFocalPoint )
			: undefined,
	};

	return (
		<div { ...useBlockProps.save( { className: classes, style } ) }>
			<span
				aria-hidden="true"
				className={ classnames(
					'csblo-slide__background csblo-slide__overlay-background',
					overlayColorClass,
					{
						'has-background-gradient': gradient || customGradient,
						[ gradientClass ]: gradientClass,
					}
				) }
				style={ backgroundStyle }
			/>

			{ backgroundUrl && 'image' === backgroundType && (
				<img
					className={ imgClasses }
					alt={ backgroundAlt }
					src={ backgroundUrl }
					style={ backgroundMediaStyle }
				/>
			) }
			{ backgroundUrl && 'video' === backgroundType && (
				<video
					className="csblo-slide__background csblo-slide__video-background"
					autoPlay
					muted
					loop
					playsInline
					src={ backgroundUrl }
					style={ backgroundMediaStyle }
				/>
			) }

			<div
				{ ...useInnerBlocksProps.save( {
					className:
						'csblo-slide__background csblo-slide__inner-container',
				} ) }
			/>
		</div>
	);
}
