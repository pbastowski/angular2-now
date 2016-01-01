module.exports = {
  entry: './tests/index-spec.js',
  module: {
    loaders: [
      // transpile all files except testing sources with babel as usual
      {
        test: /\.js$/,
        include: [
          /tests/,
          /src/
        ],
        exclude: /node_modules/,
        loader: 'babel'
      },
      // transpile and instrument only testing sources with isparta
      {
        test: /\.js$/,
        include: /src/,
        exclude: /node_modules/,
        loader: 'isparta'
      }
    ]
  }
};
