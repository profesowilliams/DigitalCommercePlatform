'use strict';

const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const TSConfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const TSLintPlugin = require('tslint-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const SOURCE_ROOT = __dirname + '/src/main/webpack/';

module.exports = {
    resolve: {
        extensions: ['.js', '.ts'],
        plugins: [new TSConfigPathsPlugin({
            configFile: "./tsconfig.json"
        })]
    },
    entry: {
        site: SOURCE_ROOT + '/site/main.ts',
        dependencies: SOURCE_ROOT + '/site/vendors.js'
    },
    output: {
        filename: (chunkData) => {
            if (chunkData.chunk.name === 'dependencies') {
                return 'clientlib-dependencies/[name].js'
            } else {
                return 'clientlib-site/[name].js';
            }
        },
        path: path.resolve(__dirname, 'dist')
    },
    module: {
        rules: [{
                test: /\.tsx?$/,
                exclude: [
                    /(node_modules)/
                ],
                use: [{
                        loader: "ts-loader"
                    },
                    {
                        loader: "webpack-import-glob-loader",
                        options: {
                            url: false
                        }
                    }
                ]
            },
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader'
                }
            },
            {
                test: /\.scss$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: "css-loader",
                        options: {
                            url: false
                        }
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            plugins() {
                                return [
                                    require('autoprefixer')
                                ];
                            }
                        }
                    },
                    {
                        loader: "sass-loader",
                        options: {
                            url: false
                        }
                    },
                    {
                        loader: "webpack-import-glob-loader",
                        options: {
                            url: false
                        }
                    }
                ]
            },
            {
                test: /\.html$/,
                use: [
                    'html-loader',
                    {
                        loader: 'posthtml-loader',
                        options: {
                            plugins: [
                                require('posthtml-include')({
                                    root: path.resolve(__dirname, SOURCE_ROOT + '/components')
                                })
                            ]
                        }
                    }
                ]
            }
        ]
    },
    plugins: [
        new CleanWebpackPlugin(),
        new webpack.NoEmitOnErrorsPlugin(),
        new MiniCssExtractPlugin({
            filename: 'clientlib-[name]/[name].css'
        }),
        new TSLintPlugin({
            files: [SOURCE_ROOT + '/**/*.ts', SOURCE_ROOT + '/**/*.tsx'],
            config: './tslint.json'
        }),
        new CopyWebpackPlugin([
            { from: path.resolve(__dirname, SOURCE_ROOT + '/assets'), to: './clientlib-site/assets' }
        ])
    ],
    stats: {
        assetsSort: "chunks",
        builtAt: true,
        children: false,
        chunkGroups: true,
        chunkOrigins: true,
        colors: false,
        errors: true,
        errorDetails: true,
        env: true,
        modules: false,
        performance: true,
        providedExports: false,
        source: false,
        warnings: true
    }
};