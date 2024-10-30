/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { InspectorControls } from '@wordpress/block-editor';
import {
	BaseControl,
	Button,
	Flex,
	FlexItem,
	PanelBody,
	RangeControl,
	SelectControl,
	TabPanel,
	__experimentalToggleGroupControl as ToggleGroupControl,
	__experimentalToggleGroupControlOption as ToggleGroupControlOption,
} from '@wordpress/components';
import { useState, useEffect } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { normalizeObject } from './shared';

const SlidesSliderInspectorControls = ( props ) => {
	const { attributes, setAttributes } = props;

	const {
		sliderEffect,
		sliderSlideDirection,
		sliderSlideGap,
		sliderCreativeKeyframes = {},
	} = attributes;

	const [ creativeKeyframesPreset, setCreativeKeyframesPreset ] =
		useState( '' );
	const creativeKeyframesPresetOptions = [
		{
			value: '',
			label: __( '-- Presets --', 'creative-slider-block' ),
		},
		{
			value: 'slide-in-stuck-out',
			label: __( 'Slide In - Stuck Out', 'creative-slider-block' ),
		},
		{
			value: 'slide-in-shrink-out',
			label: __( 'Slide In - Shrink Out', 'creative-slider-block' ),
		},
		{
			value: 'grow-in-shrink-out',
			label: __( 'Grow In - Shrink Out', 'creative-slider-block' ),
		},
		{
			value: 'rotate-in-rotate-out',
			label: __( 'Rotate In - Rotate Out', 'creative-slider-block' ),
		},
	];
	const creativeKeyframesPresets = {
		'slide-in-stuck-out': {
			translateXNext: 100,
			translateXPrev: -20,
			translateZPrev: -1,
		},
		'slide-in-shrink-out': {
			translateXNext: 100,
			translateZPrev: -400,
		},
		'grow-in-shrink-out': {
			translateXNext: 110,
			translateZNext: -400,
			translateXPrev: -110,
			translateZPrev: -400,
		},
		'rotate-in-rotate-out': {
			translateXNext: 70,
			translateZNext: -400,
			rotateYNext: 100,
			translateXPrev: -70,
			translateZPrev: -400,
			rotateYPrev: -100,
		},
	};

	useEffect( () => {
		for ( const preset in creativeKeyframesPresets ) {
			const presetKeyframes = normalizeObject(
				creativeKeyframesPresets[ preset ]
			);
			const currentKeyframes = normalizeObject( sliderCreativeKeyframes );
			if (
				JSON.stringify( currentKeyframes ) ===
				JSON.stringify( presetKeyframes )
			) {
				setCreativeKeyframesPreset( preset );
				return;
			}
		}

		// No preset matches
		setCreativeKeyframesPreset( '' );
	}, [ sliderCreativeKeyframes ] );

	const handleCreativeKeyframesPresetChange = ( value ) => {
		const presetKeyframes = creativeKeyframesPresets[ value ] || {};
		setAttributes( {
			sliderCreativeKeyframes: {
				...sliderCreativeKeyframes,
				...Object.fromEntries(
					Object.keys( sliderCreativeKeyframes ).map( ( key ) => [
						key,
						undefined,
					] )
				),
				...presetKeyframes,
			},
		} );
	};

	return (
		<>
			<InspectorControls group="settings">
				<PanelBody
					title={ __( 'Slider settings', 'creative-slider-block' ) }
					initialOpen
				>
					<>
						<SelectControl
							label={ __(
								'Transition Effect',
								'creative-slider-block'
							) }
							labelPosition="top"
							options={ [
								{
									value: 'slide',
									label: __(
										'Slide',
										'creative-slider-block'
									),
								},
								{
									value: 'fade',
									label: __(
										'Fade',
										'creative-slider-block'
									),
								},
								{
									value: 'creative',
									label: __(
										'Creative',
										'creative-slider-block'
									),
								},
							] }
							value={ sliderEffect }
							onChange={ ( value ) =>
								setAttributes( { sliderEffect: value } )
							}
						/>
						<ToggleGroupControl
							label={ __(
								'Slide direction',
								'creative-slider-block'
							) }
							isBlock
							value={ sliderSlideDirection || 'horizontal' }
							onChange={ ( value ) => {
								setAttributes( {
									sliderSlideDirection: value,
								} );
							} }
						>
							<ToggleGroupControlOption
								value="horizontal"
								label={ __(
									'Horizontal',
									'creative-slider-block'
								) }
							/>
							<ToggleGroupControlOption
								value="vertical"
								label={ __(
									'Vertical',
									'creative-slider-block'
								) }
							/>
						</ToggleGroupControl>

						{ sliderEffect === 'slide' && (
							<>
								<RangeControl
									label={ __(
										'Gap (px)',
										'creative-slider-block'
									) }
									value={ sliderSlideGap ?? 0 }
									onChange={ ( value ) =>
										setAttributes( {
											sliderSlideGap: value,
										} )
									}
									min={ 0 }
									max={ 200 }
									step={ 1 }
									allowReset
									resetFallbackValue={ 0 }
								/>
							</>
						) }

						{ sliderEffect === 'creative' && (
							<>
								<BaseControl
									help={ __(
										'Applies transformations to the next and previous slides before they transition into the active position.',
										'creative-slider-block'
									) }
								>
									<BaseControl.VisualLabel>
										{ __(
											'Creative effect',
											'creative-slider-block'
										) }
									</BaseControl.VisualLabel>
									<Flex
										className="cbs-slides-component-boxed-tab-panel-container"
										direction="column"
										gap={ 0 }
									>
										<Flex
											className="cbs-slides-component-boxed-tab-panel-header"
											gap={ 1 }
										>
											<FlexItem isBlock>
												<SelectControl
													__nextHasNoMarginBottom
													label={ __(
														'Presets',
														'creative-slider-block'
													) }
													hideLabelFromVision
													size="small"
													value={ creativeKeyframesPreset }
													options={
														creativeKeyframesPresetOptions
													}
													onChange={ ( value ) => {
														handleCreativeKeyframesPresetChange(
															value
														);
													} }
													hideCancelButton={ false }
												/>
											</FlexItem>
											<FlexItem>
												<Button
													variant="secondary"
													size="small"
													showTooltip={ false }
													onClick={ () => {
														setAttributes( {
															sliderCreativeKeyframes:
																undefined,
														} );
													} }
													style={ {
														marginBottom: '8px',
													} }
												>
													{ __(
														'Clear',
														'creative-slider-block'
													) }
												</Button>
											</FlexItem>
										</Flex>
										<TabPanel
											className="cbs-slides-component-boxed-tab-panel"
											activeClass="active-tab"
											initialTabName="next"
											tabs={ [
												{
													name: 'next',
													title: __(
														'Next',
														'creative-slider-block'
													),
												},
												{
													name: 'prev',
													title: __(
														'Previous',
														'creative-slider-block'
													),
												},
											] }
										>
											{ ( tab ) => {
												switch ( tab.name ) {
													case 'next':
														return (
															<Flex
																direction="column"
																gap={ 0 }
															>
																<FlexItem>
																	<RangeControl
																		label={ __(
																			'Opacity',
																			'creative-slider-block'
																		) }
																		value={
																			sliderCreativeKeyframes?.opacityNext ??
																			1
																		}
																		onChange={ (
																			value
																		) => {
																			setAttributes(
																				{
																					sliderCreativeKeyframes:
																						{
																							...sliderCreativeKeyframes,
																							opacityNext:
																								value,
																						},
																				}
																			);
																		} }
																		min={
																			0
																		}
																		max={
																			1
																		}
																		step={
																			0.1
																		}
																	/>
																</FlexItem>
																<FlexItem>
																	<RangeControl
																		label={ __(
																			'Scale',
																			'creative-slider-block'
																		) }
																		value={
																			sliderCreativeKeyframes?.scaleNext ??
																			1
																		}
																		onChange={ (
																			value
																		) => {
																			setAttributes(
																				{
																					sliderCreativeKeyframes:
																						{
																							...sliderCreativeKeyframes,
																							scaleNext:
																								value,
																						},
																				}
																			);
																		} }
																		min={
																			0
																		}
																		max={
																			2
																		}
																		step={
																			0.1
																		}
																	/>
																</FlexItem>
																<FlexItem>
																	<RangeControl
																		label={ __(
																			'Translate X (%)',
																			'creative-slider-block'
																		) }
																		value={
																			sliderCreativeKeyframes?.translateXNext ??
																			0
																		}
																		onChange={ (
																			value
																		) => {
																			setAttributes(
																				{
																					sliderCreativeKeyframes:
																						{
																							...sliderCreativeKeyframes,
																							translateXNext:
																								value,
																						},
																				}
																			);
																		} }
																		min={
																			-200
																		}
																		max={
																			200
																		}
																		step={
																			1
																		}
																	/>
																</FlexItem>
																<FlexItem>
																	<RangeControl
																		label={ __(
																			'Translate Y (%)',
																			'creative-slider-block'
																		) }
																		value={
																			sliderCreativeKeyframes?.translateYNext ??
																			0
																		}
																		onChange={ (
																			value
																		) => {
																			setAttributes(
																				{
																					sliderCreativeKeyframes:
																						{
																							...sliderCreativeKeyframes,
																							translateYNext:
																								value,
																						},
																				}
																			);
																		} }
																		min={
																			-200
																		}
																		max={
																			200
																		}
																		step={
																			1
																		}
																	/>
																</FlexItem>
																<FlexItem>
																	<RangeControl
																		label={ __(
																			'Translate Z (px)',
																			'creative-slider-block'
																		) }
																		value={
																			sliderCreativeKeyframes?.translateZNext ??
																			0
																		}
																		onChange={ (
																			value
																		) => {
																			setAttributes(
																				{
																					sliderCreativeKeyframes:
																						{
																							...sliderCreativeKeyframes,
																							translateZNext:
																								value,
																						},
																				}
																			);
																		} }
																		min={
																			-1000
																		}
																		max={
																			1000
																		}
																		step={
																			1
																		}
																	/>
																</FlexItem>
																<FlexItem>
																	<RangeControl
																		label={ __(
																			'Rotate X (deg)',
																			'creative-slider-block'
																		) }
																		value={
																			sliderCreativeKeyframes?.rotateXNext ??
																			0
																		}
																		onChange={ (
																			value
																		) => {
																			setAttributes(
																				{
																					sliderCreativeKeyframes:
																						{
																							...sliderCreativeKeyframes,
																							rotateXNext:
																								value,
																						},
																				}
																			);
																		} }
																		min={
																			-180
																		}
																		max={
																			180
																		}
																		step={
																			1
																		}
																	/>
																</FlexItem>
																<FlexItem>
																	<RangeControl
																		label={ __(
																			'Rotate Y (deg)',
																			'creative-slider-block'
																		) }
																		value={
																			sliderCreativeKeyframes?.rotateYNext ??
																			0
																		}
																		onChange={ (
																			value
																		) => {
																			setAttributes(
																				{
																					sliderCreativeKeyframes:
																						{
																							...sliderCreativeKeyframes,
																							rotateYNext:
																								value,
																						},
																				}
																			);
																		} }
																		min={
																			-180
																		}
																		max={
																			180
																		}
																		step={
																			1
																		}
																	/>
																</FlexItem>
																<FlexItem>
																	<RangeControl
																		label={ __(
																			'Rotate Z (deg)',
																			'creative-slider-block'
																		) }
																		value={
																			sliderCreativeKeyframes?.rotateZNext ??
																			0
																		}
																		onChange={ (
																			value
																		) => {
																			setAttributes(
																				{
																					sliderCreativeKeyframes:
																						{
																							...sliderCreativeKeyframes,
																							rotateZNext:
																								value,
																						},
																				}
																			);
																		} }
																		min={
																			-180
																		}
																		max={
																			180
																		}
																		step={
																			1
																		}
																	/>
																</FlexItem>
															</Flex>
														);
													case 'prev':
														return (
															<Flex
																direction="column"
																gap={ 0 }
															>
																<FlexItem>
																	<RangeControl
																		label={ __(
																			'Opacity',
																			'creative-slider-block'
																		) }
																		value={
																			sliderCreativeKeyframes?.opacityPrev ??
																			1
																		}
																		onChange={ (
																			value
																		) => {
																			setAttributes(
																				{
																					sliderCreativeKeyframes:
																						{
																							...sliderCreativeKeyframes,
																							opacityPrev:
																								value,
																						},
																				}
																			);
																		} }
																		min={
																			0
																		}
																		max={
																			1
																		}
																		step={
																			0.1
																		}
																	/>
																</FlexItem>
																<FlexItem>
																	<RangeControl
																		label={ __(
																			'Scale',
																			'creative-slider-block'
																		) }
																		value={
																			sliderCreativeKeyframes?.scalePrev ??
																			1
																		}
																		onChange={ (
																			value
																		) => {
																			setAttributes(
																				{
																					sliderCreativeKeyframes:
																						{
																							...sliderCreativeKeyframes,
																							scalePrev:
																								value,
																						},
																				}
																			);
																		} }
																		min={
																			0
																		}
																		max={
																			2
																		}
																		step={
																			0.1
																		}
																	/>
																</FlexItem>
																<FlexItem>
																	<RangeControl
																		label={ __(
																			'Translate X (%)',
																			'creative-slider-block'
																		) }
																		value={
																			sliderCreativeKeyframes?.translateXPrev ??
																			0
																		}
																		onChange={ (
																			value
																		) => {
																			setAttributes(
																				{
																					sliderCreativeKeyframes:
																						{
																							...sliderCreativeKeyframes,
																							translateXPrev:
																								value,
																						},
																				}
																			);
																		} }
																		min={
																			-200
																		}
																		max={
																			200
																		}
																		step={
																			1
																		}
																	/>
																</FlexItem>
																<FlexItem>
																	<RangeControl
																		label={ __(
																			'Translate Y (%)',
																			'creative-slider-block'
																		) }
																		value={
																			sliderCreativeKeyframes?.translateYPrev ??
																			0
																		}
																		onChange={ (
																			value
																		) => {
																			setAttributes(
																				{
																					sliderCreativeKeyframes:
																						{
																							...sliderCreativeKeyframes,
																							translateYPrev:
																								value,
																						},
																				}
																			);
																		} }
																		min={
																			-200
																		}
																		max={
																			200
																		}
																		step={
																			1
																		}
																	/>
																</FlexItem>
																<FlexItem>
																	<RangeControl
																		label={ __(
																			'Translate Z (px)',
																			'creative-slider-block'
																		) }
																		value={
																			sliderCreativeKeyframes?.translateZPrev ??
																			0
																		}
																		onChange={ (
																			value
																		) => {
																			setAttributes(
																				{
																					sliderCreativeKeyframes:
																						{
																							...sliderCreativeKeyframes,
																							translateZPrev:
																								value,
																						},
																				}
																			);
																		} }
																		min={
																			-1000
																		}
																		max={
																			1000
																		}
																		step={
																			1
																		}
																	/>
																</FlexItem>
																<FlexItem>
																	<RangeControl
																		label={ __(
																			'Rotate X (deg)',
																			'creative-slider-block'
																		) }
																		value={
																			sliderCreativeKeyframes?.rotateXPrev ??
																			0
																		}
																		onChange={ (
																			value
																		) => {
																			setAttributes(
																				{
																					sliderCreativeKeyframes:
																						{
																							...sliderCreativeKeyframes,
																							rotateXPrev:
																								value,
																						},
																				}
																			);
																		} }
																		min={
																			-180
																		}
																		max={
																			180
																		}
																		step={
																			1
																		}
																	/>
																</FlexItem>
																<FlexItem>
																	<RangeControl
																		label={ __(
																			'Rotate Y (deg)',
																			'creative-slider-block'
																		) }
																		value={
																			sliderCreativeKeyframes?.rotateYPrev ??
																			0
																		}
																		onChange={ (
																			value
																		) => {
																			setAttributes(
																				{
																					sliderCreativeKeyframes:
																						{
																							...sliderCreativeKeyframes,
																							rotateYPrev:
																								value,
																						},
																				}
																			);
																		} }
																		min={
																			-180
																		}
																		max={
																			180
																		}
																		step={
																			1
																		}
																	/>
																</FlexItem>
																<FlexItem>
																	<RangeControl
																		label={ __(
																			'Rotate Z (deg)',
																			'creative-slider-block'
																		) }
																		value={
																			sliderCreativeKeyframes?.rotateZPrev ??
																			0
																		}
																		onChange={ (
																			value
																		) => {
																			setAttributes(
																				{
																					sliderCreativeKeyframes:
																						{
																							...sliderCreativeKeyframes,
																							rotateZPrev:
																								value,
																						},
																				}
																			);
																		} }
																		min={
																			-180
																		}
																		max={
																			180
																		}
																		step={
																			1
																		}
																	/>
																</FlexItem>
															</Flex>
														);
												}
											} }
										</TabPanel>
									</Flex>
								</BaseControl>
							</>
						) }
					</>
				</PanelBody>
			</InspectorControls>
		</>
	);
};

export default SlidesSliderInspectorControls;
