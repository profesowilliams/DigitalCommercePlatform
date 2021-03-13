const webpack = require('webpack');
const merge = require('webpack-merge');
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const TerserPlugin = require('terser-webpack-plugin');
const common = require('./webpack.common.js');

module.exports = merge(common, {
    mode: 'production',
    plugins: [
        new webpack.EnvironmentPlugin({
            NODE_ENV: 'production',
            DEBUG: false
        })
    ],
    optimization: {
        minimizer: [
            new TerserPlugin(),
            new OptimizeCSSAssetsPlugin({
                cssProcessorPluginOptions: {
                    cssProcessor: require('cssnano'),
                    preset: ['default', {
                        calc: true,
                        convertValues: true,
                        discardComments: {
                            removeAll: true
                        },
                        discardDuplicates: true,
                        discardEmpty: true,
                        mergeRules: true,
                        normalizeCharset: true,
                        reduceInitial: true, // This is since IE11 does not support the value Initial
                        svgo: true
                    }],
                },
                canPrint: false
            })
        ],
        splitChunks: {
            cacheGroups: {
                index: {
                    chunks: 'all',
                    name: 'bundle',
                    test: 'index',
                    enforce: true
                }
            }
        }
    },
    devtool: 'none',
    performance: {hints: false}
});
