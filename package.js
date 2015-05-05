Package.describe({
  name: 'pbastowski:angular2-now',
  version: '0.1.1',
  // Brief, one-line summary of the package.
  summary: 'Use Angular2 @Component syntax with Angular 1.x and Babel',
  // URL to the Git repository containing the source code for this package.
  git:     'https://github.com/pbastowski/angular2-now.git',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.1.0.2');
  api.addFiles('angular2-now.es6.js', ['client']);
  api.export(['angular2']);
});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use('pbastowski:angular2-now');
  api.addFiles('angular2-now-tests.js');
});
