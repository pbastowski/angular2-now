import { View } from './view';
import { Inject } from './inject';
import { common } from './../common';
import { camelCase, unCamelCase } from './../utils';

//function Directive(options) {
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
//}

export function Component(options) {
  options = options || {};
  // Allow shorthand notation of just passing the selector name as a string
  if (typeof options === 'string')
    options = {
      selector: options
    };

  return function(target) {
    let isClass = false;
    // service injections, which could also have been specified by using @Inject
    if (options.injectables && options.injectables instanceof Array) {
      target = Inject(options.injectables)(target);
    }
    // injectables has been renamed to services
    if (options.services && options.services instanceof Array) {
      target = Inject(options.services)(target);
    }

    // Selector name may be prefixed with a '.', in which case "restrict: 'C'" will be used
    options.selector = camelCase(options.selector || '') + '';
    if (options.selector[0] === '.') {
      isClass = true;
      options.selector = options.selector.slice(1);
    }

    // Save the unCamelCased selector name, so that bootstrap() can use it
    target.selector = unCamelCase(options.selector);

    // template options can be set with Component or with View
    // so, we run View on the passed in options first.
    if (options.template || options.templateUrl || options.transclude || options.directives)
      View(options)(target);

    // The template(Url) can also be passed in from the @View decorator
    options.template = target.template || undefined;
    options.templateUrl = target.templateUrl || undefined;

    // Build the require array.
    // Our controller needs the same injections as the component's controller,
    // but with the "@*" injections renamed to "$scope". The link function will pass
    // the "@*" injections directly to the component controller.
    const requiredControllers = [options.selector];
    target.$inject = target.$inject || [];
    target.$inject = target.$inject.map(function(dep) {
      if (/^@[^]{0,2}/.test(dep[0])) {
        requiredControllers.push('?' + dep.slice(1));
        dep = 'delete-me'
      }
      return dep;
    });

    // Remove all the 'delete-me' entries
    target.$inject = target.$inject.filter(function(v) {
      return v !== 'delete-me';
    });

    // Remember the original $inject, as it will be needed in the link function.
    // In the link function we will receive any requested component controllers
    // which we will then inject into the arguments that we will pass to the
    // actual constructor of our component.
    target.$injectDefer = target.$inject || [];

    // Create the angular directive
    const ddo = {
      controllerAs: options.controllerAs || common.controllerAs || target.controllerAs || options.selector,
      bindToController: typeof target.bindToController === 'boolean' ? target.bindToController : true,
      restrict: (options.template + options.templateUrl) ? 'EA' : isClass ? 'C' : 'A',
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
      angular.module(common.currentModule)
        .directive(options.selector, () => ddo);
    } catch (er) {
      throw new Error('Does module "' + common.currentModule + '" exist? You may need to use angular.module("youModuleName").');
    }

    return target;

    function link(scope, el, attr, controllers) {
      // Create a service with the same name as the selector
      // That holds a reference to our component
      //angular.module(currentModule).value(camelCase(target.selector), controllers[0]);

      // Alternate syntax for the injection of other component's controllers
      if (controllers[0].$dependson) {
        controllers[0].$dependson.apply(controllers[0], controllers.slice(1));
      }
    }
  };

}
