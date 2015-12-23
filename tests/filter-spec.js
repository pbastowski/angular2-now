export default (angular2now, ngModuleName) => {
  describe("@Filter()", () => {
    const name = 'TestFilter';
    const moduleMock = {
      filter: function() {}
    }
    let spy;
    let spyFilter;
    const foo = 'bar';

    function Target() {
      return arguments;
    };
    Target.$inject = ['$http'];


    beforeEach(() => {
      // set spies
      spy = spyOn(angular, 'module').and.returnValue(moduleMock);
      spyFilter = spyOn(moduleMock, 'filter');
    });

    describe("with namespace", () => {
      beforeEach(() => {
        // set ngModuleName as currentModule
        angular2now.SetModule(`ns:${ngModuleName}`);
      });

      it("should set filter if argument is a string", () => {
        angular2now.Filter(name)(Target);

        expect(spy).toHaveBeenCalledWith(ngModuleName);
        expect(spyFilter).toHaveBeenCalledWith(`ns_${name}`, jasmine.any(Function));
      });

      it("should set filter if argument is an object with name property", () => {
        angular2now.Filter({
          name
        })(Target);

        expect(spy).toHaveBeenCalledWith(ngModuleName);
        expect(spyFilter).toHaveBeenCalledWith(`ns_${name}`, jasmine.any(Function));
      });
    });

    describe("without namespace", () => {
      beforeEach(() => {
        // set ngModuleName as currentModule
        angular2now.SetModule(`:${ngModuleName}`);
      });

      it("should set filter if argument is a string", () => {
        angular2now.Filter(name)(Target);

        expect(spy).toHaveBeenCalledWith(ngModuleName);
        expect(spyFilter).toHaveBeenCalledWith(name, jasmine.any(Function));
      });

      it("should set filter if argument is an object with name property", () => {
        angular2now.Filter({
          name
        })(Target);

        expect(spy).toHaveBeenCalledWith(ngModuleName);
        expect(spyFilter).toHaveBeenCalledWith(name, jasmine.any(Function));
      });
    });

    it("should pass target's arguments to filter function", () => {
      angular2now.SetModule(`:${ngModuleName}`);
      angular2now.Filter({
        name
      })(Target);

      // call filter function
      const args = spyFilter.calls.mostRecent().args[1]('foo', 'bar');

      // check arguments
      expect(args[0]).toBe('foo');
      expect(args[1]).toBe('bar');
    });

    it("should copy injectables to filter function", () => {
      angular2now.SetModule(`:${ngModuleName}`);
      angular2now.Filter({
        name
      })(Target);

      // call filter function
      const func = spyFilter.calls.mostRecent().args[1];

      expect(func.$inject).toEqual(Target.$inject);
    });

    it("should return the same target", () => {
      const result = angular2now.Filter({
        name
      })(Target);

      expect(result).toBe(Target);
    });
  });
};
