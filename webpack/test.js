module.exports = require('./common')({
  entry: './tests/index-spec.js',
  output: undefined,
  module: {
    loaders: [
      // transpile and instrument only testing sources with isparta
      {
        test: /\.js$/,
        include: /src/,
        exclude: /node_modules/,
        loader: 'isparta'
      }
    ]
  }
});
