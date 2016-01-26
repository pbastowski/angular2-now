var _ = require('lodash');
var webpack = require('webpack');
var pkg = require('../package.json');

function concatArrays(objValue, srcValue) {
  if (_.isArray(objValue)) {
    return _.uniq(objValue.concat(srcValue));
  }
}

module.exports = function(cfg) {
  var common = {
    babel: {
      presets: ['es2015']
    },
    entry: {
      'dist/angular2-now': './src/angular2-now'
    },
    externals: {
      angular: 'angular'
    },
    module: {
      loaders: [{
        test: /\.js$/,
        include: [
          /tests/,
          /src/
        ],
        exclude: /node_modules/,
        loader: 'babel'
      }]
    },
    output: {
      libraryTarget: 'umd',
      library: 'angular2now'
    },
    plugins: [
      new webpack.BannerPlugin(pkg.name + ' v' + pkg.version)
    ],
    resolve: {
      extensions: ['', '.js']
    },
    stats: {
      colors: true,
      reasons: true
    }
  };

  return _.merge({}, common, cfg, concatArrays);
};
