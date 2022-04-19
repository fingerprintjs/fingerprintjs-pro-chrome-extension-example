const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const dotenv = require('dotenv');

const outDir = path.resolve(__dirname, 'build');

dotenv.config();

module.exports = {
  mode: process.env.NODE_ENV || 'development',
  devtool: 'inline-source-map',
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
    fallback: {
      fs: false,
      child_process: false,
      tls: false,
      net: false,
    },
  },
  entry: {
    popup: path.resolve(__dirname, 'src/popup.ts'),
    background: path.resolve(__dirname, 'src/background.ts'),
    content: path.resolve(__dirname, 'src/content.ts'),
  },
  output: {
    filename: '[name].js',
    path: outDir,
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.html$/,
        loader: 'html-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.tsx?$/i,
        loader: 'ts-loader',
        exclude: /node_modules/,
        options: {
          compilerOptions: {
            sourceMap: true,
          },
        },
      },
    ],
  },
  plugins: [
    new webpack.ProgressPlugin(),

    new CopyPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, 'manifest.json'),
          to: outDir,
        },
      ],
    }),

    new webpack.EnvironmentPlugin(['API_KEY']),

    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'src', 'popup.html'),
      filename: 'popup.html',
      chunks: ['popup'],
    }),
  ],
};
