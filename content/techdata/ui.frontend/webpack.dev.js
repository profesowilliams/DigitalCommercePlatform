const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const path = require('path');
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
                filename: 'link-list.html',
                template: path.resolve(__dirname, SOURCE_ROOT + '/static/link-list.html')
            }),
            new HtmlWebpackPlugin({
                filename: 'teaser-comp',
                template: path.resolve(__dirname, SOURCE_ROOT + '/static/partials/teaser/teaser.html')
            }),
            new HtmlWebpackPlugin({
                filename: 'teaser-demo-comp',
                template: path.resolve(__dirname, SOURCE_ROOT + '/static/partials/teaser-demo/teaser-demo.html')
            }),
            new HtmlWebpackPlugin({
                filename: 'form-options-checkbox',
                template: path.resolve(__dirname, SOURCE_ROOT + '/static/partials/form-options/checkbox.html')
            }),
            new HtmlWebpackPlugin({
                filename: 'form-options-drop-down',
                template: path.resolve(__dirname, SOURCE_ROOT + '/static/partials/form-options/drop-down.html')
            }),
            new HtmlWebpackPlugin({
                filename: 'form-options-multi-select-drop-down',
                template: path.resolve(__dirname, SOURCE_ROOT + '/static/partials/form-options/multi-select-drop-down.html')
            }),
            new HtmlWebpackPlugin({
                filename: 'form-options-radio-button',
                template: path.resolve(__dirname, SOURCE_ROOT + '/static/partials/form-options/radio-button.html')
            }),
            new HtmlWebpackPlugin({
                filename: 'form-options-demo.html',
                template: path.resolve(__dirname, SOURCE_ROOT + '/static/form-options-demo.html')

            }),
            new HtmlWebpackPlugin({
                filename: 'social.html',
                template: path.resolve(__dirname, SOURCE_ROOT + '/static/partials/social/social.html')
            }),
            new HtmlWebpackPlugin({
                filename: 'social-demo.html',
                template: path.resolve(__dirname, SOURCE_ROOT + '/static/social.html')
            }),
            new HtmlWebpackPlugin({
                filename: 'image-demo',
                template: path.resolve(__dirname, SOURCE_ROOT + '/static/image-demo.html')
            }),
            new HtmlWebpackPlugin({
                filename: 'image-caption-cmp',
                template: path.resolve(__dirname, SOURCE_ROOT + '/static/partials/image/image-caption.html')
            }),
            new HtmlWebpackPlugin({
                filename: 'image-linked-cmp',
                template: path.resolve(__dirname, SOURCE_ROOT + '/static/partials/image/image-linked.html')
            }),
            new HtmlWebpackPlugin({
                filename: 'image-standard-cmp',
                template: path.resolve(__dirname, SOURCE_ROOT + '/static/partials/image/image-standard.html')
            }),
            new HtmlWebpackPlugin({
                filename: 'carousel-comp',
                template: path.resolve(__dirname, SOURCE_ROOT + '/static/partials/carousel/carousel.html')
            }),
            new HtmlWebpackPlugin({
                filename: 'carousel-demo.html',
                template: path.resolve(__dirname, SOURCE_ROOT + '/static/carousel-demo.html')
            }),
            new HtmlWebpackPlugin({          
                filename: 'separator-demo.html',
                template: path.resolve(__dirname, SOURCE_ROOT + '/static/separator-demo.html')
            }),
            new HtmlWebpackPlugin({
                filename: 'separator.html',
                template: path.resolve(__dirname, SOURCE_ROOT + '/static/partials/separator/separator.html')
            }),
            new HtmlWebpackPlugin({
                filename: 'link-list-comp',
                    template: path.resolve(__dirname, SOURCE_ROOT + '/static/partials/link-list/link-list.html')
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
