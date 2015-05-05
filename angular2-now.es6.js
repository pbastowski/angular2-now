'use strict';

angular2 = {
    Component:     Component,
    View:          View,
    Inject:        Inject,
    Controller:    Controller,
    Service:       Service,
    bootstrap:     bootstrap,
    'Filter':      Filter,
    SetModuleName: SetModuleName,
    State:         State
};

var currentModule = 'app';

var angularModule = angular.module;

// Monkey patch angular.module
angular.module = function () {
    currentModule = arguments[0];

    return angularModule.apply(angular, arguments);
}

function SetModuleName(module, dependsOn) {
    module = module || 'app';
    currentModule = module;

    if (!dependsOn) dependsOn = [];

    // Check that the module exists and if not then create it now
    var ngModule;
    try {
        ngModule = angular.module(module)
    } catch (er) {
        ngModule = angular.module(module, dependsOn);
    }

    return ngModule;
}

function Component(options) {
    options = options || {};
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
            restrict:         (options.template + options.templateUrl) ? 'EA' : isClass ? 'C' : 'A',
            controllerAs:     options.selector,
            scope:            options['bind'] || {},
            bindToController: true,
            template:         options.template,
            templateUrl:      options.templateUrl,
            controller:       target,
            replace:          false,
            transclude:       /ng-transclude/i.test(options.template) || target.transclude
        }

        try {
            angular.module(options.module)
                .directive(options.selector, function () {
                    return ddo;
                });
        } catch (er) {
            throw new Error('Does module "' + options.module + '" exist? You may need to use angular.module("youModuleName").');
        }
    };


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

function Inject(deps) {
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


function View(options) {
    options = options || {};
    if (!options.template) options.template = undefined;

    return function (target) {
        target.template = options.template;
        target.templateUrl = options.templateUrl;

        // When a templateUrl is specified in options, then transclude can also be specified
        target.transclude = options.transclude;

        // directives is an array of child directive controllers (Classes)
        target.directives = options.directives;

        // If template contains the new <content> tag then add ng-transclude to it.
        // This will be picked up in @Component, where ddo.transclude will be set to true.
        // Note: If using options.url, you will have to add ng-transclude yourself to the element you wish to transclude
        // todo: access $templateCache looking for <content> and then add ng-transclude to it, as for an inline template
        var s = (options.template || '').match(/\<content[ >]([^\>]+)/i);
        if (s) {
            if (s[1].toLowerCase().indexOf('ng-transclude') === -1)
                target.template = target.template.replace(/\<content/i, '<content ng-transclude');
        }
        return target;
    }
}

function Controller(options) {
    options = options || {};
    if (!options.module) options.module = currentModule || 'app';

    return function (target) {
        //module+options.name.slice(0,1).toUpperCase()+options.name.slice(1),
        angular.module(options.module)
            .controller(options.module + '.' + options.name, target);
    }
}

function Service(options) {
    options = options || {};
    if (!options.module) options.module = currentModule || 'app';

    return function (target) {
        angular.module(options.module)
            .service(options.name, target);
        //.factory(options.name, function () { return new target })
    }
}

function Filter(options) {
    options = options || {};
    if (!options.module) options.module = currentModule || 'app';

    return function (target) {

        angular.module(options.module)
            .filter(options.name, function () {
                return new target
            });
    }
}

function bootstrap(target, config) {
    if (!target) {
        throw new Error("Can't bootstrap Angular without an object");
    }

    //var bootModule = target.moduleName || camelCase(target.selector) || currentModule;
    var bootModule = target.moduleName || target.selector || currentModule;

    if (bootModule !== currentModule)
        SetModuleName(bootModule);

    if (!config)
        config = {strictDi: false};

    if (Meteor && Meteor.isCordova)
        angular.element(document).on("deviceready", onReady);
    else
        angular.element(document).ready(onReady);

    function onReady() {
        // Find the component's element
        var el = document.querySelector(target.selector);

        angular.bootstrap(el, [bootModule], config);
    }
}


function State (options) {

    if (!options)
        throw new Error('@Route error: Valid options are: state, url, defaultRoute.');

    return function (target) {
        angular.module(currentModule)
            .config(['$urlRouterProvider', '$stateProvider',
            function ($urlRouterProvider, $stateProvider) {

                if (options.defaultRoute)
                    $urlRouterProvider.otherwise(options.url);

                $stateProvider.state(options.name, {
                    url:        options.url,
                    template:   options.template || '<' + target.selector + '></' + target.selector + '>',
                    resolve:    options.resolve,
                    controller: options.controller
                });
            }]);

    }
}
