const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const dotenv = require('dotenv')
const fs = require('fs')
const packageJson = require('./package.json')

const outDir = path.resolve(__dirname, 'build')

dotenv.config({
  path: path.resolve(__dirname, '../../.env'),
})

dotenv.config({
  path: path.resolve(__dirname, '../../.env.dist'),
})

function parseVersion(version) {
  const safeVersion = version.split('-')[0]

  return {
    version: safeVersion,
    versionName: version,
  }
}

module.exports = (env, { mode }) => {
  return {
    mode,
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
      publicPath: '/',
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
        },
        {
          test: /\.(png|jpe?g|gif)$/i,
          use: [
            {
              loader: 'file-loader',
            },
          ],
        },
      ],
    },
    plugins: [
      new webpack.ProgressPlugin(),

      // Apply website url and correct version to manifest
      {
        apply: (compiler) => {
          compiler.hooks.afterEmit.tap('AfterEmitPlugin', (compilation) => {
            const { path: outPath } = compilation.outputOptions

            const manifestPath = path.join(outPath, 'manifest.json')
            const manifest = require(manifestPath)

            manifest.externally_connectable.matches = [`${process.env.WEBSITE_URL}*`]

            const { version, versionName } = parseVersion(packageJson.version)

            manifest.version = version
            manifest.version_name = versionName

            fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2))
          })
        },
      },

      new CopyPlugin({
        patterns: [
          {
            from: path.resolve(__dirname, 'manifest.json'),
            to: outDir,
          },
        ],
      }),

      new CopyPlugin({
        patterns: [
          {
            from: path.resolve(__dirname, 'src/assets'),
            to: path.join(outDir, 'assets'),
          },
        ],
      }),

      new webpack.EnvironmentPlugin(['API_KEY', 'WEBSITE_URL']),

      new HtmlWebpackPlugin({
        template: path.join(__dirname, 'src', 'popup.html'),
        filename: 'popup.html',
        chunks: ['popup'],
      }),
    ],
  }
}
