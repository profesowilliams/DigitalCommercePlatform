const webpack = require('webpack');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const SRC_DIR = __dirname + '/src/';
const DIST_DIR = __dirname + '/dist';

module.exports = merge(common, {
    mode: 'development',
    devtool: 'inline-source-map',
    performance: {hints: "warning"},
    plugins: [
        new webpack.EnvironmentPlugin({
            NODE_ENV: 'development',
            DEBUG: true
        }),
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: path.resolve(__dirname, SRC_DIR + '/index.html')
        }),
    ],
    devServer: {
        contentBase: DIST_DIR,
        hot: true,
        port: 9000
    }
});
