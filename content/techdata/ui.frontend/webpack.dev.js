const merge             = require('webpack-merge');
const common            = require('./webpack.common.js');
const path              = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackHookPlugin = require('webpack-hook-plugin');

const SOURCE_ROOT = __dirname + '/src/main/webpack';

module.exports = env => {
    const writeToDisk = env && Boolean(env.writeToDisk);

    return merge(common, {
        mode: 'development',
        devtool: 'inline-source-map',
        performance: { hints: 'warning' },
        plugins: [
            new HtmlWebpackPlugin({
                filename: 'index.html',
                template: path.resolve(__dirname, SOURCE_ROOT + '/static/index.html')
            }),
            new HtmlWebpackPlugin({
                filename: 'teaser.html',
                template: path.resolve(__dirname, SOURCE_ROOT + '/static/teaser.html')
            }),
            new HtmlWebpackPlugin({
                filename: 'teaser-demo.html',
                template: path.resolve(__dirname, SOURCE_ROOT + '/static/teaser-demo.html')
            }),
            new HtmlWebpackPlugin({
                filename: 'teaser-comp',
                template: path.resolve(__dirname, SOURCE_ROOT + '/static/partials/teaser/teaser.html')
            }),
            new HtmlWebpackPlugin({
                filename: 'teaser-demo-comp',
                template: path.resolve(__dirname, SOURCE_ROOT + '/static/partials/teaser-demo/teaser-demo.html')
            }),          
        ],
        devServer: {
            inline: true,
            proxy: [{
                context: ['/content', '/etc.clientlibs'],
                target: 'http://localhost:4502',
            }],
            writeToDisk,
            liveReload: !writeToDisk
        }
    });
}