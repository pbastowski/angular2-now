export default (angular2now, ngModuleName) => {
  describe("@ScopeShared()", () => {
    it("should set scope as undefined", () => {
      const target = {};

      angular2now.ScopeShared(target);

      expect(target.scope).toBeUndefined();
    });

    it("should overwrite scope to undefined", () => {
      const target = {
        scope: true
      };

      angular2now.ScopeShared(target);

      expect(target.scope).toBeUndefined();
    });

    it("should return target", () => {
      const target = {
        scope: true
      };

      const result = angular2now.ScopeShared(target);

      expect(result).toBe(target);
    });
  });
};
