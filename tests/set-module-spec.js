export default (angular2now, ngModuleName) => {
  describe("SetModule()", () => {
    it("should create module", () => {
      angular2now.SetModule(ngModuleName, []);
      expect(angular.module(ngModuleName)).toBeDefined();
    });

    it("should have proper name", () => {
      angular2now.SetModule(ngModuleName, []);
      expect(angular.module(ngModuleName).name).toBe(ngModuleName);
    });

    it("should contain ui.router", () => {
      angular2now.SetModule(ngModuleName, ['ui.router']);
      expect(angular.module(ngModuleName).requires).toContain('ui.router');
    });

    it("should keep recently created module as current module", () => {
      const recent = `${ngModuleName}.new`;

      angular2now.SetModule(ngModuleName, []);
      expect(angular2now.options().currentModule()).toBe(ngModuleName);
      angular2now.SetModule(recent, []);
      expect(angular2now.options().currentModule()).toBe(recent);
    });

    it("should get module", () => {
      angular2now.SetModule(ngModuleName, []);
      expect(angular2now.SetModule(ngModuleName)).toBe(angular.module(ngModuleName));
    });

    it("should overwrite module when using namespace and the same module name", () => {
      const nsModule = `ns:${ngModuleName}`;
      angular2now.SetModule(nsModule, []);

      // module with ns:test as name should not be available
      expect(() => {
        angular.module(nsModule);
      }).toThrowError(/not available/);
      // test should now not contain ui.router
      expect(angular2now.SetModule(ngModuleName).requires).not.toContain('ui.router');
    });

    it("should update current module when new has been created", () => {
      const newModule = `${ngModuleName}New`
      angular2now.SetModule(newModule, []);
      expect(angular2now.options().currentModule()).toBe(newModule);
    });
  });
};
