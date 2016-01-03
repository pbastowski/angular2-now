var gulp = require('gulp');
var replace = require('gulp-replace');

// bump npm package version into package.js
gulp.task('meteor', function() {
  // get version of npm package
  var version = require('./package.json').version;
  // find: version: '...'
  var versionRegex = /(version\:\s*\')([^\']+)\'/gi;
  // find: 'angular2-now': '...'
  var npmVersionRegex = /(\'angular2-now\'\:\s*')([^\']+)\'/gi;

  return gulp.src('package.js')
    // update version of meteor package
    .pipe(replace(versionRegex, '$1' + version + "'"))
    // update version of npm dependency
    .pipe(replace(npmVersionRegex, '$1' + version + "'"))
    .pipe(gulp.dest('./'));
});
