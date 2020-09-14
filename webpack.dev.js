const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const commonConfig = require("./webpack.common");
const { default: merge } = require('webpack-merge');
const webpack = require('webpack');
const devConfig = {
    mode: "development",
    devtool: "source-map",
    output: {
        filename: "[name].bundle.js",
        publicPath: '/'
    },
    plugins: [
        new webpack.DefinePlugin({}),
        new webpack.HotModuleReplacementPlugin(),
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, 'public', 'index.html'),
            filename: path.resolve(__dirname, 'dist/index.html'),
        })
    ],
    module: {
        rules: [{
            loader: "source-map-loader",
            test: /\.(js|jsx)?$/,
            exclude: /node_modules/,
            enforce: "pre",
        }, ]
    },
    devServer: {
        contentBase: path.resolve(__dirname, "public"),
        publicPath: "/",
        port: 8599,
        hot: true,
        historyApiFallback: true,
        stats: {
            colors: true,
            hash: false,
            version: false,
            timings: true,
            assets: true,
            chunks: false,
            modules: false,
            reasons: false,
            children: false,
            source: false,
            errors: true,
            errorDetails: true,
            warnings: false,
            publicPath: false,
        }
    }
}

module.exports = merge(commonConfig, devConfig);