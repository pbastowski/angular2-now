export default (angular2now, ngModuleName) => {
  describe("@Directive", () => {
    it("should be an alias for @Component()", () => {
      expect(angular2now.Directive).toBe(angular2now.Component);
    });
  });
};
