export default (angular2now, ngModuleName) => {
  describe("bootstrap()", () => {
    const elementMock = {
      ready() {},
        on() {}
    };
    let spyModule;
    let spyBootstrap;
    let spyDocumentQuery;
    let spyElement;
    let spyElementReady;
    let spyElementOn;

    function callOnReady() {
      spyElementReady.calls.mostRecent().args[0]();
    }

    beforeEach(() => {
      spyModule = spyOn(angular, 'module');
      spyBootstrap = spyOn(angular, 'bootstrap').and.returnValue(true);
      spyDocumentQuery = spyOn(document, 'querySelector');
      spyElement = spyOn(angular, 'element').and.returnValue(elementMock);
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

      it("should use current module if target is function", () => {
        const target = function() {};

        angular2now.bootstrap(target);

        callOnReady();

        expect(spyBootstrap.calls.mostRecent().args[0]).toBe(document.body);
      });
    });

  });
};
