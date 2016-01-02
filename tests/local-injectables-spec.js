export default (angular2now, ngModuleName) => {
  describe('@LocalInjectables', () => {
    it('should add localInjectables to target', () => {
      const target = {};

      angular2now.LocalInjectables(target);

      expect(target.localInjectables).toBe(true);
    });

    it('should return target', () => {
      const target = {
        selector: 'test'
      };

      expect(angular2now.LocalInjectables(target)).toBe(target);
    });
  });
};
