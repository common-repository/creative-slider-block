const defaultConfig = require( '@wordpress/scripts/config/webpack.config' );
const { getWebpackEntryPoints } = require( '@wordpress/scripts/utils/config' );
const path = require( 'path' );

const RemoveEmptyScriptsPlugin = require( 'webpack-remove-empty-scripts' );

const pluginConfig = {
	...defaultConfig,

	entry: {
		// Default entry points.
		...getWebpackEntryPoints(),

		// Add additional entry points as needed.
		'admin/admin-page': path.resolve(
			process.cwd(),
			'includes/admin/assets/admin-page.scss'
		),

		'variations/slides-slider-variation/slides-slider-variation':
			path.resolve(
				process.cwd(),
				'src/variations/slides-slider-variation/index.js'
			),
		'variations/slides-slider-variation/slides-slider-variation-frontend':
			path.resolve(
				process.cwd(),
				'src/variations/slides-slider-variation/frontend.js'
			),
	},

	output: {
		filename: '[name].js',
		path: path.resolve( process.cwd(), 'dist/' ),
	},

	module: {
		...defaultConfig.module,
		rules: [
			...defaultConfig.module.rules,

			// Add additional rules as needed.
		],
	},

	plugins: [
		...defaultConfig.plugins,

		// Add additional plugins as needed.
		new RemoveEmptyScriptsPlugin(),
	],
};

module.exports = [ pluginConfig ];
