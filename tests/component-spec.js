export default (angular2now, ngModuleName) => {
  describe('@Component()', () => {
    /**
     * Mock angular.module()
     * @type {Object}
     */
    const moduleMock = {
      directive: () => {}
    };
    /**
     * Target used in all tests
     */
    let target;
    /**
     * Spy on angular.module
     */
    let spyModule;
    /**
     * spy on angular.module().directive
     */
    let spyDirective;
    /**
     * Names
     */
    const nameCamel = 'testComponent';
    const nameClass = '.testComponent';
    const nameDashed = 'test-component';

    /**
     * Returns directive's object
     * @param  {Object|String} opt Component(opt)
     * @return {Object} target reference
     */
    function getDDO(opt) {
      const ddo = spyDirective.calls.mostRecent().args[1]();

      return ddo[opt];
    }

    /**
     * Retuns directive's name
     * @return {[type]} [description]
     */
    function getDDName() {
      return spyDirective.calls.mostRecent().args[0];
    }

    /**
     * Shorthand for angular2now.Component(opts)(target)
     * @param  {Object|String} opts Component(opts)
     * @return {Object} target reference
     */
    function doComponent(opts) {
      return angular2now.Component(opts)(target);
    }

    /**
     * Use it if you want to set component's option
     * and you expect the same value on directive definition object.
     * @param  {String} name  option's name
     * @param  {Any} value option's value
     */
    function expectDDO(name, value) {
      doComponent({
        [name]: value
      });
      expect(getDDO(name)).toEqual(value);
    }

    beforeEach(() => {
      // reset target
      target = function target() {};
      // add spy on angular.module and return mock
      spyModule = spyOn(angular, 'module').and.returnValue(moduleMock);
      // add spy on angular.module().directive;
      spyDirective = spyOn(moduleMock, 'directive');
    });

    it('should have target at controller', () => {
      const result = doComponent(nameDashed);

      expect(getDDO('controller')).toBe(result);
    });

    describe('options.selector', () => {
      it('should set selector if argument is a string', () => {
        const result = doComponent(nameDashed);

        expect(result.selector).toBe(nameDashed);
        expect(getDDName()).toBe(nameCamel);
      });

      it('should be able to unCamelCase selector', () => {
        const result = doComponent(nameCamel);

        expect(result.selector).toBe(nameDashed);
        expect(getDDName()).toBe(nameCamel);
      });

      it('should handle class name as selector', () => {
        const result = doComponent(nameClass);

        expect(result.selector).toBe(nameDashed);
        expect(getDDName()).toBe(nameCamel);
      });

      it('should call angular.directive with proper selector', () => {
        const result = doComponent(nameClass);

        expect(result.selector).toBe(nameDashed);
        expect(spyDirective).toHaveBeenCalled();
        expect(getDDName()).toBe(nameCamel);
      });
    });

    describe('options.injectables', () => {
      const injectables = ['$http', '$q'];

      it('should set injectables', () => {
        const result = doComponent({
          injectables
        });

        expect(result.$inject).toEqual(injectables);
        expect(result.$injectDefer).toEqual(result.$inject);
      });
    });

    describe('options.services', () => {
      const services = ['$http', '$q'];

      it('should set services', () => {
        const result = doComponent({
          services
        });

        expect(result.$inject).toEqual(services);
        expect(result.$injectDefer).toEqual(result.$inject);
      });
    });

    describe('options.template', () => {
      it('should set template', () => {
        expectDDO('template', 'foo');
      });
    });

    describe('options.templateUrl', () => {
      it('should set templateUrl', () => {
        expectDDO('templateUrl', 'foo.html');
      });
    });

    describe('options.transclude', () => {
      it('should set transclude to true', () => {
        expectDDO('transclude', true);
      });
      it('should set not set transclude', () => {
        const transclude = false;

        doComponent({
          transclude
        });

        expect(getDDO('transclude')).toBeUndefined();
      });
    });

    describe('options.restrict', () => {
      it('should set each restriction', () => {
        const restrictions = ['E', 'A', 'C', 'EA', 'EAC'];

        restrictions.forEach((restrict) => {
          expectDDO('restrict', restrict);
        });
      });
    });

    describe('options.controllerAs', () => {
      it('should set controllerAs', () => {
        expectDDO('controllerAs', 'foo');
      });

      it('should overwrite target\'s controllerAs', () => {
        const controllerAs = 'foo';

        target.controllerAs = 'bar';
        doComponent({
          controllerAs
        });

        expect(getDDO('controllerAs')).toBe(controllerAs);
      });
    });

    describe('options.scope', () => {
      it('should set scope', () => {
        const scopes = [true, false, undefined, {
          foo: 'bar'
        }];

        scopes.forEach((scope) => {
          expectDDO('scope', scope);
        });
      });

      it('should be skipped if target\'s scope is available', () => {
        const scopes = [true, false, undefined, {
          foo: 'bar'
        }];

        scopes.forEach((scope) => {
          target.scope = scope;
          doComponent({
            scope: {
              foo: 'baz'
            }
          });

          expect(getDDO('scope')).toBe(scope);
        });
      });

      it('should be an empty object if neither of bind, scope or target\'s scope is available', () => {
        doComponent({
          selector: nameDashed
        });

        expect(getDDO('scope')).toEqual({});
      });
    });

    describe('target.bindToController', () => {
      it('shoud set bindToController', () => {
        const bools = [true, false];

        bools.forEach((val) => {
          target.bindToController = val;
          doComponent();

          expect(getDDO('bindToController')).toBe(val);
        });
      });
    });

    describe('target.require', () => {
      it('should set require', () => {
        const require = ['@foo'];

        target.require = require;
        doComponent();

        expect(getDDO('require')).toBe(require);
      });
    });

    describe('options.require', () => {
      it('should set require', () => {
        expectDDO('require', ['@foo']);
      });

      it('should overwrite target\'s require', () => {
        const require = ['@foo'];

        target.require = ['@bar'];
        doComponent({
          require
        });

        expect(getDDO('require')).toBe(require);
      });
    });

    describe('require', () => {
      // injectables prefixed with @
      const atInjects = ['@^foo', '@bar'];
      // mix of injetables
      const injectables = ['$http'].concat(atInjects);
      // injectables used in controller
      const questionInjects = atInjects.map((inj) => '?' + inj.slice(1));

      it('should set require with @ prefixed injectables', () => {
        doComponent({
          injectables,
          selector: nameDashed
        });

        const requireDDO = getDDO('require');

        questionInjects.forEach((inj) => {
          expect(requireDDO.indexOf(inj)).not.toBe(-1);
        });
      });

      it('should set require with target', () => {
        doComponent({
          injectables,
          selector: nameDashed
        });

        expect(getDDO('require').indexOf(nameCamel)).not.toBe(-1);
      });

      it('should remove transformed injectables', () => {
        const result = doComponent({
          injectables,
          selector: nameDashed
        });

        atInjects.forEach((inj) => {
          expect(result.$inject.indexOf(inj)).toBe(-1);
          expect(result.$injectDefer.indexOf(inj)).toBe(-1);
        });
      });
    });

    describe('target.link', () => {
      it('should set link', () => {
        const link = function linkTarget() {};

        target.link = link;
        doComponent();

        expect(getDDO('link')).toBe(link);
      });
    });

    describe('options.link', () => {
      it('should set link', () => {
        expectDDO('link', function linkOptions() {});
      });

      it('should overwrite target\'s link', () => {
        const link = function linkOptions() {};

        target.link = function linkTarget() {};
        doComponent({
          link
        });

        expect(getDDO('link')).toBe(link);
      });
    });

    describe('restrict', () => {
      it('should be A by default', () => {
        doComponent(nameCamel);
        expect(getDDO('restrict')).toBe('A');
      });

      it('should be EA when templateUrl and non class selector', () => {
        doComponent({
          selector: nameCamel,
          templateUrl: 'foo.html'
        });
        expect(getDDO('restrict')).toBe('EA');
      });

      it('should be EA when template and non class selector', () => {
        doComponent({
          selector: nameCamel,
          template: 'foo'
        });
        expect(getDDO('restrict')).toBe('EA');
      });

      it('should be C when slector is a class name', () => {
        doComponent({
          selector: nameClass
        });
        expect(getDDO('restrict')).toBe('C');
      });
    });

    describe('controllerAs', () => {
      it('should be the same as selector by default', () => {
        doComponent({
          selector: nameDashed
        });
        expect(getDDO('controllerAs')).toBe(nameCamel);
      });

      it('should be owerwritten by options.controllerAs', () => {
        angular2now.options({
          controllerAs: 'vm'
        });
        doComponent({
          selector: nameDashed
        });
        expect(getDDO('controllerAs')).toBe('vm');

        // reset
        angular2now.options({
          controllerAs: null
        });
      });
    });

    describe('options.bind', () => {
      it('should set scope', () => {
        const bind = {
          foo: 'bar'
        };

        doComponent({
          bind
        });

        expect(getDDO('scope')).toEqual(bind);
      });
    });

    describe('transclude', () => {
      it('should be undefined by default', () => {
        doComponent({
          selector: nameDashed
        });

        expect(getDDO('transclude')).toBeUndefined();
      });

      it('should set transclude when template contains content element', () => {
        const template = `
          <div>
            <content></content>
          </div>
        `;

        doComponent({
          template
        });

        expect(getDDO('transclude')).toBe(true);
      });

      it('should set transclude when template does not contain content', () => {
        const template = `<div></div>`;

        doComponent({
          template
        });

        expect(getDDO('transclude')).toBeUndefined();
      });
    });

    describe('link', () => {
      it('should apply controllers on $dependson', () => {
        doComponent();
        const link = getDDO('link');
        const controllers = [
          jasmine.createSpyObj('foo', ['$dependson']), {
            name: 'bar'
          }, {
            name: 'baz'
          }
        ];

        expect(link).toEqual(jasmine.any(Function));

        // simulate link execution
        link(null, null, null, controllers);

        // check arguments
        expect(controllers[0].$dependson).toHaveBeenCalledWith(controllers[1], controllers[2]);
        // check context
        expect(controllers[0].$dependson.calls.mostRecent().object).toBe(controllers[0]);
      });
    });
  });
};
