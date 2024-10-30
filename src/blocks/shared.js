/**
 * WordPress dependencies
 */
import { getBlobTypeByURL, isBlobURL } from '@wordpress/blob';
import { useMemo } from '@wordpress/element';
import {
	BaseControl,
	RangeControl,
	Flex,
	FlexItem,
	__experimentalSpacer as Spacer,
	__experimentalUseCustomUnits as useCustomUnits,
	__experimentalUnitControl as UnitControl,
	__experimentalParseQuantityAndUnitFromRawValue as parseQuantityAndUnitFromRawValue,
} from '@wordpress/components';

export const SLIDES_ALLOWED_BLOCKS = [ 'csblo/slide' ];
export const SLIDES_DEFAULT_BLOCK = 'csblo/slide';
export const SLIDES_DEFAULT_BLOCK_ATTRIBUTES = {
	className: 'swiper-slide',
};

/**
 * Normalizes the order of properties in an object by sorting them alphabetically.
 *
 * @param {Object} obj The object to normalize.
 * @return {Object}   The normalized object.
 */
export const normalizeObject = ( obj = {} ) => {
	const normalized = {};
	Object.keys( obj )
		.sort()
		.forEach( ( key ) => {
			normalized[ key ] = obj[ key ];
		} );
	return normalized;
};

/**
 * Retrieves the color value for the color object.
 *
 * @param {Object} colorObj
 * @return {string} The color value.
 */
export function getCustomColorValue( colorObj ) {
	if ( ! colorObj?.color ) {
		return '';
	}

	if ( colorObj?.slug ) {
		return `var(--wp--preset--color--${ colorObj.slug }, ${ colorObj.color })`;
	}

	return colorObj.color;
}

// Is the URL a temporary blob URL? A blob URL is one that is used temporarily while
// the media (image or video) is being uploaded and will not have an id allocated yet.
export const isTemporaryMedia = ( id, url ) => ! id && isBlobURL( url );

export function mediaPosition( { x, y } = { x: 0.5, y: 0.5 } ) {
	return `${ Math.round( x * 100 ) }% ${ Math.round( y * 100 ) }%`;
}

export function attributesFromMedia( media ) {
	if ( ! media || ! media.url ) {
		return {
			url: undefined,
			id: undefined,
			backgroundType: undefined,
		};
	}

	if ( isBlobURL( media.url ) ) {
		media.type = getBlobTypeByURL( media.url );
	}

	let mediaType;
	// For media selections originated from a file upload.
	if ( media.media_type ) {
		if ( media.media_type === 'image' ) {
			mediaType = 'image';
		} else {
			// only images and videos are accepted so if the media_type is not an image we can assume it is a video.
			// Videos contain the media type of 'file' in the object returned from the rest api.
			mediaType = 'video';
		}
	} else {
		// For media selections originated from existing files in the media library.
		if ( media.type !== 'image' && media.type !== 'video' ) {
			return;
		}
		mediaType = media.type;
	}

	return {
		url: media.url,
		id: media.id,
		alt: media?.alt,
		backgroundType: mediaType,
	};
}

const POSITION_CLASSNAMES = {
	'top left': 'is-position-top-left',
	'top center': 'is-position-top-center',
	'top right': 'is-position-top-right',
	'center left': 'is-position-center-left',
	'center center': 'is-position-center-center',
	center: 'is-position-center-center',
	'center right': 'is-position-center-right',
	'bottom left': 'is-position-bottom-left',
	'bottom center': 'is-position-bottom-center',
	'bottom right': 'is-position-bottom-right',
};

/**
 * Checks of the contentPosition is the center (default) position.
 *
 * @param {string} contentPosition The current content position.
 * @return {boolean} Whether the contentPosition is center.
 */
export function isContentPositionCenter( contentPosition ) {
	return (
		! contentPosition ||
		contentPosition === 'center center' ||
		contentPosition === 'center'
	);
}

/**
 * Retrieves the className for the current contentPosition.
 * The default position (center) will not have a className.
 *
 * @param {string} contentPosition The current content position.
 * @return {string} The className assigned to the contentPosition.
 */
export function getPositionClassName( contentPosition ) {
	/*
	 * Only render a className if the contentPosition is not center (the default).
	 */
	if ( isContentPositionCenter( contentPosition ) ) return '';

	return POSITION_CLASSNAMES[ contentPosition ];
}

/**
 * CustomRangeUnitControl renders a linked unit control and range control for adjusting the dimension of a block.
 *
 * Based on HeightControl.
 * @see https://github.com/WordPress/gutenberg/blob/HEAD/packages/block-editor/src/components/height-control/README.md
 *
 * @param {Object}                     props
 * @param {?string}                    props.label        A label for the control.
 * @param {?string}                    props.help         An help text for the control.
 * @param {Object}                     props.unitSettings A map of settings for each unit (min, max, step).
 * @param {( value: string ) => void } props.onChange     Called when the height changes.
 * @param {string}                     props.value        The current height value.
 *
 * @return {Component} The component to be rendered.
 */
export function CustomRangeUnitControl( {
	label,
	help,
	unitSettings,
	onChange,
	value,
} ) {
	const defaultUnitSettings = {
		px: { min: 0, max: 1000, step: 1 },
		'%': { min: 0, max: 100, step: 1 },
		vw: { min: 0, max: 100, step: 1 },
		vh: { min: 0, max: 100, step: 1 },
		em: { min: 0, max: 50, step: 0.1 },
		rem: { min: 0, max: 50, step: 0.1 },
	};

	const effectiveUnitSettings = unitSettings || defaultUnitSettings;

	// Create an array of units from the keys of the effectiveUnitSettings object
	const availableUnits = useMemo(
		() => Object.keys( effectiveUnitSettings ),
		[ effectiveUnitSettings ]
	);

	const units = useCustomUnits( {
		availableUnits,
	} );

	const customRangeValue = parseFloat( value );

	// Unit extracted from the value prop. If no unit is found, falls back to the first unit in the `units` array.
	// If `units` is empty or the first element doesn’t have a value, it defaults to 'px'.
	const selectedUnit =
		useMemo(
			() => parseQuantityAndUnitFromRawValue( value ),
			[ value ]
		)[ 1 ] ||
		units[ 0 ]?.value ||
		'px';

	const handleSliderChange = ( next ) => {
		onChange( [ next, selectedUnit ].join( '' ) );
	};

	const handleUnitChange = ( newUnit ) => {
		// Attempt to smooth over differences between currentUnit and newUnit.
		const [ currentValue, currentUnit ] =
			parseQuantityAndUnitFromRawValue( value );

		if ( [ 'em', 'rem' ].includes( newUnit ) && currentUnit === 'px' ) {
			// Convert pixel value to an approximate of the new unit, assuming a root size of 16px.
			onChange( ( currentValue / 16 ).toFixed( 2 ) + newUnit );
		} else if (
			[ 'em', 'rem' ].includes( currentUnit ) &&
			newUnit === 'px'
		) {
			// Convert to pixel value assuming a root size of 16px.
			onChange( Math.round( currentValue * 16 ) + newUnit );
		} else if (
			[ '%', 'vw', 'vh' ].includes( newUnit ) &&
			currentValue > 100
		) {
			// When converting to `%` or viewport-relative units, cap the new value at 100.
			onChange( 100 + newUnit );
		}
	};

	return (
		<BaseControl help={ help } className="csblo-custom-range-unit-control">
			<BaseControl.VisualLabel as="legend">
				{ label }
			</BaseControl.VisualLabel>
			<Flex>
				<FlexItem isBlock>
					<UnitControl
						value={ value }
						units={ units }
						onChange={ onChange }
						onUnitChange={ handleUnitChange }
						min={ effectiveUnitSettings[ selectedUnit ]?.min ?? 0 }
						max={
							effectiveUnitSettings[ selectedUnit ]?.max ?? 100
						}
						step={
							effectiveUnitSettings[ selectedUnit ]?.step ?? 0.1
						}
						size="default"
						label={ label }
						hideLabelFromVision
					/>
				</FlexItem>
				<FlexItem isBlock>
					<Spacer marginX={ 2 } marginBottom={ 0 }>
						<RangeControl
							value={ customRangeValue }
							min={
								effectiveUnitSettings[ selectedUnit ]?.min ?? 0
							}
							max={
								effectiveUnitSettings[ selectedUnit ]?.max ??
								100
							}
							step={
								effectiveUnitSettings[ selectedUnit ]?.step ??
								0.1
							}
							withInputField={ false }
							onChange={ handleSliderChange }
							__nextHasNoMarginBottom
							label={ label }
							hideLabelFromVision
						/>
					</Spacer>
				</FlexItem>
			</Flex>
		</BaseControl>
	);
}
