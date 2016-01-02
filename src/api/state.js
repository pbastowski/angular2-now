import {
  common
}
from './../common';
import {
  serviceExists, nameSpace, camelCase
}
from './../utils';

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
export function State(options) {

  if (!options || !(options instanceof Object) || options.name === undefined) {
    throw new Error('@State: Valid options are: name, url, defaultRoute, template, templateUrl, templateProvider, resolve, abstract, parent, data.');
  }

  return function(target) {

    let deps;
    const resolvedServiceName = nameSpace(camelCase(target.selector || (options.name + '').replace('.', '-')));

    // Indicates if there is anything to resolve
    let doResolve = false;

    // Values to resolve can either be supplied in options.resolve or as a static method on the
    // component's class
    const resolves = options.resolve || target.resolve;

    // Is there a resolve block?
    if (resolves && resolves instanceof Object && (deps = Object.keys(resolves)).length) {
      doResolve = true;
    }

    // Create an injectable value service to share the resolved values with the controller
    // The service bears the same name as the component's camelCased selector name.
    if (doResolve) {
      if (!serviceExists(resolvedServiceName)) {
        angular.module(common.currentModule).value(resolvedServiceName, {});
      }
    }

    // Configure the state
    angular.module(common.currentModule)
      .config(['$urlRouterProvider', '$stateProvider', '$locationProvider',
        function($urlRouterProvider, $stateProvider, $locationProvider) {
          // Activate this state, if options.defaultRoute = true.
          // If you don't want this then don't set options.defaultRoute to true
          // and, instead, use $state.go inside the constructor to active a state.
          // You can also pass a string to defaultRoute, which will become the default route.
          if (options.defaultRoute) {
            $urlRouterProvider.otherwise((typeof options.defaultRoute === 'string') ? options.defaultRoute : options.url);
          }

          // Optionally configure html5Mode
          if (!(typeof options.html5Mode === 'undefined')) {
            $locationProvider.html5Mode(options.html5Mode);
          }

          // The user can supply a controller through a parameter in options
          // or the class itself can be used as the controller if no component is annotated.
          const userController = options.controller || (!target.selector ? target : undefined);

          // Also, de-namespace the resolve injectables for ui-router to inject correctly
          if (userController && userController.$inject && userController.$inject.length && deps && deps.length) {
            deps.forEach(function(dep) {
              const i = userController.$inject.indexOf(common.currentNameSpace + '_' + dep);

              if (i !== -1) {
                userController.$inject[i] = dep;
              }
            });
          }


          // This is the state definition object
          const sdo = {
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
            //(**) The bootstrap component will be rendered by Angular directly and must not
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
            controllerAs: common.ng2nOptions.hasOwnProperty('controllerAs') && !target.hasOwnProperty('selector') ? common.ng2nOptions.controllerAs : undefined,

            // onEnter and onExit events
            onEnter: options.onEnter,
            onExit: options.onExit,

            // Custom parent State
            parent: options.parent,

            // Custom data
            data: options.data
          };

          // sdo's template
          if (options.templateUrl) {
            sdo.template = options.templateUrl;
          } else if (options.templateProvider) {
            sdo.template = undefined;
          } else if (options.template) {
            sdo.template = options.templateUrl;
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
          function controller(...args) {
            // This is the service that we "unshifted" earlier
            let localScope = args[0];

            args = args.slice(1);

            // Now we copy the resolved values to the service.
            // This service can be injected into a component's constructor, for example.
            deps.slice(1).forEach(function(v, i) {
              localScope[v] = args[i];
            });

          }

        }
      ]);

    return target;
  };

}
