'use strict';
declare var angular;
var Meteor = Meteor;

var currentModule = 'app';

var angularModule = angular.module;

// Monkey patch angular.module
angular.module = function () {
  currentModule = arguments[0];

  return angularModule.apply(angular, arguments);
}

export function Component(options:{
  name?: string;
  module?: string;
  selector?: string;
  injectables?: Array<string>;
  template?: string;
  templateUrl?: string;
  require?: Array<string>;
  link?: Function;
} = {}) {
  if (!options.module) options.module = currentModule || 'app';

  return function (target) {
    // service injections
    if (options.injectables && options.injectables instanceof Array)
      target = Inject(options.injectables)(target);

    // selector is optional, if not specified then the className is used
    options.selector = camelCase(options.selector || '') + '';
    if (options.selector[0] === '.') {
      var isClass = true;
      options.selector = options.selector.slice(1);
    }

    // moduleName is use to bootstrap Angular on a component
    target.moduleName = options.name;

    // Save the unCamelCased selector name, so that bootstrap() can use it
    target.selector = unCamelCase(options.selector);

    // The template can be passed in from the @Template decorator
    options.template = target.template || /*options.template ||*/ undefined;
    options.templateUrl = target.templateUrl || /*options.templateUrl ||*/ undefined;

    // Create the angular directive
    // todo: use module and name-spaced directive naming, perhaps from a config file like Greg suggested
    var ddo = {
      restrict: (options.template + options.templateUrl) ? 'EA' : isClass ? 'C' : 'A',
      controllerAs: options.selector,
      scope: options['bind'] || {},
      bindToController: true,
      template: options.template,
      templateUrl: options.templateUrl,
      controller: target,
      replace: false,
      transclude: /ng-transclude/i.test(options.template) || target.transclude,
      require: options.require || [options.selector, '^?ngModel'],
      link: options.link || link
    }

    try {
      angular.module(options.module)
          .directive(options.selector, function () {
            return ddo;
          });
    } catch (er) {
      throw new Error('Does module "' + options.module + '" exist? You may need to use angular.module("youModuleName").');
    }

    return target;

    function link(scope, el: HTMLElement, attr, controllers: Array) {
      // Make the ngModel available to the directive controller(constructor)
      // The controller runs first and the link after.
      // In the controller we define ngModel on $scope, as a $q.defered(),
      // which is detected below and resolved with the actual ngModel.
      // todo: investigate other, easier, ways of doing this.
      if (controllers[0].ngModel && typeof controllers[0].ngModel === 'function') {
        try {
          controllers[0].ngModel(controllers[1]);
          //scope.ngModel.resolve(controllers);
        } catch (er) {
          throw new Error("@Component: If you're trying access your component's ngModel, then in your constructor() add $scope.ngModel = $q.defered(). Remember to @Inject(['$scope', '$q']).");
        }
      }
    }
  };
}

// Does a provider with a specific name exist in the current module
function serviceExists(serviceName) {
  return !!getService(serviceName);
}

function getService(serviceName: string, moduleName?: string) {
  if (!moduleName)
    moduleName = currentModule;

  return angular.module(moduleName)
      ._invokeQueue
      .find(function(v,i) {
        return v[0]==='$provide' && v[2][0] === serviceName
      });
}

function camelCase(s) {
  return s.replace(/-(.)/g, function (a, b) {
    return b.toUpperCase()
  })
}

function unCamelCase(c) {
  var s = c.replace(/([A-Z])/g, function (a, b) {
    return '-' + b.toLowerCase()
  });
  if (s[0] === '-') s = s.slice(1);
  return s;
}

export function Inject(deps?: Array<string>) {
  deps = deps || [];
  return function (target) {
    if (!target.$inject)
      target.$inject = [];

    angular.forEach(deps, function (v) {
      if (v instanceof Object) v = v.name;
      if (target.$inject.indexOf(v) === -1)
        target.$inject.push(v);
    });

    return target
  }
}


export function View(options: {transclude?: boolean; directives?: Array}) {
  options = options || {};
  if (!options.template) options.template = undefined;

  return function (target) {
    target.template = options.template;
    target.templateUrl = options.templateUrl;

    // When a templateUrl is specified in options, then transclude can also be specified
    target.transclude = options.transclude;

    // directives is an array of child directive controllers (Classes)
    target.directives = options.directives;

    // Check for the new <content> tag and add ng-transclude to it, if not there.
    if (target.template)
      target.template = transcludeContent(target.template);

    //if (target.templateUrl && !_templateCacheTranscluded[target.templateUrl]) {
    //    var template = _templateCache.get(target.templateUrl);
    //    if (template) {
    //        _templateCache.put(templateUrl, transcludeContent(template));
    //
    //        // Remember that we have already transcluded this template and don't do it again
    //        _templateCacheTranscluded[templateUrl] = true;
    //    }
    //    //else
    //    //    throw new Error('@View: Invalid templateUrl: "' + target.templateUrl + '".');
    //}

    return target;
  }

  // If template contains the new <content> tag then add ng-transclude to it.
  // This will be picked up in @Component, where ddo.transclude will be set to true.
  function transcludeContent(template) {
    var s = (template || '').match(/\<content[ >]([^\>]+)/i);
    if (s) {
      if (s[1].toLowerCase().indexOf('ng-transclude') === -1)
        template = template.replace(/\<content/i, '<content ng-transclude');
    }
    return template;
  }
}

export function Controller(options) {
  options = options || {};
  if (!options.module) options.module = currentModule || 'app';

  return function (target) {
    angular.module(currentModule)
        .controller(options.name, target);

    return target;
  };
}

export function Service(options) {
  options = options || {};
  if (!options.module) options.module = currentModule || 'app';

  return function (target) {
    angular.module(currentModule)
        .service(options.name, target);
    //.factory(options.name, function () { return new target })

    return target;
  };
}

export function Filter(options) {
  options = options || {};

  return function (target) {

    angular.module(currentModule)
        .filter(options.name, function () {
          return new target;
        });

    return target;
  };
}

export function bootstrap(target: {moduleName?: string; selector?: string}, config?) {
  if (!target) {
    throw new Error("Can't bootstrap Angular without an object");
  }

  //var bootModule = target.moduleName || camelCase(target.selector) || currentModule;
  var bootModule = target.moduleName || target.selector || currentModule;

  if (bootModule !== currentModule)
    angular.module(bootModule);

  if (!config)
    config = {strictDi: false};

  if (Meteor !== undefined && Meteor.isCordova)
    angular.element(document).on("deviceready", onReady);
  else
    angular.element(document).ready(onReady);

  function onReady() {
    // Find the component's element
    var el = document.querySelector(target.selector);

    angular.bootstrap(el, [bootModule], config);
  }
}

//
// @State can be used to annotate either a Component or a class.
//
// If class is annotated then it is assumed to be the controller and
// the state name will be used as the name of the injectable service
// if any resolves are requested.
//
// When a component is annotated and resolves requested, then the component's
// selector name is used as the name of the injectable service that holds
// their values.
//
export function State(options) {

  if (!options || !(options instanceof Object) || options.name === undefined)
    throw new Error('@State: Valid options are: name, url, defaultRoute, template, resolve, abstract.');

  return function (target) {

    var deps;
    var resolved = {};
    var resolvedServiceName = camelCase(target.selector || options.name);

    // Indicates if there is anything to resolve
    var doResolve;

    // Values to resolve can either be supplied in options.resolve or as a static method on the
    // component's class
    var resolves = options.resolve || target.resolve;

    // Is there a resolve block?
    if (resolves && resolves instanceof Object && (deps = Object.keys(resolves)).length)
      doResolve = true;

    // Create an injectable value service to share the resolved values with the controller
    // The service bears the same name as the component's camelCased selector name.
    if (doResolve) {
      if (!serviceExists(resolvedServiceName))
        angular.module(currentModule).value(resolvedServiceName, resolved);
    }

    // Configure the state
    angular.module(currentModule)
        .config(['$urlRouterProvider', '$stateProvider',
          function ($urlRouterProvider, $stateProvider) {

            // Activate this state, if options.defaultRoute = true.
            // If you don't want this then don't set options.defaultRoute to true
            // and, instead, use $state.go inside the constructor to active a state.
            // You can also pass a string to defaultRoute, which will become the default route.
            if (options.defaultRoute)
              $urlRouterProvider.otherwise((typeof options.defaultRoute === 'string') ? options.defaultRoute : options.url);

            // This is the state definition object
            var sdo = {
              url:      options.url,

              // Default values for URL parameters can be configured here.
              // ALso, parameters that do not appear in the URL can be configured here.
              params:   options.params,

              // The bootstrap component should always be abstract, otherwise weird stuff happens.

              abstract: options.abstract,

              templateUrl: options.templateUrl,

              // If this is an abstract state then we just provide a <div ui-view> for the children
              template: options.templateUrl ? undefined : options.template || (options.abstract ? '<div ui-view=""></div>' : target.selector ? '<' + target.selector + '></' + target.selector + '>' : ''),

              // Do we need to resolve stuff? If so, then we provide a controller to catch the resolved data
              resolve:    resolves,
              controller: options.controller || (!target.selector ? target : undefined) ||(doResolve ? controller : undefined)
            };

            //console.log('@State: target.template: ', target.template || target.templateUrl);
            //console.log('@State:    sdo.template: ', sdo.template);
            //console.log('@State:    sdo: ', resolvedServiceName, sdo);

            $stateProvider.state(options.name, sdo);

            // Publish the resolved values to an injectable service:
            // - "{selectorName}" => stores only local resolved values
            // This service can be injected into a component's constructor, for example.
            //
            if (doResolve) {
              deps.unshift(resolvedServiceName);

              controller.$inject = deps;
            }

            // Populate the published service with the resolved values
            function controller() {
              var args = Array.prototype.slice.call(arguments);
              //console.log('@State: controller: ', deps, args);
              var localScope = args[0];

              args = args.slice(1);
              deps = deps.slice(1);

              deps.forEach(function (v, i) {
                localScope[v] = args[i];
              });
            }

          }]);

    return target;
  };
}