var gulp = require('gulp');
var replace = require('gulp-replace');
var bump = require('gulp-bump');

//
// Bump new patch version
// npm run bump:patch
//
gulp.task('bump:patch', function() {
  gulp.src('package.json')
    .pipe(bump({
      type: 'patch'
    }))
    .pipe(gulp.dest('./'));
});

//
// Bump new patch version
// $ npm run bump:minor
//
gulp.task('bump:minor', function() {
  gulp.src('package.json')
    .pipe(bump({
      type: 'minor'
    }))
    .pipe(gulp.dest('./'));
});

//
// Bump new major version
// $ npm run bump:major
//
gulp.task('bump:major', function() {
  gulp.src('package.json')
    .pipe(bump({
      type: 'major'
    }))
    .pipe(gulp.dest('./'));
});

//
// Update meteor version
// $ npm run meteor
//
gulp.task('meteor', function() {
  // current version
  var version = require('./package.json').version;
  // regex for package version and npm dependency version
  var regex = {
    version: /(version: ')([^\']+)'/gi,
    npm: /('angular2-now': ')([^\']+)'/gi
  };

  return gulp.src('package.js')
    // update version of meteor package
    .pipe(replace(regex.version, '$1' + version + "'"))
    // update version of npm dependency
    .pipe(replace(regex.npm, '$1' + version + "'"))
    .pipe(gulp.dest('./'));
});
