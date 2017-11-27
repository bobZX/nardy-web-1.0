var path = require('path');
var webpack = require('webpack');

module.exports = {
    cache: true,
    devtool: "#source-map",
    entry: {
        amain:'./front/admin/main.js',
		cmain:'./front/client/main.js'
	},
    output: {
        path: path.join(__dirname, "./front/dist/"),
        publicPath: "./front/dist/",
        filename: "[name].js",
        chunkFilename: "[chunkhash].js"
    },
    module: {
        loaders: [
            //{ test: /\.js$/, loader: 'babel-loader' ,exclude: /node_modules/},
            //{ test: /\.css$/, loader: 'style-loader!css-loader'},
            { test: /\.(html|tpl)$/, loader: 'html-loader' }
        ]
    },
    resolve: {
        alias: {
        }
    },
    plugins: [
        new webpack.optimize.CommonsChunkPlugin('common'),
        new webpack.optimize.UglifyJsPlugin({
		  sourceMap: true,
		  compress: {
			warnings: false
		  }
		})
    ]
};