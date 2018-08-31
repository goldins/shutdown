const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackInlineSourcePlugin = require('html-webpack-inline-source-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlMinifierPlugin = require('html-minifier-webpack-plugin');

const isProduction = process.env.npm_lifecycle_event === 'build';

let htmlConfig = {
  filename: 'index.html',
  template: 'src/index.html'
};

if (isProduction) {
  htmlConfig.inlineSource = '.(js|css)$';
}

let config = {
  mode: isProduction ? 'production' : 'development',
  entry: './src/index.js',
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'script.js'
  },
  module: {
    rules: [{
      test: /\.js$/,
      exclude: /node_modules/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: [
            ['env', {
              modules: false, useBuiltIns: true,
              'exclude': ['transform-regenerator', 'transform-es2015-arrow-functions']
            }]
          ]
        }
      }
    }, {
      test: /\.css$/,
      use: ExtractTextPlugin.extract({
        fallback: 'style-loader',
        use: 'css-loader'
      })
    }]
  },
  plugins: [
    new ExtractTextPlugin('style.css'),
    new HtmlWebpackPlugin(htmlConfig),
    new HtmlWebpackInlineSourcePlugin()
  ],
  stats: 'minimal',
  devServer: {
    stats: 'minimal'
  }
};

if (!isProduction) {
  config.devtool = 'eval-source-map';
} else {
  config.plugins = config.plugins.concat([
    new webpack.optimize.ModuleConcatenationPlugin(),
    new HtmlMinifierPlugin({
      minifyCSS: true,
      minifyJS: true,
      removeComments: true,
      collapseWhitespace: true
    })
  ]);
}

module.exports = config;
