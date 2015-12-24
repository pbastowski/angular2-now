window.Meteor = {
  call() {}
};

export default (angular2now, ngModuleName) => {
  describe("@MeteorMethod()", () => {
    const name = 'foo';
    let descriptor;

    // injectables
    let $rootScope;

    function doMeteorMethod(opts) {
      return angular2now.MeteorMethod(opts)(undefined, name, descriptor);
    };

    function runMeteorMethod(opts) {
      const desc = doMeteorMethod(opts);

      return desc.value();
    }

    beforeEach(() => {
      // set module
      angular2now.SetModule(`:${ngModuleName}`, []);
      // reset descriptor
      descriptor = {
        value: function() {}
      };

      // load module
      window.module(ngModuleName);

      // get $rootScope to use digest
      inject((_$rootScope_) => {
        $rootScope = _$rootScope_;
      });
    });

    it("should call meteor method", () => {
      const spyCall = spyOn(Meteor, 'call');

      runMeteorMethod();

      expect(spyCall).toHaveBeenCalled();
    });

    it("should call beforeCall callback", () => {
      const spyCall = spyOn(Meteor, 'call');
      const events = {
        beforeCall() {}
      };

      const spyCallback = spyOn(events, 'beforeCall');

      runMeteorMethod({
        events
      });

      expect(spyCall).toHaveBeenCalled();
      expect(spyCallback).toHaveBeenCalled();
    });

    it("should call beforeCall callback", () => {
      const spyCall = spyOn(Meteor, 'call');
      const beforeCall = jasmine.createSpy('beforeCall');

      runMeteorMethod({
        events: {
          beforeCall
        }
      });

      expect(spyCall).toHaveBeenCalled();
      expect(beforeCall).toHaveBeenCalled();
    });
  });
};
