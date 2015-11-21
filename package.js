Package.describe({
    name:          'pbastowski:angular2-now',
    version:       '1.0.0',
    summary:       'Angular 2 @Component syntax for Meteor 1.2 and AngularJS',
    git:           'https://github.com/pbastowski/angular2-now/tree/meteor1.2',
    documentation: 'README.md'
});

Package.onUse(function (api) {
    api.versionsFrom('1.2.0.1');
    api.use('angular@1.0.1', 'client');
    api.imply('angular@1.0.1', 'client');

    // Make sure we load after pbastowski:systemjs, if it's used
    api.use('pbastowski:systemjs', 'client', {weak: true});

    api.addFiles(['angular2-now.js', 'exports.js'], ['client'], {transpile: false});
    api.export(['angular2now']);
});

Package.onTest(function (api) {
    //api.use('tinytest');
    //api.use('pbastowski:angular2-now');
    //api.addFiles('angular2-now-tests.js');
});
