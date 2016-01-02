Tinytest.add('angular2now global object', function(test) {
  test.isFalse(typeof angular2now === 'undefined', 'Expected angular2now to be defined');

  // methods
  var methods = [
    'bootstrap',
    'Component',
    'Controller',
    'Directive',
    'Filter',
    'Inject',
    'MeteorMethod',
    'Options',
    'options',
    'ScopeNew',
    'ScopeShared',
    'Service',
    'SetModule',
    'State',
    'View'
  ];
  for (var i = 0; i < methods.length; i++) {
    test.equal(typeof angular2now[methods[i]], 'function', 'Expected ' + methods[i] + ' to be function');
  }
});
