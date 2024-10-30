/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import {
	BlockControls,
	MediaReplaceFlow,
	__experimentalBlockAlignmentMatrixControl as BlockAlignmentMatrixControl,
} from '@wordpress/block-editor';

/**
 * Internal dependencies
 */
import { attributesFromMedia } from '../../shared';

const SlideBlockControls = ( props ) => {
	const { attributes, setAttributes, hasChildBlocks } = props;

	const { backgroundUrl, backgroundId, contentPosition } = attributes;

	return (
		<>
			<BlockControls group="block">
				<>
					<BlockAlignmentMatrixControl
						label={ __(
							'Change content position',
							'creative-slider-block'
						) }
						value={ contentPosition }
						onChange={ ( nextPosition ) =>
							setAttributes( { contentPosition: nextPosition } )
						}
						isDisabled={ ! hasChildBlocks }
					/>
				</>
			</BlockControls>
			<BlockControls group="other">
				<>
					<MediaReplaceFlow
						mediaId={ backgroundId }
						mediaURL={ backgroundUrl }
						allowedTypes={ [ 'image', 'video' ] }
						accept="image/*,video/*"
						onSelect={ ( newMedia ) => {
							const mediaAttributes =
								attributesFromMedia( newMedia );

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
				</>
			</BlockControls>
		</>
	);
};

export default SlideBlockControls;
