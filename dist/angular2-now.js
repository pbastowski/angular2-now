/*! angular2-now v1.1.6 */
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["angular2now"] = factory();
	else
		root["angular2now"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});

	var _common = __webpack_require__(1);

	var _apiSetModule = __webpack_require__(2);

	var _apiComponent = __webpack_require__(3);

	var _apiScopeShared = __webpack_require__(7);

	var _apiScopeNew = __webpack_require__(8);

	var _apiView = __webpack_require__(4);

	var _apiInject = __webpack_require__(5);

	var _apiController = __webpack_require__(9);

	var _apiService = __webpack_require__(10);

	var _apiFilter = __webpack_require__(11);

	var _apiBootstrap = __webpack_require__(12);

	var _apiState = __webpack_require__(13);

	var _apiOptions = __webpack_require__(14);

	var _apiMeteorMethod = __webpack_require__(15);

	var _apiMeteorReactive = __webpack_require__(16);

	var _apiLocalInjectables = __webpack_require__(17);

	var angular2now = {
	  init: init,

	  SetModule: _apiSetModule.SetModule,

	  Component: _apiComponent.Component,
	  ScopeShared: _apiScopeShared.ScopeShared,
	  ScopeNew: _apiScopeNew.ScopeNew,
	  View: _apiView.View,
	  Inject: _apiInject.Inject,
	  Controller: _apiController.Controller,
	  Service: _apiService.Service,
	  Filter: _apiFilter.Filter,
	  bootstrap: _apiBootstrap.bootstrap,
	  State: _apiState.State,

	  options: _apiOptions.options,
	  Options: _apiOptions.Options,

	  MeteorMethod: _apiMeteorMethod.MeteorMethod,
	  MeteorReactive: _apiMeteorReactive.MeteorReactive,
	  LocalInjectables: _apiLocalInjectables.LocalInjectables,

	  Directive: _apiComponent.Component,
	  Injectable: _apiService.Service
	};

	function init() {
	  _common.common.isCordova = typeof cordova !== 'undefined';
	  _common.common.angularModule = angular.module;
	}

	if (typeof Meteor === 'undefined') {
	  init();
	}

	if (typeof window !== 'undefined') {
	  window.angular2now = angular2now;
	}

	exports['default'] = angular2now;
	module.exports = exports['default'];

/***/ },
/* 1 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	var common = {
	  angularModule: undefined,
	  currentModule: undefined,
	  currentNameSpace: undefined,
	  isCordova: false,
	  ng2nOptions: {
	    currentModule: function currentModule() {
	      return common.currentModule;
	    }
	  },
	  controllerAs: undefined,
	  $q: angular.injector(['ng']).get('$q')
	};
	exports.common = common;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	exports.SetModule = SetModule;

	var _common = __webpack_require__(1);

	function SetModule() {
	  /**
	   * Name-spacing applies to provider names, not modules. Each module
	   * has to have a unique name of it's own.
	   *
	   * A namespace may be specified like this:
	   *     SetModule('ftdesiree:helpers')
	   * The namespace, once set, will remain in force until removed.
	   * Remove the namespace like this:
	   *     angular.module(':helpers')
	   **/
	  _common.common.currentModule = arguments[0].split(':');

	  if (_common.common.currentModule.length === 1) {
	    // No namespace, just the module name
	    _common.common.currentModule = _common.common.currentModule[0];
	  } else {
	    // Split off the name-space and module name
	    _common.common.currentNameSpace = _common.common.currentModule[0];
	    _common.common.currentModule = _common.common.currentModule[1];

	    // Reassign arguments[0] without the namespace
	    arguments[0] = _common.common.currentModule;
	  }

	  return _common.common.angularModule.apply(angular, arguments);
	}

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	exports.Component = Component;

	var _view = __webpack_require__(4);

	var _inject = __webpack_require__(5);

	var _common = __webpack_require__(1);

	var _utils = __webpack_require__(6);

	// function Directive(options) {
	//
	//    // A string passed is assumed to be the attribute name of the directive.
	//    if (typeof options === 'string')
	//        options = { selector: options };
	//
	//    // Directives have shared scope by default (scope:undefined).
	//    // Optionally they can have a new scope created (scope: true).
	//    // If you require an isolate scope for your directive then
	//    // pass "scope: { ... }" in options.
	//    if (options && !options.hasOwnProperty('scope'))
	//        angular.merge(options, { scope: undefined });
	//
	//    return Component(options);
	// }

	function Component(options) {
	  options = options || {};
	  // Allow shorthand notation of just passing the selector name as a string
	  if (typeof options === 'string') {
	    options = {
	      selector: options
	    };
	  }

	  return function ComponentTarget(target) {
	    var isClass = false;

	    // Create a stub controller and substitute it for the target's constructor,
	    // so that we can call the target's constructor later, within the link function.
	    target = deferController(target, controller);

	    // service injections, which could also have been specified by using @Inject
	    if (options.injectables && options.injectables instanceof Array) {
	      target = (0, _inject.Inject)(options.injectables)(target);
	    }
	    // injectables has been renamed to services
	    if (options.services && options.services instanceof Array) {
	      target = (0, _inject.Inject)(options.services)(target);
	    }
	    // injectables has been renamed to providers, actually, but also keeping
	    // services in case anyone has used it already.
	    if (options.providers && options.providers instanceof Array) {
	      target = (0, _inject.Inject)(options.providers)(target);
	    }

	    // Selector name may be prefixed with a '.', in which case "restrict: 'C'" will be used
	    options.selector = (0, _utils.camelCase)(options.selector || '') + '';
	    if (options.selector[0] === '.') {
	      isClass = true;
	      options.selector = options.selector.slice(1);
	    }
	    // Save the unCamelCased selector name, so that bootstrap() can use it
	    target.selector = (0, _utils.unCamelCase)(options.selector);

	    // template options can be set with Component or with View
	    // so, we run View on the passed in options first.
	    if (options.template || options.templateUrl || options.transclude || options.directives) {
	      (0, _view.View)(options)(target);
	    }

	    // The template(Url) can also be passed in from the @View decorator
	    options.template = target.template || undefined;
	    options.templateUrl = target.templateUrl || undefined;

	    // Build the require array.
	    // Our controller needs the same injections as the component's controller,
	    // but with the "@*" injections renamed to "$scope". The link function will pass
	    // the "@*" injections directly to the component controller.
	    var requiredControllers = [options.selector];

	    target.$inject = target.$inject || [];
	    target.$inject = target.$inject.map(function (dep) {
	      if (/^@[^]{0,2}/.test(dep[0])) {
	        requiredControllers.push('?' + dep.slice(1));
	        dep = 'delete-me';
	      }
	      return dep;
	    });

	    // Remove all the 'delete-me' entries
	    target.$inject = target.$inject.filter(function (v) {
	      return v !== 'delete-me';
	    });

	    if (target.meteorReactive) {
	      // Prepend angular-meteor injectables
	      target.$inject.unshift('$scope');
	      target.$inject.unshift('$reactive');
	    }

	    // Remember the original $inject, as it will be needed in the link function.
	    // In the link function we will receive any requested component controllers
	    // which we will then inject into the arguments that we will pass to the
	    // actual constructor of our component.
	    target.$injectDefer = target.$inject || [];

	    // Create the angular directive
	    var ddo = {
	      controllerAs: options.controllerAs || _common.common.controllerAs || target.controllerAs || options.selector,
	      bindToController: typeof target.bindToController === 'boolean' ? target.bindToController : true,
	      restrict: options.template + options.templateUrl ? 'EA' : isClass ? 'C' : 'A',
	      scope: {},
	      template: options.template,
	      templateUrl: options.templateUrl,
	      controller: target,
	      replace: options.replace || false,
	      transclude: /ng-transclude/i.test(options.template) || target.transclude,
	      require: options.require || target.require || requiredControllers,
	      link: options.link || target.link || link
	    };

	    // ddo's restrict
	    if (options.restrict) {
	      ddo.restrict = options.restrict;
	    }
	    // ddo's scope
	    if (target.hasOwnProperty('scope')) {
	      ddo.scope = target.scope;
	    } else if (options.hasOwnProperty('scope')) {
	      ddo.scope = options.scope;
	    } else if (options['bind']) {
	      ddo.scope = options['bind'];
	    }

	    try {
	      angular.module(_common.common.currentModule).directive(options.selector, function () {
	        return ddo;
	      });
	    } catch (er) {
	      throw new Error('Does module "' + _common.common.currentModule + '" exist? You may need to use SetModule("youModuleName").');
	    }

	    return target;

	    // The stub controller below saves injected objects, so we can re-inject them
	    // into the "real" controller when the link function executes.
	    // This allows me to add stuff to the controller and it's "this", which is required
	    // for some future functionality.
	    function controller() {
	      var ctrlInstance = this;
	      var toInjectAfter = [];

	      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	        args[_key] = arguments[_key];
	      }

	      var injectedDeps = args;

	      if (target.meteorReactive) {
	        // Get injected angular-meteor objects
	        var $reactive = injectedDeps[0];
	        var $scope = injectedDeps[1];

	        $reactive(ctrlInstance).attach($scope);

	        toInjectAfter = injectedDeps.slice(0, 2);
	        injectedDeps = injectedDeps.slice(2);
	        target.$inject = target.$inject.slice(2);
	      }
	      if (target.localInjectables) {
	        target.$inject.forEach(function (value, index) {
	          ctrlInstance[value] = injectedDeps[index];
	        });
	      }
	      // Call the original constructor, which is now called $$init, injecting all the
	      // dependencies requested.
	      this.$$init.apply(this, injectedDeps);

	      if (toInjectAfter.length > 0) {
	        target.$inject = ['$reactive', '$scope'].concat(target.$inject);
	        injectedDeps.unshift(toInjectAfter[1]);
	        injectedDeps.unshift(toInjectAfter[0]);
	      }
	    }
	    // This function allows me to replace a component's "real" constructor with my own.
	    // I do this, because I want to decorate the $scope and this before instantiating
	    // the class's original controller. Also, this enables me to inject
	    // other component's controllers into the constructor, the same way as you would
	    // inject a service.
	    // The component's original constructor is assigned to the init method of the
	    // component's class, so that when it executes it will run in the original scope and
	    // closures that it was defined in. It is the init method that is called within the
	    // link function.
	    function deferController(target, controller) {
	      // Save the original prototype
	      var oldproto = target.prototype;
	      // Save the original constructor, so we can call it later
	      var construct = target.prototype.constructor;
	      // Save any static properties
	      var staticProps = {};

	      for (var i in target) {
	        staticProps[i] = target[i];
	      }
	      // Assign a new constructor, which holds the injected deps.
	      target = controller;
	      // Restore the original prototype
	      target.prototype = oldproto;
	      // Restore saved static properties
	      for (var i in staticProps) {
	        target[i] = staticProps[i];
	      }
	      // Store the original constructor under the name $$init,
	      // which we will call in the link function.
	      target.prototype.$$init = construct;
	      // Hide $$init from the user's casual inspections of the controller
	      // Object.defineProperty(target.prototype, "$$init", {enumerable: false})
	      return target;
	    }

	    function link(scope, el, attr, controllers) {
	      // Create a service with the same name as the selector
	      // That holds a reference to our component
	      // angular.module(currentModule).value(camelCase(target.selector), controllers[0]);

	      // Alternate syntax for the injection of other component's controllers
	      if (controllers[0].$dependson) {
	        controllers[0].$dependson.apply(controllers[0], controllers.slice(1));
	      }
	    }
	  };
	}

/***/ },
/* 4 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	exports.View = View;

	function View(options) {
	  options = options || {};
	  // Allow shorthand notation of just passing the templateUrl as a string
	  if (typeof options === 'string') {
	    options = {
	      templateUrl: options
	    };
	  }

	  // if (!options.template) options.template = undefined;

	  return function ViewTarget(target) {
	    target.template = options.template || target.template;
	    target.templateUrl = options.templateUrl || target.templateUrl;

	    // When a templateUrl is specified in options, then transclude can also be specified
	    target.transclude = options.transclude || target.transclude;

	    // directives is an array of child directive controllers (Classes)
	    target.directives = options.directives || target.directives;

	    // Check for the new <content> tag and add ng-transclude to it, if not there.
	    if (target.template) {
	      target.template = transcludeContent(target.template);
	    }

	    return target;
	  };

	  // If template contains the new <content> tag then add ng-transclude to it.
	  // This will be picked up in @Component, where ddo.transclude will be set to true.
	  function transcludeContent(template) {
	    var s = (template || '').match(/\<content[ >]([^\>]+)/i);

	    if (s && s[1].toLowerCase().indexOf('ng-transclude') === -1) {
	      template = template.replace(/\<content/i, '<content ng-transclude');
	    }

	    return template;
	  }
	}

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	exports.Inject = Inject;

	var _utils = __webpack_require__(6);

	// 2015-09-01 Replaced the whole Inject function with a new more flexible version.
	// Thanks to Steven Weingärtner for his code, which works with both Classes and Methods,
	// as well as preserving injectables from a parent class (when extending a parent class).
	// New features:
	// - Dependencies can be passed in as arguments, not requiring the array wrapper. The
	//   original syntax with the array wrapper is still supported.
	// - Methods of a class can now be Injected also
	// - Child classes will inherit the parent class's injectables, which will be appended
	//   to the end of the child's dependencies

	function Inject() {
	  var deps = undefined;

	  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	    args[_key] = arguments[_key];
	  }

	  if (args[0] instanceof Array) {
	    deps = args[0];
	  } else {
	    deps = args;
	  }

	  if (deps.length === 0) {
	    throw new Error('@Inject: No dependencies passed in');
	  }

	  return function InjectTarget(target, name, descriptor) {
	    var injectable = target;

	    if (descriptor) {
	      injectable = descriptor.value;
	    }

	    if (!injectable) {
	      throw new TypeError('@Inject can only be used with classes or class methods.');
	    }

	    var existingInjects = injectable.$inject;

	    injectable.$inject = [];

	    deps.forEach(function (dep) {
	      // Namespace any injectables without an existing nameSpace prefix and also
	      // not already prefixed with '$', '@' or '@^'.
	      if (dep[0] !== '$' && dep[0] !== '@' && dep.indexOf('_') === -1) {
	        dep = (0, _utils.nameSpace)(dep);
	      }

	      if (injectable.$inject.indexOf(dep) === -1) {
	        injectable.$inject.push(dep);
	      }
	    });

	    if (existingInjects) {
	      injectable.$inject = injectable.$inject.concat(existingInjects);
	    }

	    return descriptor || target;
	  };
	}

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	exports.nameSpace = nameSpace;
	exports.getService = getService;
	exports.serviceExists = serviceExists;
	exports.camelCase = camelCase;
	exports.unCamelCase = unCamelCase;

	var _common = __webpack_require__(1);

	// Create a new name from the concatenation of
	// the currentNameSpace and the name argument

	function nameSpace(name) {
	  return _common.common.currentNameSpace ? _common.common.currentNameSpace + '_' + name : name;
	}

	function getService(serviceName, moduleName) {
	  return angular.module(moduleName || _common.common.currentModule)._invokeQueue.filter(function (v) {
	    return v[0] === '$provide' && v[2][0] === serviceName;
	  })[0];
	}

	// Does a provider with a specific name exist in the current module

	function serviceExists(serviceName) {
	  return !!getService(serviceName);
	}

	function camelCase(s) {
	  return s.replace(/-(.)/g, function (a, b) {
	    return b.toUpperCase();
	  });
	}

	function unCamelCase(c) {
	  var s = c.replace(/([A-Z])/g, '-$1').replace(/--/g, '-').toLowerCase();

	  if (s[0] === '-') {
	    return s.slice(1);
	  }

	  return s;
	}

/***/ },
/* 7 */
/***/ function(module, exports) {

	// Cancels out the automatic creation of isolate scope for the directive,
	// because Angular 1.x allows only one isolate scope directive per element.
	// This is useful when actually creating directives, which add behaviour
	// to an existing element, as opposed to components which are stand alone
	// bits of html and behaviour.
	// The other way to do this is to pass "scope: undefined" to @Component.
	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.ScopeShared = ScopeShared;

	function ScopeShared(target) {
	  target.scope = undefined;
	  return target;
	}

/***/ },
/* 8 */
/***/ function(module, exports) {

	// Requests a new scope to be created when the directive is created.
	// The other way to do this is to pass "scope: true" to @Component.
	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.ScopeNew = ScopeNew;

	function ScopeNew(target) {
	  target.scope = true;
	  return target;
	}

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	exports.Controller = Controller;

	var _common = __webpack_require__(1);

	var _utils = __webpack_require__(6);

	function Controller(options) {
	  options = options || {};
	  // Allow shorthand notation of just passing the name as a string
	  if (typeof options === 'string') {
	    options = { name: options };
	  }

	  return function ControllerTarget(target) {
	    angular.module(_common.common.currentModule).controller((0, _utils.nameSpace)(options.name), target);
	    return target;
	  };
	}

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	exports.Service = Service;

	var _common = __webpack_require__(1);

	var _utils = __webpack_require__(6);

	function Service(options) {
	  options = options || {};
	  // Allow shorthand notation of just passing the name as a string
	  if (typeof options === 'string') {
	    options = {
	      name: options
	    };
	  }

	  return function ServiceTarget(target) {
	    angular.module(_common.common.currentModule).service((0, _utils.nameSpace)(options.name), target);
	    // .factory(options.name, function () { return new target })

	    return target;
	  };
	}

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	exports.Filter = Filter;

	var _common = __webpack_require__(1);

	var _utils = __webpack_require__(6);

	function Filter(options) {
	  options = options || {};
	  // Allow shorthand notation of just passing the name as a string
	  if (typeof options === 'string') {
	    options = {
	      name: options
	    };
	  }

	  return function FilterTarget(target) {
	    filterFunc.$inject = target.$inject;

	    angular.module(_common.common.currentModule).filter((0, _utils.nameSpace)(options.name), filterFunc);

	    function filterFunc() {
	      var args = Array.prototype.slice.call(arguments);
	      var f = new (Function.prototype.bind.apply(target, [null].concat(args)))();

	      return f;
	    }

	    return target;
	  };
	}

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	exports.bootstrap = bootstrap;

	var _common = __webpack_require__(1);

	/**
	 * Bootstraps the Angular 1.x app.
	 *
	 * @param ?target   undefined | string | class
	 *      undefined:  bootstraps on document and the current angular module
	 *      string:     will use document.querySelector to find the element by this string
	 *      class:      bootstraps on the component defined on this class, looks for selector
	 *
	 * @param ?config   angular.bootstrap() config object, see AngularJS doco
	 */

	function bootstrap(target, config) {
	  var bootOnDocument = false;

	  if (!target || target && !target.selector && typeof target === 'function') {
	    target = {
	      selector: _common.common.currentModule
	    };
	    bootOnDocument = true;
	  }

	  // Allow string shortcut for target.selector. Can be the name of any HTML tag.
	  if (typeof target === 'string') {
	    target = {
	      selector: target
	    };
	  }

	  // Mark this class as a bootstrap component. This allows @State
	  // to handle it correctly.
	  target.bootstrap = true;

	  var bootModule = target.selector || _common.common.currentModule;

	  if (bootModule !== _common.common.currentModule) {
	    angular.module(bootModule);
	  }

	  if (!config) {
	    config = {
	      strictDi: false
	    };
	  }

	  if (_common.common.isCordova) {
	    angular.element(document).on('deviceready', onReady);
	  } else {
	    angular.element(document).ready(onReady);
	  }

	  function onReady() {
	    var el = undefined;

	    if (!bootOnDocument) {
	      // Find the component's element
	      el = document.querySelector(target.selector);
	    } else {
	      // Or use document, if user passed no arguments
	      el = document.body;
	    }

	    angular.bootstrap(el, [bootModule], config);
	  }
	}

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	exports.State = State;

	var _common = __webpack_require__(1);

	var _utils = __webpack_require__(6);

	/**
	 * State can be used to annotate either a Component or a class and assign
	 * a ui-router state to it.
	 *
	 * @param options   literal object
	 *      name:              name of the state
	 *      url:               url associated with this state
	 *      template:          template
	 *      templateUrl:       templateUrl
	 *      templateProvider:  templateProvider
	 *      defaultRoute:      truthy = .otherwise(url)
	 *                         string = .otherwise(defaultRoute)
	 *      resolve:           Literal object, see ui-router resolve
	 *      abstract:          true/false
	 *      params:            Literal object, see ui-router doco
	 *      parent:            Define a custom parent state
	 *      controller:        A controller is automatically assigned, but if you need
	 *                         finer control then you can assign your own controller
	 *      controllerAs:      Specify ControllerAs for cases when there is no
	 *                         @Component used
	 *
	 * If a class is annotated then it is assumed to be the controller and
	 * the state name will be used as the name of the injectable service
	 * that will hold any resolves requested.
	 *
	 * When a component is annotated and resolves requested, then the component's
	 * selector name is used as the name of the injectable service that holds
	 * their values.
	 */

	function State(options) {
	  if (!options || !(options instanceof Object) || options.name === undefined) {
	    throw new Error('@State: Valid options are: name, url, defaultRoute, template, templateUrl, templateProvider, resolve, abstract, parent, data.');
	  }

	  return function StateTarget(target) {
	    var deps = undefined;
	    var resolvedServiceName = (0, _utils.nameSpace)((0, _utils.camelCase)(target.selector || (options.name + '').replace('.', '-')));

	    // Indicates if there is anything to resolve
	    var doResolve = false;

	    // Values to resolve can either be supplied in options.resolve or as a static method on the
	    // component's class
	    var resolves = options.resolve || target.resolve;

	    // Is there a resolve block?
	    if (resolves && resolves instanceof Object) {
	      deps = Object.keys(resolves);

	      if (deps.length) {
	        doResolve = true;
	      }
	    }

	    // Create an injectable value service to share the resolved values with the controller
	    // The service bears the same name as the component's camelCased selector name.
	    if (doResolve) {
	      if (!(0, _utils.serviceExists)(resolvedServiceName)) {
	        angular.module(_common.common.currentModule).value(resolvedServiceName, {});
	      }
	    }

	    // Configure the state
	    angular.module(_common.common.currentModule).config(['$urlRouterProvider', '$stateProvider', '$locationProvider', function ($urlRouterProvider, $stateProvider, $locationProvider) {
	      // Activate this state, if options.defaultRoute = true.
	      // If you don't want this then don't set options.defaultRoute to true
	      // and, instead, use $state.go inside the constructor to active a state.
	      // You can also pass a string to defaultRoute, which will become the default route.
	      if (options.defaultRoute) {
	        $urlRouterProvider.otherwise(typeof options.defaultRoute === 'string' ? options.defaultRoute : options.url);
	      }

	      // Optionally configure html5Mode
	      if (!(typeof options.html5Mode === 'undefined')) {
	        $locationProvider.html5Mode(options.html5Mode);
	      }

	      // The user can supply a controller through a parameter in options
	      // or the class itself can be used as the controller if no component is annotated.
	      var userController = options.controller || (!target.selector ? target : undefined);

	      // Also, de-namespace the resolve injectables for ui-router to inject correctly
	      if (userController && userController.$inject && userController.$inject.length && deps && deps.length) {
	        deps.forEach(function (dep) {
	          var i = userController.$inject.indexOf(_common.common.currentNameSpace + '_' + dep);

	          if (i !== -1) {
	            userController.$inject[i] = dep;
	          }
	        });
	      }

	      // This is the state definition object
	      var sdo = {
	        url: options.url,

	        // Default values for URL parameters can be configured here.
	        // ALso, parameters that do not appear in the URL can be configured here.
	        params: options.params,

	        // The State applied to a bootstrap component can be abstract,
	        // if you don't want that state to be able to activate.
	        abstract: options.abstract,

	        templateUrl: options.templateUrl,

	        // This is the "inline" template, as opposed to the templateUrl.
	        // 1) If either options.templateUrl or options.templateProvider is specified then
	        //      template will be set to undefined.
	        // 2) If options.template is provided then it will be used.
	        // 3) Otherwise, if this is a component, but not the bootstrap(**) component,
	        //    then we use it's selector to create the inline template "<selector></selector>".
	        // 4) Otherwise, we provide the following default template "<div ui-view></div>".
	        // (**) The bootstrap component will be rendered by Angular directly and must not
	        //     be rendered again by ui-router, or you will literally see it twice.
	        // todo: allow the user to specify their own div/span instead of forcing "div(ui-view)"
	        template: (target.template || target.templateUrl) && !target.bootstrap && target.selector ? target.selector.replace(/^(.*)$/, '<$1></$1>') : '<div ui-view=""></div>',

	        // The option for dynamically setting a template based on local values
	        //  or injectable services
	        templateProvider: options.templateProvider,

	        // Do we need to resolve stuff? If so, then we also provide a controller to catch the resolved data.
	        resolve: resolves,

	        // A user supplied controller OR
	        // An internally created proxy controller, if resolves were requested for a Component.
	        controller: doResolve ? controller : undefined,

	        // Optionally controllerAs can be specifically set for those situations,
	        // when we use @State on a class and there is no @Component defined.
	        controllerAs: _common.common.ng2nOptions.hasOwnProperty('controllerAs') && !target.hasOwnProperty('selector') ? _common.common.ng2nOptions.controllerAs : undefined,

	        // onEnter and onExit events
	        onEnter: options.onEnter,
	        onExit: options.onExit,

	        // Custom parent State
	        parent: options.parent,

	        // Custom data
	        data: options.data
	      };

	      // sdo's template
	      if (options.templateUrl || options.templateProvider) {
	        sdo.template = undefined;
	      } else if (options.template) {
	        sdo.template = options.template;
	      }

	      // sdo's controller
	      if (userController) {
	        sdo.controller = userController;
	      }

	      // sdo's controllerAs
	      if (target.controllerAs) {
	        sdo.controllerAs = target.controllerAs;
	      } else if (options.controllerAs) {
	        sdo.controllerAs = options.controllerAs;
	      }

	      // Create the state
	      $stateProvider.state(options.name, sdo);

	      // When our automatic controller is used, we inject the resolved values into it,
	      // along with the injectable service that will be used to publish them.
	      // If the user supplied a controller than we do not inject anything
	      if (doResolve) {
	        deps.unshift(resolvedServiceName);

	        controller.$inject = deps;
	      }

	      // Populate the published service with the resolved values
	      function controller() {
	        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	          args[_key] = arguments[_key];
	        }

	        // This is the service that we "unshifted" earlier
	        var localScope = args[0];

	        args = args.slice(1);

	        // Now we copy the resolved values to the service.
	        // This service can be injected into a component's constructor, for example.
	        deps.slice(1).forEach(function (v, i) {
	          localScope[v] = args[i];
	        });
	      }
	    }]);
	    return target;
	  };
	}

/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	exports.options = options;
	exports.Options = Options;

	var _common = __webpack_require__(1);

	var _setModule = __webpack_require__(2);

	// Allow configuration of some angular2-now default settings
	// controllerAs: if provided, will user this string instead of component name, for example "vm"

	function options(options) {
	  if (!options) {
	    return _common.common.ng2nOptions;
	  }

	  if (typeof options.controllerAs !== 'undefined') {
	    _common.common.controllerAs = options.controllerAs;
	  }

	  // Optional spinner object can be registered. It must expose show() and hide() methods.
	  // The spinner will be activated before any I/O operations and deactivated once they complete.
	  _common.common.ng2nOptions.spinner = options.spinner || {
	    show: angular.noop,
	    hide: angular.noop
	  };

	  // events expose beforeCall() and afterCall().
	  // beforeCall() will be called before any I/O operations.
	  // afterCall() will be called after any I/O operations have completed.
	  _common.common.ng2nOptions.events = options.events || {
	    beforeCall: angular.noop,
	    afterCall: angular.noop
	  };

	  // The noConflict option allows us to control whether or not angular2-now
	  // monkey-patches angular.module.
	  //  true = don't monkey patch.
	  //  false = (default for versions < 0.4.0)  DO monkey patch angular.module
	  //          for backwards compatibility
	  if (typeof options.noConflict !== 'undefined') {
	    angular.module = options.noConflict ? _common.common.angularModule : _setModule.SetModule;
	  }
	}

	function Options(options) {
	  return function OptionsTarget(target) {
	    angular.merge(_common.common.ng2nOptions, options);
	    return target;
	  };
	}

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	exports.MeteorMethod = MeteorMethod;

	var _common = __webpack_require__(1);

	// The name of the Meteor.method is the same as the name of class method.

	function MeteorMethod(_options) {
	  var options = angular.merge({}, _common.common.ng2nOptions, _options);
	  var spinner = options.spinner || {
	    show: angular.noop,
	    hide: angular.noop
	  };
	  var events = options.events || {
	    beforeCall: angular.noop,
	    afterCall: angular.noop
	  };

	  return function MeteorMethodTarget(target, name, descriptor) {
	    // Create a method that calls the back-end
	    descriptor.value = function () {
	      var argv = Array.prototype.slice.call(arguments);
	      var deferred = _common.common.$q.defer();

	      if (typeof spinner === 'string') {
	        if (angular.injector(['ng', _common.common.currentModule]).has(options.spinner)) {
	          spinner = angular.injector(['ng', _common.common.currentModule]).get(options.spinner);
	          options.spinner = spinner;
	        } else {
	          throw new Error('Spinner "' + spinner + '" does not exist.');
	        }
	      }

	      argv.unshift(name);
	      argv.push(resolver);

	      if (spinner) {
	        spinner.show();
	      }

	      if (events.beforeCall) {
	        events.beforeCall();
	      }
	      // Call optional events.beforeCall()

	      // todo: should call Meteor after resolution of promise returned by beforeCall()
	      Meteor.call.apply(this, argv);

	      deferred.promise['finally'](function () {
	        spinner.hide();
	        // Call optional events.afterCall()
	        if (events.afterCall) {
	          events.afterCall();
	        }
	      });

	      return deferred.promise;

	      function resolver(err, data) {
	        if (err) {
	          deferred.reject(err);
	        } else {
	          deferred.resolve(data);
	        }
	      }
	    };

	    return descriptor;
	  };
	}

/***/ },
/* 16 */
/***/ function(module, exports) {

	// Turn on an indication to run $reactive(this).attach($scope) for the component's controller.
	// Uses with Angular-Meteor: http://angular-meteor.com, v1.3 and up only
	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.MeteorReactive = MeteorReactive;

	function MeteorReactive(target) {
	  target.meteorReactive = true;
	  return target;
	}

/***/ },
/* 17 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.LocalInjectables = LocalInjectables;

	function LocalInjectables(target) {
	  target.localInjectables = true;
	  return target;
	}

/***/ }
/******/ ])
});
;