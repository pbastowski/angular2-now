angular2now = this.angular2now

if (typeof System !== 'undefined' && System.register) {
  System.register("angular2now", [], function(_export) {

    for (var i in angular2now)
      _export(i, angular2now[i]);

    return {
      setters: [],
      execute: function() {
        angular2now.init();
      }
    };

  })
} else {
  angular2now.init();
}
