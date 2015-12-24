export default (angular2now, ngModuleName) => {
  describe("@State()", () => {
    let target;
    const state = {
        name: 'test'
      }
      // spies
    let spyLocation = {};
    let spyUrlRouter = {};
    let spyState = {};

    function doStateRaw(opts) {
      const result = angular2now.State(opts)(target);

      window.module(ngModuleName);
      inject();

      return result;
    }

    function doState(opts) {
      return doStateRaw(angular.merge(state, opts));
    }

    function getSDO(opt) {
      return spyState.state.calls.mostRecent().args[1][opt];
    }

    function expectSDO(name, value) {
      doState({
        [name]: value
      });
      expect(getSDO(name)).toEqual(value);
    }

    beforeEach(() => {
      target = {};
      // spies
      angular.module('providersConfig', ['ui.router'])
        .config(function($locationProvider, $urlRouterProvider, $stateProvider) {
          spyLocation.html5Mode = spyOn($locationProvider, 'html5Mode');
          spyUrlRouter.otherwise = spyOn($urlRouterProvider, 'otherwise');
          spyState.state = spyOn($stateProvider, 'state');
        });
      window.module('providersConfig');
    });

    describe("before target", () => {
      it("should fail on missing options", () => {
        expect(() => {
          angular2now.State();
        }).toThrowError(Error, /options/);
      });

      it("should fail on missing name option", () => {
        expect(() => {
          angular2now.State({
            foo: 'bar'
          });
        }).toThrowError(Error, /options/);
      });

      it("should fail if argument is not an instance of Object", () => {
        expect(() => {
          angular2now.State("");
        }).toThrowError(Error, /options/);
      });
    });

    describe("html5Mode", () => {
      it("should set html5Mode", () => {
        doState({
          html5Mode: true
        });
        expect(spyLocation.html5Mode).toHaveBeenCalledWith(true);
      });
    });

    describe("defaultRoute", () => {
      it("should set url option if true", () => {
        doState({
          url: 'foo',
          defaultRoute: true
        });
        expect(spyUrlRouter.otherwise).toHaveBeenCalledWith('foo');
      });

      it("should set defaultRoute option if string", () => {
        doState({
          url: 'foo',
          defaultRoute: 'bar'
        });
        expect(spyUrlRouter.otherwise).toHaveBeenCalledWith('bar');
      });
    });

    describe("state", () => {
      describe("name", () => {
        it("should set the same name as in options", () => {
          doState();
          expect(spyState.state).toHaveBeenCalledWith(state.name, jasmine.any(Object));
        });
      });
      describe("url", () => {
        it("should be the same as in options", () => {
          expectSDO('url', 'foo');
        });
      });

      describe("params", () => {
        it("should be the same as in options", () => {
          expectSDO('params', {
            foo: 'bar'
          });
        });
      });

      describe("abstract", () => {
        it("should be the same as in options", () => {
          expectSDO('abstract', true);
        });
      });

      describe("templateUrl", () => {
        it("should be the same as in options", () => {
          expectSDO('templateUrl', 'foo.html');
        });
      });

      describe("templateProvider", () => {
        it("should be the same as in options", () => {
          expectSDO('templateProvider', function templateProvider() {});
        });
      });

      describe("onEnter", () => {
        it("should be the same as in options", () => {
          expectSDO('onEnter', function onEnter() {});
        });
      });

      describe("onExit", () => {
        it("should be the same as in options", () => {
          expectSDO('onExit', function onExit() {});
        });
      });

      describe("data", () => {
        it("should be the same as in options", () => {
          expectSDO('data', {
            foo: 'bar'
          });
        });
      });

      describe("parent", () => {
        it("should be the same as in options", () => {
          expectSDO('parent', 'baz');
        });
      });
    });
  });
};
