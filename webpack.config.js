const path = require('path');
const webpack = require('webpack');

const PATHS = {
	app: path.join(__dirname, 'app'),
	build: path.join(__dirname, 'build')
};

module.exports = {
	entry: {
		app: PATHS.app
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
				test: /\.jsx?$/,
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
				test: /\.jpg$/,
				loader: "file-loader"
			},
			{
				test: /\.png$/,
				loader: "file-loader"
			}
		]
	}
};