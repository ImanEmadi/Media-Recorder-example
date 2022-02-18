/* eslint-disable */
const path = require('path-browserify');
module.exports = {
  mode: 'production',
  entry: { index: './index.ts' },
  watch: true,
  output: {
    path: path.join(__dirname, 'dist'),
    filename: "[name].js",
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    fallback: {
      "path": require.resolve('path-browserify'),
      "fs": false
    },
    extensions: ['.json', '.ts', '.js'],
  },
  target: 'web',
  devtool: 'source-map',
};