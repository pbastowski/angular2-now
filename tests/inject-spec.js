export default (angular2now, ngModuleName) => {
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
      let target;

      function doInject() {
        return angular2now.Inject(Injectables.inject)(target);
      }

      // const InjectMock = angular2now.Inject(Injectables.inject);

      beforeEach(() => {
        angular2now.SetModule(`ns:${ngModuleName}`, []);
        target = {
          $inject: Injectables.target
        };
      });

      it("should return target", () => {
        expect(doInject()).toBe(target);
      });

      it("should concat injectables", () => {
        doInject();
        // check if all injectables have been added
        concated.forEach((inj) => {
          expect(target.$inject.indexOf(inj)).not.toBe(-1);
        });

      });

      it("should add namespace to injectables", () => {
        const namespaced = _.reject(concatedRaw, (inj) => inj[0] === '$');

        doInject();

        // check with namespace prefix
        namespaced.forEach((inj) => {
          expect(target.$inject.indexOf(`ns_${inj}`)).not.toBe(-1);
        });
      });
    });
  });
};
