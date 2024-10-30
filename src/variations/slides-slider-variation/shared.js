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
