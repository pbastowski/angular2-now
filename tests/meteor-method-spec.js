window.Meteor = {
  call(name, callback) {
    callback();
  }
};

export default (angular2now, ngModuleName) => {
  describe("@MeteorMethod()", () => {
    const name = 'foo';
    let descriptor;
    let spyCall;

    // injectables
    let $rootScope;

    /**
     * Call @MeterMethod() with options on named descriptor
     * @param  {Any} opts Options
     * @return {Object} descriptor
     */
    function doMeteorMethod(opts) {
      return angular2now.MeteorMethod(opts)(undefined, name, descriptor);
    };

    /**
     * Calls both decorator and the method
     * @param  {Any} opts Options
     * @return {Promise}
     */
    function runMeteorMethod(opts) {
      const desc = doMeteorMethod(opts);

      return desc.value();
    }

    /**
     * Resolve called method
     * @param  {Any} data Resolve data
     */
    function resolveMethod(data) {
      spyCall.calls.mostRecent().args[1](undefined, data);
    }

    /**
     * Reject called method
     * @param  {Error} error Reject with Error
     */
    function rejectMethod(error) {
      spyCall.calls.mostRecent().args[1](error);
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

      // set spy on Meteor.call
      spyCall = spyOn(Meteor, 'call');
    });

    it("should call meteor method", () => {
      runMeteorMethod();

      expect(spyCall).toHaveBeenCalledWith(name, jasmine.any(Function));
    });

    it("should resolve meteor method", () => {
      const data = 'foo';
      const result = runMeteorMethod();

      // should have been called
      expect(spyCall).toHaveBeenCalledWith(name, jasmine.any(Function));
      // expect pending status
      expect(result.$$state.status).toBe(0);

      // now emulate method call
      resolveMethod(data);

      // expect resolved
      expect(result.$$state.status).toBe(1);
      // with data
      expect(result.$$state.value).toBe(data);
    });

    it("should reject meteor method", () => {
      const error = 'bar';
      const result = runMeteorMethod();

      // should have been called
      expect(spyCall).toHaveBeenCalledWith(name, jasmine.any(Function));
      // expect pending status
      expect(result.$$state.status).toBe(0);

      // now emulate method call
      rejectMethod(error);

      // expect rejected
      expect(result.$$state.status).toBe(2);
      // with error
      expect(result.$$state.value).toBe(error);
    });

    it("should call beforeCall", () => {
      const beforeCall = jasmine.createSpy('beforeCall');

      runMeteorMethod({
        events: {
          beforeCall
        }
      });

      expect(spyCall).toHaveBeenCalled();
      expect(beforeCall).toHaveBeenCalled();
    });

    describe("afterCall", () => {
      let afterCall;
      let promise;

      beforeEach(() => {
        afterCall = jasmine.createSpy('afterCall');

        promise = runMeteorMethod({
          events: {
            afterCall
          }
        });
      });

      it("should be called when resolved", (done) => {
        expect(spyCall).toHaveBeenCalled();
        expect(afterCall).not.toHaveBeenCalled();

        resolveMethod('test-resolved');

        promise.finally(() => {
          expect(afterCall).toHaveBeenCalled();
        });
        promise.finally(done);
      });

      it("should be called when rejected", (done) => {
        expect(spyCall).toHaveBeenCalled();
        expect(afterCall).not.toHaveBeenCalled();

        rejectMethod('test-rejected');

        promise.finally(() => {
          expect(afterCall).toHaveBeenCalled();
        });
        promise.finally(done);
      });
    });

    it("should show spinner", () => {
      const show = jasmine.createSpy('show');

      runMeteorMethod({
        spinner: {
          show,
          hide() {}
        }
      });

      expect(spyCall).toHaveBeenCalled();
      expect(show).toHaveBeenCalled();
    });

    describe("hide spinner", () => {
      let hide;
      let promise;

      beforeEach(() => {
        hide = jasmine.createSpy('hide');

        promise = runMeteorMethod({
          spinner: {
            hide,
            show() {}
          }
        });
      });

      it("should hide spinner when resolved", (done) => {
        expect(spyCall).toHaveBeenCalled();
        expect(hide).not.toHaveBeenCalled();

        resolveMethod('test-resolved');

        promise.finally(() => {
          expect(hide).toHaveBeenCalled();
        });
        promise.finally(done);
      });

      it("should hide spinner when rejected", (done) => {
        expect(spyCall).toHaveBeenCalled();
        expect(hide).not.toHaveBeenCalled();

        rejectMethod('test-rejected');

        promise.finally(() => {
          expect(hide).toHaveBeenCalled();
        });
        promise.finally(done);
      });
    });
  });
};
