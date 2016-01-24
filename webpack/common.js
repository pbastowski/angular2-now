module.exports = {
  stats: {
    colors: true,
    reasons: true
  },
  resolve: {
    extensions: ['', '.js']
  },
  babel: {
    presets: ['es2015']
  },
  externals: {
    angular: 'angular'
  }
};
