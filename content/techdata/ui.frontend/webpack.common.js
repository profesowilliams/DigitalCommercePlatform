// test commit
const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TSConfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const SOURCE_ROOT = `${__dirname}/src/main/webpack`;

module.exports = {
  resolve: {
    extensions: ['.js', '.ts', '.tsx'],
    plugins: [
      new TSConfigPathsPlugin({
        configFile: './tsconfig.json',
      }),
    ],
    alias: {
      fortawesome: path.join(__dirname, 'node_modules/@fortawesome/fontawesome-free'),
    },
  },
  entry: {
    us: `${SOURCE_ROOT}/international/us/main.ts`,
    global: `${SOURCE_ROOT}/global/main.js`,
    site: `${SOURCE_ROOT}/site/main.ts`,
  },
  output: {
    filename: (chunkData) => `clientlib-site-${chunkData.chunk.name}/[name].js`, // return chunkData.chunk.name=== 'dependencies' ? 'clientlib-dependencies/[name].js' : 'clientlib-site/[name].js';

    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [
      {
        test: /\.(ts|js)x?$/,
        exclude: [/webcomponents/],
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env', '@babel/preset-typescript'],
        },
      },
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              url: false,
            },
          },
          {
            loader: 'postcss-loader',
          },
          {
            loader: 'sass-loader',
          },
          {
            loader: 'webpack-import-glob-loader',
            options: {
              url: false,
            },
          },
        ],
      },
      {
        test: /\.(sass|css)$/,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
      {
        test: /\.(svg|eot|woff|woff2|ttf)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              hashType: 'md5',
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
    }),
    new CleanWebpackPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new MiniCssExtractPlugin({
      filename: 'clientlib-site-[name]/css/[name].css',
    }),
    new CopyWebpackPlugin([
      { from: path.resolve(__dirname, `${SOURCE_ROOT}/resources`), to: './clientlib-site-global/resources' },
    ]),
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
    warnings: true,
  },
};
