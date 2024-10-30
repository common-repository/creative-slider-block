/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * WordPress dependencies
 */
import { useRef } from '@wordpress/element';
import { Spinner } from '@wordpress/components';
import { compose } from '@wordpress/compose';
import {
	InnerBlocks,
	useBlockProps,
	useInnerBlocksProps,
	withColors,
	__experimentalUseGradient,
	store as blockEditorStore,
} from '@wordpress/block-editor';
import { useSelect } from '@wordpress/data';

/**
 * Internal dependencies
 */
import SlideBlockControls from './block-controls';
import SlideInspectorControls from './inspector-controls';
import {
	isTemporaryMedia,
	mediaPosition,
	getPositionClassName,
	isContentPositionCenter,
} from '../../shared';

function SlideEdit( props ) {
	const { clientId, attributes, overlayColor, setOverlayColor } = props;

	const {
		backgroundId,
		backgroundUrl,
		backgroundType,
		backgroundAlt,
		backgroundFocalPoint,
		overlayOpacity,
		contentPosition,
		templateLock,
		allowedBlocks,
	} = attributes;

	const { hasChildBlocks, rootClientId, slidesIds } = useSelect(
		( select ) => {
			const { getBlockOrder, getBlockRootClientId } =
				select( blockEditorStore );

			const rootId = getBlockRootClientId( clientId );

			return {
				hasChildBlocks: getBlockOrder( clientId ).length > 0,
				rootClientId: rootId,
				slidesIds: getBlockOrder( rootId ),
			};
		},
		[ clientId ]
	);

	const { gradientClass, gradientValue } = __experimentalUseGradient();

	const isUploadingMedia = isTemporaryMedia( backgroundId, backgroundUrl );

	const classes = classnames( getPositionClassName( contentPosition ), {
		'is-transient': isUploadingMedia,
		'has-custom-content-position':
			! isContentPositionCenter( contentPosition ),
	} );
	const inlineStyles = {
		'--csblo--slide--overlay-opacity':
			( !! overlayOpacity || overlayOpacity === 0 ) &&
			overlayOpacity !== 1
				? `${ overlayOpacity }`
				: undefined,
	};
	const blockProps = useBlockProps( {
		className: classes,
		style: inlineStyles,
	} );
	const innerBlocksProps = useInnerBlocksProps(
		{
			className: 'csblo-slide__inner-container',
		},
		{
			templateLock,
			allowedBlocks,
			renderAppender: hasChildBlocks
				? undefined
				: InnerBlocks.ButtonBlockAppender,
		}
	);

	const backgroundStyle = {
		backgroundColor: overlayColor.color,
	};

	const backgroundMediaElement = useRef();
	const backgroundMediaStyle = {
		objectPosition: backgroundFocalPoint
			? mediaPosition( backgroundFocalPoint )
			: undefined,
	};

	return (
		<>
			<SlideBlockControls
				{ ...props }
				backgroundMediaElement={ backgroundMediaElement }
				hasChildBlocks={ hasChildBlocks }
			/>
			<SlideInspectorControls
				{ ...props }
				backgroundMediaElement={ backgroundMediaElement }
			/>

			<div { ...blockProps }>
				<span
					aria-hidden="true"
					className={ classnames(
						'csblo-slide__background csblo-slide__overlay-background',
						{
							[ overlayColor.class ]: overlayColor.class,
							'has-background-gradient': gradientValue,
							[ gradientClass ]: gradientClass,
						}
					) }
					style={ {
						backgroundImage: gradientValue,
						...backgroundStyle,
					} }
				/>

				{ backgroundUrl && 'image' === backgroundType && (
					<img
						ref={ backgroundMediaElement }
						className="csblo-slide__background csblo-slide__image-background"
						alt={ backgroundAlt }
						src={ backgroundUrl }
						style={ backgroundMediaStyle }
					/>
				) }
				{ backgroundUrl && 'video' === backgroundType && (
					<video
						ref={ backgroundMediaElement }
						className="csblo-slide__background csblo-slide__video-background"
						autoPlay
						muted
						loop
						src={ backgroundUrl }
						style={ backgroundMediaStyle }
					/>
				) }
				{ isUploadingMedia && <Spinner /> }

				<div { ...innerBlocksProps } />
			</div>
		</>
	);
}

export default compose( [
	withColors( { overlayColor: 'background-color' } ),
] )( SlideEdit );
