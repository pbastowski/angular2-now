export default (angular2now, ngModuleName) => {
  describe('basic', () => {
    it('should be defined', () => {
      expect(angular2now).toBeDefined();
    });
    it('should be available in window scope', () => {
      expect(window.angular2now).toBeDefined();
    });
  });
};
