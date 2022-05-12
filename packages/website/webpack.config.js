const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const dotenv = require('dotenv');
const path = require('path');
const webpack = require('webpack');

const outDir = path.resolve(__dirname, 'build');

dotenv.config({
  path: path.resolve(__dirname, '../../.env'),
});

module.exports = (env, { mode = 'development' }) => ({
  entry: './src/index.ts',
  mode,
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
  },
  module: {
    rules: [
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
      {
        test: /\.(jpe?g|png|svg|ico)$/i,
        loader: 'file-loader',
        options: {
          outputPath: 'assets',
          name: '[name].[ext]?[contenthash]',
        },
      },
    ],
  },
  devtool: mode === 'development' ? 'inline-source-map' : 'source-map',
  output: {
    filename: '[name].js?[contenthash]',
    path: outDir,
  },
  devServer: {
    host: '0.0.0.0',
    https: true,
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: 'public/index.html',
      filename: 'index.html',
      title: `FingerprintJS ${mode === 'development' ? 'Playground' : 'Demo'}`,
    }),

    new webpack.DefinePlugin({
      'process.env.API_ENDPOINT': JSON.stringify(process.env.API_ENDPOINT),
    }),

    new webpack.DefinePlugin({
      'process.env.VERSION': JSON.stringify(process.env.npm_package_version),
    }),

    new webpack.EnvironmentPlugin(['API_KEY', 'EXTENSION_IDS']),
  ],
});
