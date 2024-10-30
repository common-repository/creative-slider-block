/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import {
	InspectorControls,
	__experimentalColorGradientSettingsDropdown as ColorGradientSettingsDropdown,
	__experimentalUseGradient,
	__experimentalUseMultipleOriginColorsAndGradients as useMultipleOriginColorsAndGradients,
} from '@wordpress/block-editor';
import {
	Button,
	FocalPointPicker,
	Flex,
	PanelBody,
	RangeControl,
	TextareaControl,
	__experimentalToolsPanelItem as ToolsPanelItem,
} from '@wordpress/components';

/**
 * Internal dependencies
 */
import { mediaPosition } from '../../shared';

const SlideInspectorControls = ( props ) => {
	const {
		clientId,
		attributes,
		setAttributes,
		backgroundMediaElement,
		overlayColor,
		setOverlayColor,
	} = props;

	const {
		backgroundUrl,
		backgroundFocalPoint,
		backgroundAlt,
		backgroundType,
		overlayOpacity,
	} = attributes;

	// Dynamically adjust the appropriate CSS property object-position of backgroundMediaElement using the styleOfRef and property variables.
	const imperativeFocalPointPreview = ( value ) => {
		const [ styleOfRef, property ] = [
			backgroundMediaElement.current.style,
			'objectPosition',
		];
		styleOfRef[ property ] = mediaPosition( value );
	};

	const { gradientValue, setGradient } = __experimentalUseGradient();

	const colorGradientSettings = useMultipleOriginColorsAndGradients();

	return (
		<>
			<InspectorControls>
				{ !! backgroundUrl && (
					<PanelBody
						title={ __( 'Settings', 'creative-slider-block' ) }
					>
						<FocalPointPicker
							label={ __(
								'Focal point',
								'creative-slider-block'
							) }
							url={ backgroundUrl }
							value={ backgroundFocalPoint }
							onDragStart={ imperativeFocalPointPreview }
							onDrag={ imperativeFocalPointPreview }
							onChange={ ( newFocalPoint ) =>
								setAttributes( {
									backgroundFocalPoint: newFocalPoint,
								} )
							}
						/>
						{ 'video' !== backgroundType && (
							<TextareaControl
								label={ __(
									'Alternative text',
									'creative-slider-block'
								) }
								value={ backgroundAlt }
								onChange={ ( newBackgroundAlt ) =>
									setAttributes( {
										backgroundAlt: newBackgroundAlt,
									} )
								}
							/>
						) }
						<Flex justify="end">
							<Button
								variant="secondary"
								size="small"
								onClick={ () =>
									setAttributes( {
										backgroundId: undefined,
										backgroundUrl: undefined,
										backgroundType: undefined,
										backgroundAlt: undefined,
										backgroundFocalPoint: undefined,
									} )
								}
							>
								{ __( 'Clear Media', 'creative-slider-block' ) }
							</Button>
						</Flex>
					</PanelBody>
				) }
			</InspectorControls>

			{ colorGradientSettings.hasColorsOrGradients && (
				<InspectorControls group="color">
					<ColorGradientSettingsDropdown
						__experimentalIsRenderedInSidebar
						settings={ [
							{
								colorValue: overlayColor.color,
								gradientValue,
								label: __( 'Overlay', 'creative-slider-block' ),
								onColorChange: setOverlayColor,
								onGradientChange: setGradient,
								isShownByDefault: true,
								resetAllFilter: () => ( {
									overlayColor: undefined,
									customOverlayColor: undefined,
									gradient: undefined,
									customGradient: undefined,
								} ),
							},
						] }
						panelId={ clientId }
						{ ...colorGradientSettings }
					/>
					<ToolsPanelItem
						hasValue={ () => {
							return overlayOpacity !== undefined;
						} }
						label={ __(
							'Overlay opacity',
							'creative-slider-block'
						) }
						onDeselect={ () =>
							setAttributes( { overlayOpacity: undefined } )
						}
						resetAllFilter={ () => ( {
							overlayOpacity: undefined,
						} ) }
						isShownByDefault
						panelId={ clientId }
					>
						<RangeControl
							label={ __(
								'Overlay opacity',
								'creative-slider-block'
							) }
							value={ overlayOpacity }
							onChange={ ( newOverlayOpacity ) =>
								setAttributes( {
									overlayOpacity: newOverlayOpacity,
								} )
							}
							min={ 0 }
							max={ 1 }
							step={ 0.1 }
							required
						/>
					</ToolsPanelItem>
				</InspectorControls>
			) }
		</>
	);
};

export default SlideInspectorControls;
