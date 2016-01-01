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
};
