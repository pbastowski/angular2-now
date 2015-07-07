Package.describe({
    name:          'pbastowski:angular2-now',
    version:       '0.4.0',
    summary:       'Use Angular2 @Component syntax with Angular 1.x and Babel',
    git:           'https://github.com/pbastowski/angular2-now.git',
    documentation: 'README.md'
});

Package.onUse(function (api) {
    api.versionsFrom('1.1.0.2');
    api.use('urigo:angular@0.9.2', 'client');
    api.use('pbastowski:angular-babel@0.1.8', 'client');
    api.imply('urigo:angular@0.9.2', 'client');
    api.imply('pbastowski:angular-babel@0.1.8', 'client');
    api.addFiles(['angular2-now.js', 'exports.js'], ['client']);
    api.export(['angular2now']);
});

Package.onTest(function (api) {
    api.use('tinytest');
    api.use('pbastowski:angular2-now');
    api.addFiles('angular2-now-tests.js');
});
