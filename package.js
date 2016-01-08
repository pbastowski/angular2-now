Package.describe({
  name: 'pbastowski:angular2-now',
  version: '1.1.5',
  summary: 'Angular 2 @Component syntax for Meteor 1.2 and AngularJS',
  git: 'https://github.com/pbastowski/angular2-now.git',
  documentation: 'README.md'
});

Npm.depends({
  'angular2-now': '1.1.5'
});

Package.onUse(function(api) {
  api.versionsFrom('1.2.0.1');
  api.use('angular@1.3.4', 'client');
  api.imply('angular@1.3.4', 'client');

  // Make sure we load after pbastowski:systemjs, if it's used
  api.use('pbastowski:systemjs@0.0.1', 'client', {
    weak: true
  });

  api.addFiles([
    '.npm/package/node_modules/angular2-now/dist/angular2-now.js',
    'src/exports.js'
  ], 'client', {
    transpile: false
  });

  api.export(['angular2now']);
});
