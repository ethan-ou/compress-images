const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const merge = require('webpack-merge');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

const baseConfig = require('./webpack.base.config');

const nodeModules = {};
fs.readdirSync('node_modules')
  .filter((item) => ['.bin'].indexOf(item) === -1) // exclude the .bin folder
  .forEach((mod) => {
    nodeModules[mod] = 'commonjs ' + mod;
  });

module.exports = merge.smart(baseConfig, {
  target: 'electron-main',
  entry: {
    main: './src/main/main.ts',
  },
  externals: nodeModules,
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          cacheDirectory: true,
          babelrc: false,
          presets: [
            ['@babel/preset-env', { targets: 'maintained node versions' }],
            '@babel/preset-typescript',
          ],
          plugins: [['@babel/plugin-proposal-class-properties', { loose: true }]],
        },
      },
    ],
  },
  plugins: [
    new ForkTsCheckerWebpackPlugin({
      reportFiles: ['src/main/**/*'],
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
    }),
  ],
});
