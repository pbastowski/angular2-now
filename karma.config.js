require('argv-set-env')();

// webpack configuration
var webpack = require('./webpack/config');

// main file with tests
var testFile = 'angular2-now-spec.js';

// is it Continuous Integration environment
var ciEnv = process.env.NODE_ENV === 'ci';

// add preprocessors
var preprocessors = {};
preprocessors[testFile] = ['webpack'];

module.exports = function(config) {
  var _config = {

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine'],


    // list of files / patterns to load in the browser
    files: [
      'node_modules/angular/angular.js',
      'node_modules/angular-mocks/angular-mocks.js',
      'node_modules/angular-ui-router/release/angular-ui-router.js',
      'node_modules/underscore/underscore.js',
      testFile
    ],


    // list of files to exclude
    exclude: [],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: preprocessors,

    webpack: webpack,

    coverageReporter: {
      reporters: [{
        type: 'lcov',
        dir: 'coverage/',
        subdir: '.'
      }, {
        type: 'json',
        dir: 'coverage/',
        subdir: '.'
      }, {
        type: 'text-summary'
      }]
    },

    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress', 'coverage'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: !ciEnv,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: [(ciEnv ? 'Firefox' : 'Chrome')],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: ciEnv
  };
  config.set(_config);
};
