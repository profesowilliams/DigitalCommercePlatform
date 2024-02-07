const webpack = require('webpack');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const SRC_DIR = __dirname + '/src/';
const DIST_DIR = __dirname + '/dist';

module.exports = merge(common, {
    mode: 'development',
    devtool: 'eval-source-map',
    performance: {hints: "warning"}
});
