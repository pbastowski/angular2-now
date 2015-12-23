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
    });
  });

  describe("@View()", () => {
    it("should set templateUrl if argument is a string", () => {
      const target = {};
      const templateUrl = 'test.html';

      angular2now.View(templateUrl)(target);

      expect(target.templateUrl).toBe(templateUrl);
    });

    it("should overwrite target's templateUrl if argument is a string", () => {
      const templateUrl = 'test.html';
      const target = {
        templateUrl: `old-${templateUrl}`
      };

      angular2now.View(templateUrl)(target);

      expect(target.templateUrl).toBe(templateUrl);
    });

    it("should overwrite target's templateUrl if specified in options", () => {
      const templateUrl = 'test.html';
      const target = {
        templateUrl: `old-${templateUrl}`
      };

      angular2now.View({
        templateUrl
      })(target);

      expect(target.templateUrl).toBe(templateUrl);
    });

    it("should set template", () => {
      const template = 'foobar';
      const target = {};

      angular2now.View({
        template
      })(target);

      expect(target.template).toBe(template);
    });

    it("should overwrite target's template", () => {
      const template = 'foobar';
      const target = {
        template: `old-${template}`
      };

      angular2now.View({
        template
      })(target);

      expect(target.template).toBe(template);
    });

    it("should set transclude", () => {
      const transclude = true;
      const target = {};

      angular2now.View({
        transclude
      })(target);

      expect(target.transclude).toBe(transclude);
    });

    it("should overwrite transclude", () => {
      const transclude = true;
      const target = {
        transclude: false
      };

      angular2now.View({
        transclude
      })(target);

      expect(target.transclude).toBe(transclude);
    });

    it("should transclude content directive if available", () => {
      const template = `
        <div>
          <content></content>
        </div>
      `;
      const target = {
        template
      };

      angular2now.View()(target);

      expect(target.template).toContain('ng-transclude');
    });

    it("should set directives", () => {
      const directives = ['directive'];
      const target = {};

      angular2now.View({
        directives
      })(target);

      expect(target.directives).toBe(directives);
    });

    it("should overwrite directives", () => {
      const directives = ['directive'];
      const target = {
        directives: _.map(directives, (d) => `old-${d}`)
      };

      angular2now.View({
        directives
      })(target);

      expect(target.directives).toBe(directives);
    });
  });

  describe("@Controller()", () => {
    const name = 'TestCtrl';
    const moduleMock = {
      controller: function() {}
    }
    let spy;
    let spyCtrl;

    function Target() {};


    beforeEach(() => {
      // set spies
      spy = spyOn(angular, 'module').and.returnValue(moduleMock);
      spyCtrl = spyOn(moduleMock, 'controller');
    });

    describe("with namespace", () => {
      beforeEach(() => {
        // set ngModuleName as currentModule
        angular2now.SetModule(`ns:${ngModuleName}`);
      });

      it("should set name if argument is a string", () => {
        angular2now.Controller(name)(Target);

        expect(spy).toHaveBeenCalledWith(ngModuleName);
        expect(spyCtrl).toHaveBeenCalledWith(`ns_${name}`, Target);
      });

      it("should set name if argument is an object with name property", () => {
        angular2now.Controller({
          name
        })(Target);

        expect(spy).toHaveBeenCalledWith(ngModuleName);
        expect(spyCtrl).toHaveBeenCalledWith(`ns_${name}`, Target);
      });
    });

    describe("without namespace", () => {
      beforeEach(() => {
        // set ngModuleName as currentModule
        angular2now.SetModule(`:${ngModuleName}`);
      });

      it("should set name if argument is a string", () => {
        angular2now.Controller(name)(Target);

        expect(spy).toHaveBeenCalledWith(ngModuleName);
        expect(spyCtrl).toHaveBeenCalledWith(name, Target);
      });

      it("should set name if argument is an object with name property", () => {
        angular2now.Controller({
          name
        })(Target);

        expect(spy).toHaveBeenCalledWith(ngModuleName);
        expect(spyCtrl).toHaveBeenCalledWith(name, Target);
      });
    });

    it("should return target", () => {
      const result = angular2now.Controller({
        name
      })(Target);

      expect(result).toBe(Target);
    });
  });

  describe("@Service()", () => {
    const name = 'TestService';
    const moduleMock = {
      service: function() {}
    }
    let spy;
    let spyService;

    function Target() {};


    beforeEach(() => {
      // set spies
      spy = spyOn(angular, 'module').and.returnValue(moduleMock);
      spyService = spyOn(moduleMock, 'service');
    });

    describe("with namespace", () => {
      beforeEach(() => {
        // set ngModuleName as currentModule
        angular2now.SetModule(`ns:${ngModuleName}`);
      });

      it("should set service if argument is a string", () => {
        angular2now.Service(name)(Target);

        expect(spy).toHaveBeenCalledWith(ngModuleName);
        expect(spyService).toHaveBeenCalledWith(`ns_${name}`, Target);
      });

      it("should set service if argument is an object with name property", () => {
        angular2now.Service({
          name
        })(Target);

        expect(spy).toHaveBeenCalledWith(ngModuleName);
        expect(spyService).toHaveBeenCalledWith(`ns_${name}`, Target);
      });
    });

    describe("without namespace", () => {
      beforeEach(() => {
        // set ngModuleName as currentModule
        angular2now.SetModule(`:${ngModuleName}`);
      });

      it("should set service if argument is a string", () => {
        angular2now.Service(name)(Target);

        expect(spy).toHaveBeenCalledWith(ngModuleName);
        expect(spyService).toHaveBeenCalledWith(name, Target);
      });

      it("should set service if argument is an object with name property", () => {
        angular2now.Service({
          name
        })(Target);

        expect(spy).toHaveBeenCalledWith(ngModuleName);
        expect(spyService).toHaveBeenCalledWith(name, Target);
      });
    });
  });

  describe("@Filter()", () => {
    const name = 'TestFilter';
    const moduleMock = {
      filter: function() {}
    }
    let spy;
    let spyFilter;
    const foo = 'bar';

    function Target() {
      return arguments;
    };
    Target.$inject = ['$http'];


    beforeEach(() => {
      // set spies
      spy = spyOn(angular, 'module').and.returnValue(moduleMock);
      spyFilter = spyOn(moduleMock, 'filter');
    });

    describe("with namespace", () => {
      beforeEach(() => {
        // set ngModuleName as currentModule
        angular2now.SetModule(`ns:${ngModuleName}`);
      });

      it("should set filter if argument is a string", () => {
        angular2now.Filter(name)(Target);

        expect(spy).toHaveBeenCalledWith(ngModuleName);
        expect(spyFilter).toHaveBeenCalledWith(`ns_${name}`, jasmine.any(Function));
      });

      it("should set filter if argument is an object with name property", () => {
        angular2now.Filter({
          name
        })(Target);

        expect(spy).toHaveBeenCalledWith(ngModuleName);
        expect(spyFilter).toHaveBeenCalledWith(`ns_${name}`, jasmine.any(Function));
      });
    });

    describe("without namespace", () => {
      beforeEach(() => {
        // set ngModuleName as currentModule
        angular2now.SetModule(`:${ngModuleName}`);
      });

      it("should set filter if argument is a string", () => {
        angular2now.Filter(name)(Target);

        expect(spy).toHaveBeenCalledWith(ngModuleName);
        expect(spyFilter).toHaveBeenCalledWith(name, jasmine.any(Function));
      });

      it("should set filter if argument is an object with name property", () => {
        angular2now.Filter({
          name
        })(Target);

        expect(spy).toHaveBeenCalledWith(ngModuleName);
        expect(spyFilter).toHaveBeenCalledWith(name, jasmine.any(Function));
      });
    });

    it("should pass target's arguments to filter function", () => {
      angular2now.SetModule(`:${ngModuleName}`);
      angular2now.Filter({
        name
      })(Target);

      // call filter function
      const args = spyFilter.calls.mostRecent().args[1]('foo', 'bar');

      // check arguments
      expect(args[0]).toBe('foo');
      expect(args[1]).toBe('bar');
    });

    it("should copy injectables to filter function", () => {
      angular2now.SetModule(`:${ngModuleName}`);
      angular2now.Filter({
        name
      })(Target);

      // call filter function
      const func = spyFilter.calls.mostRecent().args[1];

      expect(func.$inject).toEqual(Target.$inject);
    });

    it("should return the same target", () => {
      const result = angular2now.Filter({
        name
      })(Target);

      expect(result).toBe(Target);
    });
  });

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

  describe("@Directive", () => {
    it("should be an alias for @Component()", () => {
      expect(angular2now.Directive).toBe(angular2now.Component);
    });
  });

  describe("@Component()", () => {
    const moduleMock = {
      directive: () => {}
    };
    let target;
    let spyModule;
    let spyDirective;
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

    beforeEach(() => {
      target = function target() {
      };
      spyModule = spyOn(angular, 'module').and.returnValue(moduleMock);
      spyDirective = spyOn(moduleMock, 'directive');
    });

    it("should have target at controller", () => {
      doComponent(nameDashed);

      expect(getDDO('controller')).toBe(target);
    });

    describe("options.selector", () => {

      it("should set selector if argument is a string", () => {
        doComponent(nameDashed);

        expect(target.selector).toBe(nameDashed);
        expect(getDDName()).toBe(nameCamel);
      });

      it("should be able to unCamelCase selector", () => {
        doComponent(nameCamel);

        expect(target.selector).toBe(nameDashed);
        expect(getDDName()).toBe(nameCamel);
      });

      it("should handle class name as selector", () => {
        doComponent(nameClass);

        expect(target.selector).toBe(nameDashed);
        expect(getDDName()).toBe(nameCamel);
      });

      it("should call angular.directive with proper selector", () => {
        doComponent(nameClass);

        expect(target.selector).toBe(nameDashed);
        expect(spyDirective).toHaveBeenCalled();
        expect(getDDName()).toBe(nameCamel);
      });
    });

    describe("options.injectables", () => {
      const injectables = ['$http', '$q'];

      it("should set injectables", () => {
        doComponent({
          injectables
        });

        expect(target.$inject).toEqual(injectables);
        expect(target.$injectDefer).toEqual(target.$inject);
      });
    });

    describe("options.services", () => {
      const services = ['$http', '$q'];

      it("should set services", () => {
        doComponent({
          services
        });

        expect(target.$inject).toEqual(services);
        expect(target.$injectDefer).toEqual(target.$inject);
      });
    });

    describe("options.template", () => {
      it("should set template", () => {
        const template = 'foo';

        doComponent({
          template
        });

        expect(getDDO('template')).toBe(template);
      });
    });

    describe("options.templateUrl", () => {
      it("should set templateUrl", () => {
        const templateUrl = 'foo.html';

        doComponent({
          templateUrl
        });

        expect(getDDO('templateUrl')).toBe(templateUrl);
      });
    });

    describe("options.transclude", () => {
      it("should set transclude to true", () => {
        const transclude = true;

        doComponent({
          transclude
        });

        expect(getDDO('transclude')).toBe(transclude);
      });
      it("should set not set transclude", () => {
        const transclude = false;

        doComponent({
          transclude
        });

        expect(getDDO('transclude')).toBeUndefined();
      });
    });

    describe("options.restrict", () => {

      it("should set each restriction", () => {
        const restrictions = ['E', 'A', 'C', 'EA', 'EAC'];

        restrictions.forEach((restrict) => {
          doComponent({
            restrict
          });

          expect(getDDO('restrict')).toBe(restrict);
        });
      });
    });

    describe("options.controllerAs", () => {
      it("should set controllerAs", () => {
        const controllerAs = 'foo';

        doComponent({
          controllerAs
        });

        expect(getDDO('controllerAs')).toBe(controllerAs);
      });

      it("should overwrite target's controllerAs", () => {
        const controllerAs = 'foo';

        target.controllerAs = 'bar';
        doComponent({
          controllerAs
        });

        expect(getDDO('controllerAs')).toBe(controllerAs);
      });
    });

    describe("options.scope", () => {
      it("should set scope", () => {
        const scopes = [true, false, undefined, {
          foo: 'bar'
        }];

        scopes.forEach((scope) => {
          doComponent({
            scope
          });

          expect(getDDO('scope')).toBe(scope);
        });
      });

      it("should be skipped if target's scope is available", () => {
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

      it("should be an empty object if neither of bind, scope or target's scope is available", () => {
        doComponent({
          selector: nameDashed
        });

        expect(getDDO('scope')).toEqual({});
      });
    });

    describe("target.bindToController", () => {
      it("shoud set bindToController", () => {
        const bools = [true, false];

        bools.forEach((val) => {
          target.bindToController = val;
          doComponent();

          expect(getDDO('bindToController')).toBe(val);
        });
      });
    });

    describe("target.require", () => {
      it("should set require", () => {
        const require = ['@foo'];

        target.require = require;
        doComponent();

        expect(getDDO('require')).toBe(require);
      });
    });

    describe("options.require", () => {
      it("should set require", () => {
        const require = ['@foo'];

        doComponent({
          require
        });

        expect(getDDO('require')).toBe(require);
      });

      it("should overwrite target's require", () => {
        const require = ['@foo'];

        target.require = ['@bar'];
        doComponent({
          require
        });

        expect(getDDO('require')).toBe(require);
      });
    });

    describe("require", () => {
      const monkeyInjects = ['@^foo', '@bar'];
      const injectables = ['$http'].concat(monkeyInjects);
      const questionInjects = monkeyInjects.map((inj) => '?' + inj.slice(1));

      it("should set require with @ prefixed injectables", () => {
        doComponent({
          injectables,
          selector: nameDashed
        });

        const requireDDO = getDDO('require');

        questionInjects.forEach((inj) => {
          expect(requireDDO.indexOf(inj)).not.toBe(-1);
        });
      });

      it("should set require with target", () => {
        doComponent({
          injectables,
          selector: nameDashed
        });

        expect(getDDO('require').indexOf(nameCamel)).not.toBe(-1);
      });

      it("should remove transformed injectables", () => {
        doComponent({
          injectables,
          selector: nameDashed
        });

        monkeyInjects.forEach((inj) => {
          expect(target.$inject.indexOf(inj)).toBe(-1);
          expect(target.$injectDefer.indexOf(inj)).toBe(-1);
        });
      });
    });

    describe("target.link", () => {
      it("should set link", () => {
        const link = function linkTarget() {};

        target.link = link;
        doComponent();

        expect(getDDO('link')).toBe(link);
      });
    });

    describe("options.link", () => {
      it("should set link", () => {
        const link = function linkOptions() {};

        doComponent({
          link
        });

        expect(getDDO('link')).toBe(link);
      });

      it("should overwrite target's link", () => {
        const link = function linkOptions() {};

        target.link = function linkTarget() {};
        doComponent({
          link
        });

        expect(getDDO('link')).toBe(link);
      });
    });
  });
});
