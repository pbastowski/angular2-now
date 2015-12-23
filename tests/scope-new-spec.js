export default (angular2now, ngModuleName) => {
  describe("@ScopeNew()", () => {
    it("should set scope as true", () => {
      const target = {};

      angular2now.ScopeNew(target);

      expect(target.scope).toBe(true);
    });

    it("should overwrite scope to true", () => {
      const target = {
        scope: undefined
      };

      angular2now.ScopeNew(target);

      expect(target.scope).toBe(true);
    });

    it("should return target", () => {
      const target = {};

      const result = angular2now.ScopeShared(target);

      expect(result).toBe(target);
    });
  });
};
