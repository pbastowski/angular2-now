export default (angular2now, ngModuleName) => {
  describe('@Inject()', () => {
    // TODO add tests of null, undefined and empty array as Inject() argument
    it('should throw error on empty dependencies', () => {
      expect(() => {
        angular2now.Inject();
      }).toThrowError(Error, /dependencies/);
    });

    it('should pass dependencies as an array', () => {
      expect(() => {
        angular2now.Inject(['$http', '$q']);
      }).not.toThrowError(Error, /dependencies/);
    });

    it('should pass dependencies directly', () => {
      expect(() => {
        angular2now.Inject('$http', '$q');
      }).not.toThrowError(Error, /dependencies/);
    });

    it('should fail on missing target without descriptor', () => {
      expect(() => {
        angular2now.Inject(['$http', '$q'])();
      }).toThrowError(TypeError, /class/);
    });

    it('should fail on missing descriptor without target', () => {
      expect(() => {
        angular2now.Inject(['$http', '$q'])(undefined, undefined, undefined);
      }).toThrowError(TypeError, /class/);
    });

    describe('with target or descriptor', () => {
      // Services
      const Injectables = {
        target: ['$log', '$q'],
        inject: ['$http', '$http', '$q', 'customService']
      };
      const concatedRaw = Injectables.inject.concat(Injectables.target);
      const concated = _.uniq(
        _.filter(concatedRaw, (inj) => {
          return inj[0] === '$';
        })
      );
      // mocks
      function target() {}
      let descriptor;

      function doInject(useDescriptor) {
        if (useDescriptor) {
          return angular2now.Inject(Injectables.inject)(undefined, undefined, descriptor);
        }
        return angular2now.Inject(Injectables.inject)(target);
      }

      beforeEach(() => {
        angular2now.SetModule(`ns:${ngModuleName}`, []);
        target.$inject = Injectables.target;
        descriptor = {
          value() {}
        };
      });

      it('should return target', () => {
        expect(doInject()).toBe(target);
      });

      it('should return descriptor', () => {
        expect(doInject(true)).toBe(descriptor);
      });

      it('should concat injectables', () => {
        doInject();
        // check if all injectables have been added
        concated.forEach((inj) => {
          expect(target.$inject.indexOf(inj)).not.toBe(-1);
        });
      });

      it('should add namespace to injectables', () => {
        const namespaced = _.reject(concatedRaw, (inj) => inj[0] === '$');

        doInject();

        // check with namespace prefix
        namespaced.forEach((inj) => {
          expect(target.$inject.indexOf(`ns_${inj}`)).not.toBe(-1);
        });
      });

      it('should use descriptor if available', () => {
        expect(descriptor.value.$inject).toBeUndefined();
        doInject(true);
        expect(descriptor.value.$inject).toBeDefined();
      });

      it('should keep injectables while extending class', () => {
        class parentClass {}
        angular2now.Inject(['$http'])(parentClass);
        class childClass extends parentClass {}

        expect(childClass.$inject).toContain('$http');
      });

      it('should keep injectables while extending component', () => {
        // parent class
        class parentClass {}
        // inject $http
        angular2now.Inject(['$http'])(parentClass);

        // child class
        class childClass extends parentClass {}

        // component extended by parentClass
        const result = angular2now.Component({
          selector: 'child-class'
        })(childClass);

        expect(result.$inject).toContain('$http');
      });
    });
  });
};
