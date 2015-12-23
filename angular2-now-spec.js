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

    it("should overwrite module when using namespace and the same module name", () => {
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

  describe("@Inject()", () => {
    // TODO add tests of null, undefined and empty array as Inject() argument
    it("should throw error on empty dependencies", () => {
      expect(() => {
        angular2now.Inject();
      }).toThrowError(Error, /dependencies/);
    });

    it("should pass dependencies as an array", () => {
      expect(() => {
        angular2now.Inject(['$http', '$q']);
      }).not.toThrowError(Error, /dependencies/);
    });

    it("should pass dependencies directly", () => {
      expect(() => {
        angular2now.Inject('$http', '$q');
      }).not.toThrowError(Error, /dependencies/);
    });

    it("should fail on missing target", () => {
      expect(() => {
        angular2now.Inject(['$http', '$q'])();
      }).toThrowError(TypeError, /class/);
    });

    describe("with target", () => {
      // Services
      const Injectables = {
        target: ['$log', '$q'],
        inject: ['$http', '$http', '$q', 'customService']
      };
      const concatedRaw = Injectables.inject.concat(Injectables.target);
      const concated = _.uniq(
        _.reject(concatedRaw, (inj) => inj[0] !== '$')
      );
      // target mock
      const TargetMock = {
        $inject: Injectables.target
      };
      // @Inject mock
      const InjectMock = angular2now.Inject(Injectables.inject);

      it("should return target", () => {
        expect(InjectMock(TargetMock)).toBe(TargetMock);
      });

      // TODO fix bug! There are duplicates if target contains injectables and there is the same injectable provided by @Inject()
      it("should concat injectables", () => {
        // check if all injectables have been added
        concated.forEach((inj) => {
          expect(TargetMock.$inject.indexOf(inj)).not.toBe(-1);
        });

      });

      it("should add namespace to injectables", () => {
        const namespaced = _.reject(concatedRaw, (inj) => inj[0] === '$');

        // check with namespace prefix
        namespaced.forEach((inj) => {
          expect(TargetMock.$inject.indexOf(`ns_${inj}`)).not.toBe(-1);
        });
      });

      // TODO wait for pbastowski response
      /*
      it("should prevent duplicates", () => {
        const uniqueConcated = _.uniq(concatedRaw);
        const uniqueTarget = _.uniq(TargetMock.$inject);
        const diff = _.difference(uniqueTarget, uniqueConcated);

        expect(diff.length).toBe(0);
      });*/
    });
  });
});
