export default (angular2now, ngModuleName) => {
  describe('@Filter()', () => {
    /**
     * Filter name
     * @type {String}
     */
    const name = 'TestFilter';
    /**
     * Mock angular.module
     * @type {Object}
     */
    const moduleMock = {
      filter() {}
    };
    /**
     * spy on angular.module
     */
    let spyModule;
    /**
     * spy on angular.module().filter
     */
    let spyFilter;
    const foo = 'bar';

    /**
     * Target used in all tests
     */
    function Target() {
      return arguments;
    }
    // inject default service
    Target.$inject = ['$http'];

    function doFilter(opts) {
      return angular2now.Filter(opts)(Target);
    }

    beforeEach(() => {
      // set spies
      // and return mock
      spyModule = spyOn(angular, 'module').and.returnValue(moduleMock);
      spyFilter = spyOn(moduleMock, 'filter');
    });

    describe('with namespace', () => {
      beforeEach(() => {
        // set ngModuleName as currentModule
        angular2now.SetModule(`ns:${ngModuleName}`, []);
      });

      it('should set filter if argument is a string', () => {
        doFilter(name);

        expect(spyModule).toHaveBeenCalledWith(ngModuleName);
        expect(spyFilter).toHaveBeenCalledWith(`ns_${name}`, jasmine.any(Function));
      });

      it('should set filter if argument is an object with name property', () => {
        doFilter({
          name
        });

        expect(spyModule).toHaveBeenCalledWith(ngModuleName);
        expect(spyFilter).toHaveBeenCalledWith(`ns_${name}`, jasmine.any(Function));
      });
    });

    describe('without namespace', () => {
      beforeEach(() => {
        // set ngModuleName as currentModule
        angular2now.SetModule(`:${ngModuleName}`, []);
      });

      it('should set filter if argument is a string', () => {
        doFilter(name);

        expect(spyModule).toHaveBeenCalledWith(ngModuleName);
        expect(spyFilter).toHaveBeenCalledWith(name, jasmine.any(Function));
      });

      it('should set filter if argument is an object with name property', () => {
        doFilter({
          name
        });

        expect(spyModule).toHaveBeenCalledWith(ngModuleName);
        expect(spyFilter).toHaveBeenCalledWith(name, jasmine.any(Function));
      });
    });

    it('should pass target\'s arguments to filter function', () => {
      angular2now.SetModule(`:${ngModuleName}`, []);
      doFilter({
        name
      });

      // call filter function
      const args = spyFilter.calls.mostRecent().args[1]('foo', 'bar');

      // check arguments
      expect(args[0]).toBe('foo');
      expect(args[1]).toBe('bar');
    });

    it('should copy injectables to filter function', () => {
      angular2now.SetModule(`:${ngModuleName}`, []);
      doFilter({
        name
      });

      // call filter function
      const func = spyFilter.calls.mostRecent().args[1];

      expect(func.$inject).toEqual(Target.$inject);
    });

    it('should return the same target', () => {
      const result = doFilter({
        name
      });

      expect(result).toBe(Target);
    });
  });
};
