var path = require('path');
var webpack = require('webpack');

module.exports = {
    cache: true,
    devtool: "#source-map",
    entry: {
		main:'./front/client/main.js',
        sign:'./front/client/sign.js',
        testT:'./front/test/testT.js'
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
            { test: /\.(html|tpl)$/, loader: 'html-loader' },
            { test: /\.(png|jpg)$/, loader: "url-loader" }
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