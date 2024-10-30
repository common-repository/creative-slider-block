/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import {
	BlockControls,
	MediaReplaceFlow,
	useBlockProps,
	useInnerBlocksProps,
	store as blockEditorStore,
} from '@wordpress/block-editor';
import { withDispatch, useSelect } from '@wordpress/data';
import { createBlock } from '@wordpress/blocks';
import { ToolbarButton, ToolbarGroup } from '@wordpress/components';
import { plus, reset, seen } from '@wordpress/icons';
import { useState, useRef } from '@wordpress/element';

/**
 * Internal dependencies
 */
import SlidesInspectorControls from './inspector-controls';
import SlidesPreview from './preview';
import {
	attributesFromMedia,
	mediaPosition,
	SLIDES_ALLOWED_BLOCKS,
	SLIDES_DEFAULT_BLOCK,
	SLIDES_DEFAULT_BLOCK_ATTRIBUTES,
} from '../../shared';

import '../editor.scss';

const SlidesBlockControls = ( {
	clientId,
	attributes,
	setAttributes,
	csbloAddSlide,
	csbloRemoveSlide,
	isPreview,
	togglePreview,
} ) => {
	const { backgroundUrl, backgroundId } = attributes;

	const { count } = useSelect(
		( select ) => {
			const { getBlockCount } = select( blockEditorStore );

			return {
				count: getBlockCount( clientId ),
			};
		},
		[ clientId ]
	);

	return (
		<>
			<BlockControls group="block">
				<ToolbarGroup>
					<ToolbarButton
						title={ __(
							'Remove last slide',
							'creative-slider-block'
						) }
						icon={ reset }
						disabled={ count < 2 }
						onClick={ () => csbloRemoveSlide() }
					/>
					<ToolbarButton
						title={ __( 'Add a slide', 'creative-slider-block' ) }
						icon={ plus }
						onClick={ () => csbloAddSlide() }
					/>
				</ToolbarGroup>
			</BlockControls>
			<BlockControls group="inline">
				<ToolbarGroup>
					<ToolbarButton
						label={
							isPreview
								? __(
										'Disable preview',
										'creative-slider-block'
								  )
								: __(
										'Enable preview',
										'creative-slider-block'
								  )
						}
						icon={ seen }
						isPressed={ isPreview }
						onClick={ togglePreview }
					/>
				</ToolbarGroup>
			</BlockControls>
			<BlockControls group="other">
				<MediaReplaceFlow
					mediaId={ backgroundId }
					mediaURL={ backgroundUrl }
					allowedTypes={ [ 'image', 'video' ] }
					accept="image/*,video/*"
					onSelect={ ( newMedia ) => {
						const mediaAttributes = attributesFromMedia( newMedia );

						setAttributes( {
							backgroundId: mediaAttributes.id,
							backgroundUrl: mediaAttributes.url,
							backgroundAlt: mediaAttributes.alt,
							backgroundType: mediaAttributes.backgroundType,
							backgroundFocalPoint: undefined,
						} );
					} }
					name={
						! backgroundUrl
							? __( 'Add Media', 'creative-slider-block' )
							: __( 'Replace Media', 'creative-slider-block' )
					}
				/>
			</BlockControls>
		</>
	);
};

const SlidesEditContainer = ( props ) => {
	const { isSelected, attributes } = props;

	const {
		height,
		autoHeight,

		backgroundUrl,
		backgroundType,
		backgroundAlt,
		backgroundFocalPoint,
	} = attributes;

	const [ isPreview, setIsPreview ] = useState( false );
	const togglePreview = () => setIsPreview( ( prevState ) => ! prevState );

	const backgroundMediaElement = useRef();
	const backgroundMediaStyle = {
		objectPosition: backgroundFocalPoint
			? mediaPosition( backgroundFocalPoint )
			: undefined,
	};

	const classes = classnames( 'csblo-slides-editor', {
		'is-auto-height': autoHeight,
	} );
	const inlineStyles = {
		'--csblo--slides-editor--height':
			!! height && height !== '400px' ? height : undefined,
	};
	const blockProps = useBlockProps( {
		className: classes,
		style: inlineStyles,
	} );
	const { children, ...innerBlocksProps } = useInnerBlocksProps( blockProps, {
		template: [
			[ SLIDES_DEFAULT_BLOCK, SLIDES_DEFAULT_BLOCK_ATTRIBUTES, [] ],
		],
		allowedBlocks: SLIDES_ALLOWED_BLOCKS,
		orientation: 'horizontal',
		renderAppender: false,
		templateInsertUpdateSelection: true,
	} );

	return (
		<>
			<SlidesInspectorControls
				{ ...props }
				backgroundMediaElement={ backgroundMediaElement }
			/>

			<SlidesBlockControls
				{ ...props }
				isPreview={ isPreview }
				togglePreview={ togglePreview }
			/>

			{ isPreview && isSelected ? (
				<>
					<SlidesPreview
						{ ...props }
						backgroundMediaElement={ backgroundMediaElement }
					/>
				</>
			) : (
				<div { ...innerBlocksProps }>
					{ backgroundUrl && 'image' === backgroundType && (
						<img
							ref={ backgroundMediaElement }
							className="csblo-slides__image-background"
							alt={ backgroundAlt }
							src={ backgroundUrl }
							style={ backgroundMediaStyle }
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
						/>
					) }

					<div className="csblo-slides-editor-inner">{ children }</div>
				</div>
			) }
		</>
	);
};

// HOC created using the withDispatch to enhances the SlidesEditContainer component with additional functions and data access.
const SlidesEditContainerWrapper = withDispatch(
	( dispatch, ownProps, registry ) => ( {
		/**
		 * Updates the slide count.
		 *
		 * @param {number} previousSlides Previous slide count.
		 * @param {number} newSlides      New slide count.
		 */
		csbloUpdateSlides( previousSlides, newSlides ) {
			const { clientId } = ownProps;
			const { replaceInnerBlocks } = dispatch( blockEditorStore );
			const { getBlocks } = registry.select( blockEditorStore );

			let innerBlocks = getBlocks( clientId );

			const isAddingSlide = newSlides > previousSlides;

			if ( isAddingSlide ) {
				innerBlocks = [
					...innerBlocks,
					...Array.from( {
						length: newSlides - previousSlides,
					} ).map( () => {
						return createBlock(
							SLIDES_DEFAULT_BLOCK,
							SLIDES_DEFAULT_BLOCK_ATTRIBUTES
						);
					} ),
				];
			} else if ( newSlides < previousSlides ) {
				// The removed slide will be the last of the inner blocks.
				innerBlocks = innerBlocks.slice(
					0,
					-( previousSlides - newSlides )
				);
			}

			replaceInnerBlocks( clientId, innerBlocks );
		},

		/**
		 * Adds a slide block and updates the slide count.
		 */
		csbloAddSlide() {
			const { clientId } = ownProps;
			const { replaceInnerBlocks } = dispatch( blockEditorStore );
			const { getBlocks } = registry.select( blockEditorStore );

			let innerBlocks = getBlocks( clientId );

			innerBlocks = [
				...innerBlocks,
				...Array.from( {
					length: 1,
				} ).map( () => {
					return createBlock(
						SLIDES_DEFAULT_BLOCK,
						SLIDES_DEFAULT_BLOCK_ATTRIBUTES
					);
				} ),
			];

			replaceInnerBlocks( clientId, innerBlocks );
		},

		/**
		 * Removes the last slide block and updates the slide count.
		 */
		csbloRemoveSlide() {
			const { clientId } = ownProps;
			const { replaceInnerBlocks } = dispatch( blockEditorStore );
			const { getBlocks } = registry.select( blockEditorStore );

			let innerBlocks = getBlocks( clientId );

			// Keep a least 1 slide
			if ( innerBlocks.length > 1 ) {
				innerBlocks = innerBlocks.slice( 0, -1 );
			}

			replaceInnerBlocks( clientId, innerBlocks );
		},
	} )
)( SlidesEditContainer );

// See core/columns edit.js
const SlidesEdit = ( props ) => {
	const Component = SlidesEditContainerWrapper;
	return <Component { ...props } />;
};

export default SlidesEdit;
