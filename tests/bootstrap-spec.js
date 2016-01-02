export default (angular2now, ngModuleName) => {
  describe("bootstrap()", () => {
    /**
     * angular.element mock
     * @type {Object}
     */
    const elementMock = {
      ready() {},
        on() {}
    };
    /**
     * spy on angular.module
     */
    let spyModule;
    /**
     * spy on angular.bootstrap
     */
    let spyBootstrap;
    /**
     * spy on document.querySelector
     */
    let spyDocumentQuery;
    /**
     * spy on angular.element
     */
    let spyElement;
    /**
     * spy on angular.element().ready
     */
    let spyElementReady;
    /**
     * spy on angular.element().on
     */
    let spyElementOn;

    /**
     * Call element's "on" or "ready". Depends on Cordova
     * @return {[type]} [description]
     */
    function callOnReady() {
      spyElementReady.calls.mostRecent().args[0]();
    }

    beforeEach(() => {
      spyModule = spyOn(angular, 'module');
      // return custom value
      spyBootstrap = spyOn(angular, 'bootstrap').and.returnValue(true);
      spyDocumentQuery = spyOn(document, 'querySelector');
      // return angular.element() mock
      spyElement = spyOn(angular, 'element').and.returnValue(elementMock);
      // set spies on this mock
      spyElementReady = spyOn(elementMock, 'ready');
      spyElementOn = spyOn(elementMock, 'on');
    });

    describe("not cordova", () => {
      it("should use ready on document if target is not defined", () => {
        angular2now.bootstrap();

        expect(spyElement).toHaveBeenCalledWith(document);
        expect(spyElementReady).toHaveBeenCalledWith(jasmine.any(Function));
      });

      it("should use document's body if target is not defined", () => {
        angular2now.bootstrap();
        callOnReady();

        // bootstrap on document's body
        expect(spyBootstrap.calls.mostRecent().args[0]).toBe(document.body);
      });

      it("should use target's selector", () => {
        const selector = 'test-selector';

        angular2now.bootstrap({
          selector
        });

        spyDocumentQuery.and
          .returnValue(selector);

        callOnReady();

        expect(spyDocumentQuery).toHaveBeenCalledWith(selector);
        expect(spyBootstrap.calls.mostRecent().args[0]).toBe(selector);
      });

      it("should handle selector provided directly instead of options object", () => {
        const selector = 'test-selector';

        // bootstrap
        angular2now.bootstrap(selector);
        // add mock
        spyDocumentQuery.and
          .returnValue(selector);

        callOnReady();

        // expectations
        expect(spyDocumentQuery).toHaveBeenCalledWith(selector);
        expect(spyBootstrap.calls.mostRecent().args[0]).toBe(selector);
      });

      it("should use current module if target is function", () => {
        const target = function() {};

        angular2now.bootstrap(target);

        callOnReady();

        expect(spyBootstrap.calls.mostRecent().args[0]).toBe(document.body);
      });
    });

  });
};
