'use strict';

// Include Gulp & tools we'll use
var gulp = require('gulp'),
    ts = require('gulp-typescript'),
    merge = require('merge2');

var tsProject = {
    typescript: require('typescript'),
    //sourceRoot: 'app/scripts',
    sortOutput: true,
    declarationFiles: true,
    noExternalResolve: false,
    //emitDecoratorMetadata: true,
    //declaration: false,
    //noImplicitAny: false,
    //removeComments: true,
    //noLib: false,
    //target: 'ES6'
    target: 'ES5',
    module: 'amd'       // commonjs (for Node) or amd (eg RequireJS for web)
};

gulp.task('default', function () {
    var tsResult = gulp.src('angular2-now.ts')
        .pipe(ts(tsProject, {}, ts.reporter.longReporter()));

    return merge(
        tsResult.js.pipe(gulp.dest('.')),
        tsResult.dts.pipe(gulp.dest('.'))
    );
});