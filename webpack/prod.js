var webpack = require('webpack');
var build = require('./build')('prod');
var pkg = require('../package.json');

module.exports = {
  entry: build.entry,
  output: build.output(),
  devtool: 'source-map',
  module: {
    loaders: build.loaders()
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin(),
    new webpack.BannerPlugin(pkg.name + " v" + pkg.version)
  ]
};
