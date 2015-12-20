Package.describe({
    name:          'pbastowski:angular2-now',
    version:       '0.3.17',
    summary:       'Angular 2 @Component syntax for Angular 1',
    git:           'https://github.com/pbastowski/angular2-now.git',
    documentation: 'README.md'
});

Package.onUse(function (api) {
    api.versionsFrom('1.1.0.2');
    api.use('angular@1.0.1', 'client');
    api.imply('angular@1.0.1', 'client');
    api.addFiles(['angular2-now.js', 'exports.js'], ['client']);
    api.export(['angular2now']);
});

Package.onTest(function (api) {
    //api.use('tinytest');
    //api.use('pbastowski:angular2-now');
    //api.addFiles('angular2-now-tests.js');
});
