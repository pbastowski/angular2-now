import angular2now from './angular2-now';

describe("angular2-now", () => {
  const ngModuleName = 'test';

  it("should be available defined", () => {
    expect(angular2now).toBeDefined();
  });

  describe("SetModule()", () => {
    it("should create module", () => {
      angular2now.SetModule(ngModuleName, ['ui.router']);
      expect(angular.module(ngModuleName)).toBeDefined();
    });

    it("should have proper name", () => {
      expect(angular.module(ngModuleName).name).toBe(ngModuleName);
    });

    it("should contain ui.router", () => {
      expect(angular.module(ngModuleName).requires).toContain('ui.router');
    });

    it("should keep recently created module as current module", () => {
      expect(angular2now.options().currentModule()).toBe(ngModuleName);
    });

    it("should get module", () => {
      expect(angular2now.SetModule(ngModuleName)).toBe(angular.module(ngModuleName));
    });

    it("should overwrite module when using namespace with the same module name", () => {
      const nsModule = `ns:${ngModuleName}`
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
});
