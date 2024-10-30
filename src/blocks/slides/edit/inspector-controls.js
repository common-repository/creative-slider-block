/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import {
	InspectorControls,
	store as blockEditorStore,
	__experimentalUseMultipleOriginColorsAndGradients as useMultipleOriginColorsAndGradients,
} from '@wordpress/block-editor';
import { useSelect } from '@wordpress/data';
import {
	BaseControl,
	Button,
	ColorIndicator,
	ColorPalette,
	Dropdown,
	Flex,
	FlexItem,
	FlexBlock,
	FocalPointPicker,
	PanelBody,
	RangeControl,
	SelectControl,
	TextareaControl,
	ToggleControl,
	__experimentalHStack as HStack,
	__experimentalToolsPanelItem as ToolsPanelItem,
	__experimentalToggleGroupControl as ToggleGroupControl,
	__experimentalToggleGroupControlOption as ToggleGroupControlOption,
	__experimentalToggleGroupControlOptionIcon as ToggleGroupControlOptionIcon,
} from '@wordpress/components';
import { useInstanceId } from '@wordpress/compose';
import {
	Icon,
	settings,
	chevronRight,
	arrowRight,
	justifyLeft,
	justifyRight,
	justifyCenter,
	justifySpaceBetween,
} from '@wordpress/icons';

/**
 * Internal dependencies
 */
import { mediaPosition, CustomRangeUnitControl } from '../../shared';

function CustomColorSelectorControl( {
	label,
	help,
	value = {},
	alpha = false,
	onChange = () => {},
} ) {
	const instanceId = useInstanceId( CustomColorSelectorControl );
	const id = `csblo-slides-custom-color-selector-control-${ instanceId }`;
	const { colors } = useMultipleOriginColorsAndGradients();

	const getColorByProperty = ( colorsParam, property, valueParam ) => {
		let matchedColor;

		colorsParam.some( ( origin ) =>
			origin.colors.some( ( color ) => {
				if ( color[ property ] === valueParam ) {
					matchedColor = color;
					return true;
				}

				return false;
			} )
		);

		return matchedColor;
	};

	const getColorObject = ( { colors: objectColors, color } ) => {
		// Attempt to find color in palette colors via color value, otherwise return object with  empty slug
		const colorPaletteObject = getColorByProperty(
			objectColors,
			'color',
			color
		);
		if ( colorPaletteObject ) {
			return colorPaletteObject;
		}

		return {
			slug: undefined,
			name: undefined,
			color,
		};
	};

	return (
		<BaseControl
			id={ id }
			className="csblo-custom-color-selector-control"
			help={ help }
		>
			<HStack justify="flex-start" spacing={ 3 }>
				<Dropdown
					popoverProps={ {
						placement: 'left-start',
						offset: 36,
					} }
					renderToggle={ ( { isOpen, onToggle } ) => (
						<Button
							id={ id }
							variant="tertiary"
							label={ __( 'Color', 'creative-slider-block' ) }
							aria-expanded={ isOpen }
							showTooltip
							onClick={ onToggle }
						>
							<ColorIndicator
								className="csblo-custom-color-selector-control__indicator"
								colorValue={ value.color ?? '' }
							/>
						</Button>
					) }
					renderContent={ () => (
						<ColorPalette
							colors={ colors ?? [] }
							value={ value.color ?? '' }
							onChange={ ( value ) => {
								const colorObject = getColorObject( {
									colors,
									color: value,
								} );

								onChange( colorObject );
							} }
							enableAlpha={ alpha }
						/>
					) }
				></Dropdown>
				<FlexBlock
					as="label"
					htmlFor={ id }
					className="csblo-custom-color-selector-control__label"
				>
					{ label }
				</FlexBlock>
			</HStack>
		</BaseControl>
	);
}

const SlidesInspectorControls = ( props ) => {
	const {
		clientId,
		attributes,
		setAttributes,
		csbloUpdateSlides,
		backgroundMediaElement,
	} = props;

	const {
		height,
		autoHeight,

		backgroundUrl,
		backgroundFocalPoint,
		backgroundAlt,
		backgroundType,
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

	const { count, canInsertSlideBlock, minCount } = useSelect(
		( select ) => {
			const {
				canInsertBlockType,
				canRemoveBlock,
				getBlocks,
				getBlockCount,
			} = select( blockEditorStore );

			const innerBlocks = getBlocks( clientId );

			// Get the indexes of slides for which removal is prevented. This is an array that is created by iterating through the inner blocks
			// and checking if each block can be removed. If a block cannot be removed, its index is added to the acc array.
			// The highest index will be used to determine the minimum slide count.
			const preventRemovalBlockIndexes = innerBlocks.reduce(
				( acc, block, index ) => {
					if ( ! canRemoveBlock( block.clientId ) ) {
						acc.push( index );
					}
					return acc;
				},
				[]
			);

			return {
				count: getBlockCount( clientId ),
				canInsertSlideBlock: canInsertBlockType(
					'csblo/slide',
					clientId
				),
				minCount: Math.max( ...preventRemovalBlockIndexes ) + 1,
			};
		},
		[ clientId ]
	);

	// Dynamically adjust the appropriate CSS property object-position of backgroundMediaElement using the styleOfRef and property variables.
	const imperativeFocalPointPreview = ( value ) => {
		const [ styleOfRef, property ] = [
			backgroundMediaElement.current.style,
			'objectPosition',
		];
		styleOfRef[ property ] = mediaPosition( value );
	};

	return (
		<>
			<InspectorControls group="dimensions">
				<ToolsPanelItem
					hasValue={ () => {
						return !! height && height !== '400px';
					} }
					label={ __( 'Height', 'creative-slider-block' ) }
					onDeselect={ () =>
						setAttributes( {
							height: '400px',
						} )
					}
					resetAllFilter={ () => ( {
						height: '400px',
					} ) }
					isShownByDefault
					panelId={ clientId }
				>
					<CustomRangeUnitControl
						label={ __( 'Height', 'creative-slider-block' ) }
						value={ height }
						onChange={ ( newHeight ) => {
							if ( newHeight === '' ) {
								setAttributes( {
									height: '400px',
								} );
								return;
							}

							setAttributes( {
								height: newHeight,
							} );
						} }
					/>
				</ToolsPanelItem>
				<ToolsPanelItem
					hasValue={ () => !! autoHeight }
					label={ __( 'Auto height', 'creative-slider-block' ) }
					onDeselect={ () => setAttributes( { autoHeight: false } ) }
					resetAllFilter={ () => ( {
						autoHeight: false,
					} ) }
					isShownByDefault
					panelId={ clientId }
				>
					<ToggleControl
						label={ __(
							'Enable auto height',
							'creative-slider-block'
						) }
						help={ __(
							"Enable to allow the slider's height to adjust dynamically based on the content of each slide.",
							'creative-slider-block'
						) }
						checked={ autoHeight }
						onChange={ ( value ) => {
							setAttributes( { autoHeight: value } );
						} }
					/>
				</ToolsPanelItem>
			</InspectorControls>

			<InspectorControls group="settings">
				<PanelBody>
					{ canInsertSlideBlock && (
						<RangeControl
							label={ __( 'Slides', 'creative-slider-block' ) }
							value={ count }
							onChange={ ( value ) =>
								csbloUpdateSlides(
									count,
									Math.max( minCount, value )
								)
							}
							min={ Math.max( 1, minCount ) }
							max={ Math.max( 20, count ) }
						/>
					) }
				</PanelBody>

				<PanelBody
					title={ __(
						'Transition settings',
						'creative-slider-block'
					) }
					initialOpen={ false }
				>
					<RangeControl
						label={ __( 'Speed', 'creative-slider-block' ) }
						help={ __(
							'Duration (in ms) of transition between slides.',
							'creative-slider-block'
						) }
						value={ speed }
						onChange={ ( value ) =>
							setAttributes( { speed: value } )
						}
						min={ 1 }
						max={ 3000 }
						step={ 1 }
					/>
					<ToggleControl
						label={ __( 'Loop mode', 'creative-slider-block' ) }
						checked={ loop ?? false }
						onChange={ ( value ) => {
							setAttributes( { loop: value } );
						} }
					/>
					<BaseControl>
						<Flex>
							<FlexItem isBlock>
								<ToggleControl
									label={ __(
										'Autoplay',
										'creative-slider-block'
									) }
									checked={ autoplayEnable ?? false }
									onChange={ ( value ) => {
										setAttributes( {
											autoplayEnable: value,
										} );
									} }
								/>
							</FlexItem>
							<FlexItem>
								<Dropdown
									contentClassName="cbs-slides-component-popover-content"
									focusOnMount
									popoverProps={ {
										placement: 'bottom-start',
										offset: 5,
									} }
									renderToggle={ ( { isOpen, onToggle } ) => (
										<Button
											size="small"
											aria-expanded={ isOpen }
											onClick={ onToggle }
											icon={ settings }
											label={ __(
												'Autoplay options',
												'creative-slider-block'
											) }
											style={ { marginBottom: '8px' } }
											disabled={ ! autoplayEnable }
										/>
									) }
									renderContent={ () => (
										<>
											<RangeControl
												label={ __(
													'Delay (ms)',
													'creative-slider-block'
												) }
												value={ autoplayDelay }
												onChange={ ( value ) => {
													setAttributes( {
														autoplayDelay: value,
													} );
												} }
												min={ 1 }
												max={ 9999 }
												step={ 1 }
											/>
											<ToggleControl
												label={ __(
													'Pause on hover',
													'creative-slider-block'
												) }
												checked={ autoplayHoverPause }
												onChange={ ( value ) => {
													setAttributes( {
														autoplayHoverPause:
															value,
													} );
												} }
											/>
											<ToggleControl
												label={ __(
													'Stop after interaction',
													'creative-slider-block'
												) }
												checked={
													autoplayDisableInteraction
												}
												onChange={ ( value ) => {
													setAttributes( {
														autoplayDisableInteraction:
															value,
													} );
												} }
											/>
											<ToggleControl
												label={ __(
													'Stop on last item',
													'creative-slider-block'
												) }
												checked={ autoplayStopLast }
												onChange={ ( value ) => {
													setAttributes( {
														autoplayStopLast: value,
													} );
												} }
												disabled={ !! loop }
											/>
										</>
									) }
								/>
							</FlexItem>
						</Flex>
					</BaseControl>
				</PanelBody>

				<PanelBody
					title={ __( 'Navigation', 'creative-slider-block' ) }
					initialOpen={ false }
				>
					<ToggleControl
						label={ __(
							'Navigation buttons',
							'creative-slider-block'
						) }
						checked={ navigationEnable }
						onChange={ ( value ) => {
							setAttributes( { navigationEnable: value } );
						} }
					/>
					{ navigationEnable && (
						<>
							<ToggleGroupControl
								label={ __( 'Icon', 'creative-slider-block' ) }
								value={ navigationIcon }
								onChange={ ( value ) => {
									setAttributes( { navigationIcon: value } );
								} }
								isBlock
							>
								<ToggleGroupControlOption
									key="chevron-right"
									value="chevron-right"
									label={ <Icon icon={ chevronRight } /> }
									aria-label={ __(
										'Chevron',
										'creative-slider-block'
									) }
								/>
								<ToggleGroupControlOption
									key="arrow-right"
									value="arrow-right"
									label={ <Icon icon={ arrowRight } /> }
									aria-label={ __(
										'Arrow',
										'creative-slider-block'
									) }
								/>
							</ToggleGroupControl>
							<RangeControl
								label={ __(
									'Size (px)',
									'creative-slider-block'
								) }
								value={ navigationSize }
								onChange={ ( value ) =>
									setAttributes( { navigationSize: value } )
								}
								min={ 1 }
								max={ 100 }
								step={ 1 }
								required
							/>
							<RangeControl
								label={ __(
									'Button radius (px)',
									'creative-slider-block'
								) }
								value={ navigationRadius }
								onChange={ ( value ) =>
									setAttributes( { navigationRadius: value } )
								}
								min={ 0 }
								max={ 100 }
								step={ 1 }
								required
							/>
							<CustomColorSelectorControl
								label={ __(
									'Icon Color',
									'creative-slider-block'
								) }
								alpha={ false }
								value={ navigationIconColor }
								onChange={ ( value ) => {
									setAttributes( {
										navigationIconColor: value,
									} );
								} }
							/>
							<CustomColorSelectorControl
								label={ __(
									'Button Background Color',
									'creative-slider-block'
								) }
								alpha
								value={ navigationBackgroundColor }
								onChange={ ( value ) => {
									setAttributes( {
										navigationBackgroundColor: value,
									} );
								} }
							/>
							<ToggleGroupControl
								label={ __(
									'Button position',
									'creative-slider-block'
								) }
								value={ navigationPosition ?? 'inside' }
								onChange={ ( value ) => {
									setAttributes( {
										navigationPosition: value,
									} );
								} }
								isBlock
							>
								<ToggleGroupControlOption
									value="inside"
									label={ __(
										'Inside',
										'creative-slider-block'
									) }
								/>
								<ToggleGroupControlOption
									value="below"
									label={ __(
										'Below',
										'creative-slider-block'
									) }
								/>
							</ToggleGroupControl>
							<ToggleGroupControl
								label={ __(
									'Button justification',
									'creative-slider-block'
								) }
								value={ navigationJustify ?? 'space-between' }
								onChange={ ( value ) => {
									setAttributes( {
										navigationJustify: value,
									} );
								} }
								isBlock
							>
								<ToggleGroupControlOptionIcon
									value="flex-start"
									label={ __(
										'Justify start',
										'creative-slider-block'
									) }
									icon={ justifyLeft }
								/>
								<ToggleGroupControlOptionIcon
									value="center"
									label={ __(
										'Justify center',
										'creative-slider-block'
									) }
									icon={ justifyCenter }
								/>
								<ToggleGroupControlOptionIcon
									value="flex-end"
									label={ __(
										'Justify end',
										'creative-slider-block'
									) }
									icon={ justifyRight }
								/>
								<ToggleGroupControlOptionIcon
									value="space-between"
									label={ __(
										'Justify space between',
										'creative-slider-block'
									) }
									icon={ justifySpaceBetween }
								/>
							</ToggleGroupControl>
							<ToggleGroupControl
								label={ __(
									'Button vertical alignment',
									'creative-slider-block'
								) }
								value={ navigationAlign ?? 'center' }
								onChange={ ( value ) => {
									setAttributes( { navigationAlign: value } );
								} }
								isBlock
							>
								<ToggleGroupControlOptionIcon
									value="flex-start"
									label={ __(
										'Align top',
										'creative-slider-block'
									) }
									icon={ justifyLeft }
									style={ { transform: 'rotate(90deg)' } }
								/>
								<ToggleGroupControlOptionIcon
									value="center"
									label={ __(
										'Align center',
										'creative-slider-block'
									) }
									icon={ justifyCenter }
									style={ { transform: 'rotate(90deg)' } }
								/>
								<ToggleGroupControlOptionIcon
									value="flex-end"
									label={ __(
										'Align bottom',
										'creative-slider-block'
									) }
									icon={ justifyRight }
									style={ { transform: 'rotate(90deg)' } }
								/>
							</ToggleGroupControl>
							<ToggleControl
								label={ __(
									'Reveal on hover',
									'creative-slider-block'
								) }
								checked={ navigationHoverReveal ?? false }
								onChange={ ( value ) => {
									setAttributes( {
										navigationHoverReveal: value,
									} );
								} }
							/>
						</>
					) }
				</PanelBody>

				<PanelBody
					title={ __( 'Pagination', 'creative-slider-block' ) }
					initialOpen={ false }
				>
					<ToggleControl
						label={ __(
							'Display pagination indicator',
							'creative-slider-block'
						) }
						checked={ paginationEnable }
						onChange={ ( value ) => {
							setAttributes( { paginationEnable: value } );
						} }
					/>
					{ paginationEnable && (
						<>
							<SelectControl
								label={ __(
									'Pagination type',
									'creative-slider-block'
								) }
								value={ paginationType }
								options={ [
									{
										label: __(
											'Bullets',
											'creative-slider-block'
										),
										value: 'bullets',
									},
									{
										label: __(
											'Progress',
											'creative-slider-block'
										),
										value: 'progressbar',
									},
								] }
								onChange={ ( value ) =>
									setAttributes( { paginationType: value } )
								}
							/>
							{ paginationType === 'bullets' && (
								<>
									<ToggleGroupControl
										label={ __(
											'Position',
											'creative-slider-block'
										) }
										value={ paginationPosition ?? 'bottom' }
										onChange={ ( value ) => {
											setAttributes( {
												paginationPosition: value,
											} );
										} }
										isBlock
									>
										<ToggleGroupControlOption
											value="bottom"
											label={ __(
												'Bottom',
												'creative-slider-block'
											) }
										/>
										<ToggleGroupControlOption
											value="top"
											label={ __(
												'Top',
												'creative-slider-block'
											) }
										/>
									</ToggleGroupControl>
									<RangeControl
										label={ __(
											'Pagination bullet size (px)',
											'creative-slider-block'
										) }
										value={ paginationBulletsSize }
										onChange={ ( value ) =>
											setAttributes( {
												paginationBulletsSize: value,
											} )
										}
										min={ 1 }
										max={ 30 }
										step={ 1 }
										required
									/>
								</>
							) }
							{ paginationType === 'progressbar' && (
								<>
									<RangeControl
										label={ __(
											'Progress bar size (px)',
											'creative-slider-block'
										) }
										value={ paginationProgressbarSize }
										onChange={ ( value ) =>
											setAttributes( {
												paginationProgressbarSize:
													value,
											} )
										}
										min={ 1 }
										max={ 20 }
										step={ 1 }
										required
									/>
								</>
							) }
							<CustomColorSelectorControl
								label={ __(
									'Pagination indicator color',
									'creative-slider-block'
								) }
								alpha={ false }
								value={ paginationColor }
								onChange={ ( value ) => {
									setAttributes( { paginationColor: value } );
								} }
							/>
						</>
					) }
				</PanelBody>

				{ !! backgroundUrl && (
					<PanelBody
						title={ __(
							'Background Media',
							'creative-slider-block'
						) }
						initialOpen={ false }
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
						<BaseControl>
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
									{ __(
										'Clear Media',
										'creative-slider-block'
									) }
								</Button>
							</Flex>
						</BaseControl>
						{ /* { loop !== true && (
							<>
							</>
						) } */ }
						<ToggleControl
							label={ __(
								'Enable parallax effect',
								'creative-slider-block'
							) }
							help={ __(
								"Determines how the background move in response to the slider's progress.",
								'creative-slider-block'
							) }
							checked={ backgroundParallaxEnable }
							onChange={ ( value ) => {
								setAttributes( {
									backgroundParallaxEnable: value,
								} );
							} }
							disabled={ !! loop }
						/>
						{ backgroundParallaxEnable && (
							<RangeControl
								label={ __(
									'Parallax movement (px)',
									'creative-slider-block'
								) }
								value={ backgroundParallaxMovement }
								onChange={ ( value ) =>
									setAttributes( {
										backgroundParallaxMovement: value,
									} )
								}
								min={ 1 }
								max={ 1000 }
								step={ 1 }
								disabled={ !! loop }
							/>
						) }
					</PanelBody>
				) }
			</InspectorControls>
		</>
	);
};

export default SlidesInspectorControls;
