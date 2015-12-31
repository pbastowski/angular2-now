var webpack = require('webpack');
var build = require('./build')('dist');
var pkg = require('../package.json');

module.exports = {
    entry: build.entry,
    output: build.output(),
    module: {
        loaders: build.loaders()
    },
    plugins: [
        new webpack.BannerPlugin(pkg.name + " v" + pkg.version)
    ]
};
