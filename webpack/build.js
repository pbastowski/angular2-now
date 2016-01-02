module.exports = function (type) {
    return {
        entry: './src/angular2-now.js',
        output: output,
        loaders: loaders
    };

    function output() {
        return {
            filename: 'dist/angular2-now' + (type === 'prod' ? '.min.js' : '.js'),
            libraryTarget: 'umd',
            library: 'angular2now'
        }
    }

    function loaders() {
        return [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel'
            }
        ];
    }
};
