const path = require('path');
const webpack = require('webpack');

const PATHS = {
	app: path.join(__dirname, 'app'),
	build: path.join(__dirname, 'build')
};

module.exports = {
	entry: {
		app: ['babel-polyfill', PATHS.app]
	},

	output: {
		path: PATHS.build,
		filename: 'bundle.js'
	},

	resolve: {
		extensions: ['', '.js', '.jsx']
	},

	module: {
		loaders: [
			{
				test: /(\.js|\.jsx)$/,
				exclude: /(node_modules)/,
				loader: 'babel',
				query: {
					plugins: ['transform-object-assign']
				}
			},
			{
				test: /\.jsx?$/,
				exclude: /(node_modules)/,
				loaders: [
					'babel?cacheDirectory,presets[]=react,presets[]=es2015'
				],
				include: PATHS.app
			},
			{
				test: /\.css$/,
				loader: "style-loader!css-loader"
			},
			{
				test: /\.(jpg|png)$/,
				loader: "url-loader?limit=1024&name=img/[name].[ext]"
			}
		]
	}
};