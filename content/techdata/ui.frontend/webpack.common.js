'use strict';
//test commit
const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TSConfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const SOURCE_ROOT = __dirname + '/src/main/webpack';

module.exports = {
    resolve: {
        extensions: ['.js', '.ts'],
        plugins: [new TSConfigPathsPlugin({
            configFile: './tsconfig.json'
        })]
    },
    entry: {
        us: SOURCE_ROOT + '/international/us/main.ts',
        global: SOURCE_ROOT + '/global/main.js',
        site: SOURCE_ROOT + '/site/main.ts'
    },
    output: {
        filename: (chunkData) => {
            return `clientlib-site-${chunkData.chunk.name}/[name].js`;
            // return chunkData.chunk.name=== 'dependencies' ? 'clientlib-dependencies/[name].js' : 'clientlib-site/[name].js';
        },
        path: path.resolve(__dirname, 'dist')
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                exclude: /node_modules/,
                use: [
                    {
                        options: {
                            eslintPath: require.resolve('eslint'),
                        },
                        loader: require.resolve('eslint-loader'),
                    },
                    {
                        loader: 'ts-loader'
                    },
                    {
                        loader: 'webpack-import-glob-loader',
                        options: {
                            url: false
                        }
                    }
                ]
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                options: {
                    presets: ['@babel/preset-env', '@babel/preset-typescript']
                }
            },
            // {
            //     test: /\.js$/,
            //     exclude: /node_modules/,
            //     loader: 'eslint-loader',
            // },
            {
                test: /\.scss$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
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
                        loader: 'sass-loader',
                        options: {
                            url: false
                        }
                    },
                    {
                        loader: 'webpack-import-glob-loader',
                        options: {
                            url: false
                        }
                    }
                ]
            },
            {
                test: /\.(sass|css)$/,
                use: ['style-loader','css-loader','sass-loader']
            },
            {
                test: /\.(svg|eot|woff|woff2|ttf)$/,
                use: ['file-loader']
            }
        ]
    },
    plugins: [
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery"
        }),
        new CleanWebpackPlugin(),
        new webpack.NoEmitOnErrorsPlugin(),
        new MiniCssExtractPlugin({
            filename: 'clientlib-site-[name]/css/[name].css'
        }),
        new CopyWebpackPlugin([
            { from: path.resolve(__dirname, SOURCE_ROOT + '/resources'), to: './clientlib-site-global/resources' }
        ])
    ],
    stats: {
        assetsSort: 'chunks',
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
