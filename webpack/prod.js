var webpack = require('webpack');

module.exports = require('./common')({
  output: {
    filename: '[name].min.js'
  },
  devtool: 'source-map',
  plugins: [
    new webpack.optimize.UglifyJsPlugin()
  ]
});
