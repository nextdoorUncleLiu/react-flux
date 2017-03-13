var path = require('path');

module.exports = {
	entry: path.resolve(__dirname, './app/app.jsx'),
	output: {
		path: path.resolve(__dirname, './build'),
		filename: './js/build.js'
	},
	resolve: {
		extensions: [".js", ".jsx"]
	},
	module: {
		loaders: [{
			test: /\.js|.jsx$/,
			exclude: /node_modules/,
			loader: 'babel-loader',
			query: {
				presets: ['es2015', 'react']
			}
		}]
	}
}