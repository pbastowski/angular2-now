export default (angular2now, ngModuleName) => {
  describe('@MeteorReactive', () => {
    it('should add meteorReactive to target', () => {
      const target = {};

      angular2now.MeteorReactive(target);

      expect(target.meteorReactive).toBe(true);
    });

    it('should return target', () => {
      const target = {
        selector: 'test'
      };

      expect(angular2now.MeteorReactive(target)).toBe(target);
    });
  });

  describe('on component', () => {
    /**
     * Mock angular.module()
     * @type {Object}
     */
    const moduleMock = {
      directive: () => {}
    };
    const selector = 'test-component';
    /**
     * Target used in all tests
     */
    let target;
    /**
     * Spy on angular.module
     */
    let spyModule;
    /**
     * spy on angular.module().directive
     */
    let spyDirective;
    /**
     * Shorthand for angular2now.Component(opts)(target)
     * @param  {Object|String} opts Component(opts)
     * @return {Object} target reference
     */
    function doReactiveComponent(opts) {
      angular2now.MeteorReactive(target);

      return angular2now.Component(opts)(target);
    }

    beforeEach(() => {
      // reset target
      target = function target() {};
      // add spy on angular.module and return mock
      spyModule = spyOn(angular, 'module').and.returnValue(moduleMock);
      // add spy on angular.module().directive;
      spyDirective = spyOn(moduleMock, 'directive');
    });

    it('should have $reactive and $scope', () => {
      const result = doReactiveComponent(selector);

      expect(result.$inject[0]).toBe('$reactive');
      expect(result.$inject[1]).toBe('$scope');
    });
  });
};
