module.exports = {
    entry: './angular2-now-spec.js',
    stats: {
        colors: true,
        reasons: true
    },
    resolve: {
        extensions: ["", ".js"]
    },
    module: {
        loaders: [
            // transpile all files except testing sources with babel as usual
            {
                test: /\.js$/,
                include: [
                    /-spec/
                ],
                loader: 'babel'
            },
            // transpile and instrument only testing sources with isparta
            {
                test: /angular2-now\.js$/,
                exclude: /node_modules/,
                loader: 'istanbul-instrumenter'
            }
        ]
    }
};
