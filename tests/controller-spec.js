export default (angular2now, ngModuleName) => {
  describe('@Controller()', () => {
    /**
     * controller name
     * @type {String}
     */
    const name = 'TestCtrl';
    /**
     * Mock angular.module
     * @type {Object}
     */
    const moduleMock = {
      controller() {

      }
    };
    /**
     * spy on angular.module
     */
    let spyModule;
    /**
     * spy on angular.module().directive
     */
    let spyCtrl;

    /**
     * Target used in decorator
     */
    function Target() {}

    /**
     * Shorthand for decorator call on target
     * @param  {Any} opts options
     * @return {Target}
     */
    function doController(opts) {
      return angular2now.Controller(opts)(Target);
    }


    beforeEach(() => {
      // set spies
      // and return mock
      spyModule = spyOn(angular, 'module').and.returnValue(moduleMock);
      spyCtrl = spyOn(moduleMock, 'controller');
    });

    describe('with namespace', () => {
      beforeEach(() => {
        // set ngModuleName as currentModule
        angular2now.SetModule(`ns:${ngModuleName}`, []);
      });

      it('should set name if argument is a string', () => {
        doController(name);

        expect(spyModule).toHaveBeenCalledWith(ngModuleName);
        expect(spyCtrl).toHaveBeenCalledWith(`ns_${name}`, Target);
      });

      it('should set name if argument is an object with name property', () => {
        doController({
          name
        });

        expect(spyModule).toHaveBeenCalledWith(ngModuleName);
        expect(spyCtrl).toHaveBeenCalledWith(`ns_${name}`, Target);
      });
    });

    describe('without namespace', () => {
      beforeEach(() => {
        // set ngModuleName as currentModule
        angular2now.SetModule(`:${ngModuleName}`, []);
      });

      it('should set name if argument is a string', () => {
        // angular2now.Controller(name)(Target);
        doController(name);

        expect(spyModule).toHaveBeenCalledWith(ngModuleName);
        expect(spyCtrl).toHaveBeenCalledWith(name, Target);
      });

      it('should set name if argument is an object with name property', () => {
        doController({
          name
        });

        expect(spyModule).toHaveBeenCalledWith(ngModuleName);
        expect(spyCtrl).toHaveBeenCalledWith(name, Target);
      });
    });

    it('should return target', () => {
      const result = doController({
        name
      });

      expect(result).toBe(Target);
    });
  });
};
