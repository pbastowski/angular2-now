var angular2now = function () {
    'use strict';

    var angular2now = {
        SetModule: SetModule,

        Component:   Component,
        Directive:   Component,
        ScopeShared: ScopeShared,
        ScopeNew:    ScopeNew,
        View:        View,
        Inject:      Inject,
        Controller:  Controller,
        Service:     Service,
        Filter:      Filter,
        Injectable:  Service,
        bootstrap:   bootstrap,
        State:       State,

        options: options,
        Options: Options,

        MeteorMethod: MeteorMethod
    };

    var isCordova = typeof cordova !== 'undefined';

    var inj = angular.injector(['ng']);
    var $q = inj.get('$q');

    var currentModule;
    var currentNameSpace;
    var controllerAs;

    var ng2nOptions = {
        currentModule: function() { return currentModule; }
    };

    var angularModule = angular.module;

    // Monkey patch angular.module
    angular.module = SetModule;

    function SetModule () {
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
        currentModule = arguments[0].split(':');

        if (currentModule.length === 1) {
            // No namespace, just the module name
            currentModule = currentModule[0];
        } else {
            // Split off the name-space and module name
            currentNameSpace = currentModule[0];
            currentModule = currentModule[1];

            // Reassign arguments[0] without the namespace
            arguments[0] = currentModule;
        }

        return angularModule.apply(angular, arguments);
    }


    // Create a new name from the concatenation of
    // the currentNameSpace and the name argument
    function nameSpace(name) {
        var nsName = name;

        if (currentNameSpace) {
            //nsName = camelCase(currentModule) + '.' + name;
            nsName = currentNameSpace + '_' + name;
        }

        return nsName;
    }

    // Cancels out the automatic creation of isolate scope for the directive,
    // because Angular 1.x allows only one isolate scope directive per element.
    // This is useful when actually creating directives, which add behaviour
    // to an existing element, as opposed to components which are stand alone
    // bits of html and behaviour.
    // The other way to do this is to pass "scope: undefined" to @Component.
    function ScopeShared (target) {
        target.scope = undefined;
        return target
    }

    // Requests a new scope to be created when the directive is created.
    // The other way to do this is to pass "scope: true" to @Component.
    function ScopeNew (target) {
        target.scope = true;
        return target
    }

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

    function Component(options) {
        options = options || {};
        // Allow shorthand notation of just passing the selector name as a string
        if (typeof options === 'string')
            options = { selector: options };

        return function (target) {

            // service injections, which could also have been specified by using @Inject
            if (options.injectables && options.injectables instanceof Array)
                target = Inject(options.injectables)(target);

            // Selector name may be prefixed with a '.', in which case "restrict: 'C'" will be used
            options.selector = camelCase(options.selector || '') + '';
            if (options.selector[0] === '.') {
                var isClass = true;
                options.selector = options.selector.slice(1);
            }

            // Save the unCamelCased selector name, so that bootstrap() can use it
            target.selector = unCamelCase(options.selector);

            // The template can be passed in from the @View decorator
            options.template = target.template || undefined;
            options.templateUrl = target.templateUrl || undefined;

            // Build the require array.
            // Our controller needs the same injections as the component's controller,
            // but with the "@*" injections renamed to "$scope". The link function will pass
            // the "@*" injections directly to the component controller.
            var requiredControllers = [options.selector];
            target.$inject = target.$inject || [];
            target.$inject = target.$inject.map(function(dep) {
                if ( /^@[^]{0,2}/.test(dep[0]) ) {
                    requiredControllers.push('?' + dep.slice(1));
                    dep = 'delete-me'
                }
                return dep;
            });

            // Remove all the 'delete-me' entries
            target.$inject = target.$inject.filter(function(v) { return v !== 'delete-me'; });

            // Remember the original $inject, as it will be needed in the link function.
            // In the link function we will receive any requested component controllers
            // which we will then inject into the arguments that we will pass to the
            // actual constructor of our component.
            target.$injectDefer = target.$inject || [];

            // Create the angular directive
            var ddo = {
                restrict:         options.restrict || (options.template + options.templateUrl) ? 'EA' : isClass ? 'C' : 'A',
                controllerAs:     options.controllerAs || controllerAs || target.controllerAs || options.selector,
                scope:            target.hasOwnProperty('scope') ? target.scope : options.hasOwnProperty('scope') ? options.scope : options['bind'] || {},
                bindToController: target.bindToController || true,
                template:         options.template,
                templateUrl:      options.templateUrl,
                controller:       target,
                replace:          options.replace || false,
                transclude:       /ng-transclude/i.test(options.template) || target.transclude,
                require:          options.require || target.require || requiredControllers,
                link:             options.link || target.link || link
            };

            try {
                angular.module(currentModule)
                    .directive(options.selector, function () {
                        return ddo;
                    });
            } catch (er) {
                throw new Error('Does module "' + currentModule + '" exist? You may need to use angular.module("youModuleName").');
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

    // Does a provider with a specific name exist in the current module
    function serviceExists(serviceName) {
        return !!getService(serviceName);
    }

    function getService(serviceName, moduleName) {
        if (!moduleName)
            moduleName = currentModule;

        return angular.module(moduleName)
            ._invokeQueue
            .filter(function (v, i) {
                return v[0] === '$provide' && v[2][0] === serviceName
            })[0];
    }

    function camelCase(s) {
        return s.replace(/-(.)/g, function (a, b) {
            return b.toUpperCase();
        });
    }

    function unCamelCase(c) {
        var s = c.replace(/([A-Z])/g, '-$1')
                 .replace(/--/g, '-')
                 .toLowerCase();
        if (s[0] === '-') s = s.slice(1);
        return s;
    }

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
        var deps;
        if (arguments[0] instanceof Array)
            deps = arguments[0];
        else
            deps = Array.prototype.slice.call(arguments);

        if (deps.length === 0) {
            throw new Error('@Inject: No dependencies passed in');
        }

        return function (target, name, descriptor) {
            var injectable = target;
            if (descriptor)
                injectable = descriptor.value;

            if (!injectable)
                throw new TypeError('@Inject can only be used with classes or class methods.')

             var existingInjects = injectable.$inject;

            injectable.$inject = [];

            angular.forEach(deps, function (dep) {
                // Namespace any injectables without an existing nameSpace prefix and also
                // not already prefixed with '$', '@' or '@^'.
                if (dep[0] !== '$' && dep[0] !== '@' && dep.indexOf('_') === -1)
                    dep = nameSpace(dep);

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


    function View(options) {
        options = options || {};
        // Allow shorthand notation of just passing the templateUrl as a string
        if (typeof options === 'string')
            options = { templateUrl: options };

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

            return target;
        };

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

    function Controller(options) {
        options = options || {};
        // Allow shorthand notation of just passing the name as a string
        if (typeof options === 'string')
            options = { name: options };

        return function (target) {
            angular.module(currentModule)
                .controller(nameSpace(options.name), target);

            return target;
        };
    }

    function Service(options) {
        options = options || {};
        // Allow shorthand notation of just passing the name as a string
        if (typeof options === 'string')
            options = { name: options };

        return function (target) {
            angular.module(currentModule)
                .service(nameSpace(options.name), target);
            //.factory(options.name, function () { return new target })

            return target;
        };
    }

    function Filter(options) {
        options = options || {};
        // Allow shorthand notation of just passing the name as a string
        if (typeof options === 'string')
            options = { name: options };

        return function (target) {

            filterFunc.$inject = target.$inject;

            angular.module(currentModule)
                .filter(nameSpace(options.name), filterFunc);

            function filterFunc() {
                var args = Array.prototype.slice.call(arguments);
                var f = new (Function.prototype.bind.apply(target, [null].concat(args)));
                return f;
            }

            return target;
        };
    }

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
        if (!target || (target && !target.selector && typeof target === 'function')) {
            target = {selector: currentModule};
            var bootOnDocument = true;
        }

        // Allow string shortcut for target.selector. Can be the name of any HTML tag.
        if (typeof target === 'string') {
            target = {selector: target};
        }

        // Mark this class as a bootstrap component. This allows @State
        // to handle it correctly.
        target.bootstrap = true;

        var bootModule = target.selector || currentModule;

        if (bootModule !== currentModule)
            angular.module(bootModule);

        if (!config)
            config = {strictDi: false};

        if (!Meteor) var Meteor = {};
        if (isCordova)
            angular.element(document).on("deviceready", onReady);
        else
            angular.element(document).ready(onReady);

        function onReady() {
            // Find the component's element
            if (!bootOnDocument)
                var el = document.querySelector(target.selector);

            // Or use document, if user passed no arguments
            else
                var el = document.body;

            angular.bootstrap(el, [bootModule], config);
        }
    }

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

        if (!options || !(options instanceof Object) || options.name === undefined)
            throw new Error('@State: Valid options are: name, url, defaultRoute, template, templateUrl, templateProvider, resolve, abstract, parent, data.');

        return function (target) {

            var deps;
            var resolvedServiceName = nameSpace(camelCase(target.selector || (options.name+'').replace('.', '-')));

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
                if (!serviceExists(resolvedServiceName)) {
                    angular.module(currentModule).value(resolvedServiceName, {});
                }
            }

            // Configure the state
            angular.module(currentModule)
                .config(['$urlRouterProvider', '$stateProvider', '$locationProvider',
                    function ($urlRouterProvider, $stateProvider, $locationProvider) {

                        // Activate this state, if options.defaultRoute = true.
                        // If you don't want this then don't set options.defaultRoute to true
                        // and, instead, use $state.go inside the constructor to active a state.
                        // You can also pass a string to defaultRoute, which will become the default route.
                        if (options.defaultRoute)
                            $urlRouterProvider.otherwise((typeof options.defaultRoute === 'string') ? options.defaultRoute : options.url);

                        // Optionally configure html5Mode
                        if (! (typeof options.html5Mode === 'undefined'))
                            $locationProvider.html5Mode(options.html5Mode);

                        // The user can supply a controller through a parameter in options
                        // or the class itself can be used as the controller if no component is annotated.
                        var userController = options.controller || (!target.selector ? target : undefined);

                        // Also, de-namespace the resolve injectables for ui-router to inject correctly
                        if (userController && userController.$inject && userController.$inject.length && deps && deps.length) {
                            deps.forEach(function(dep) {
                                var i = userController.$inject.indexOf(currentNameSpace+'_'+dep);
                                if (i!==-1)
                                    userController.$inject[i] = dep;
                            });
                        }


                        // This is the state definition object
                        var sdo = {
                            url:      options.url,

                            // Default values for URL parameters can be configured here.
                            // ALso, parameters that do not appear in the URL can be configured here.
                            params:   options.params,

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
                            template: options.templateUrl || options.templateProvider ? undefined : options.template || ((target.template || target.templateUrl) && !target.bootstrap && target.selector ? target.selector.replace(/^(.*)$/, '<$1></$1>') : '<div ui-view=""></div>'),

                            // The option for dynamically setting a template based on local values
                            //  or injectable services
                            templateProvider: options.templateProvider,

                            // Do we need to resolve stuff? If so, then we also provide a controller to catch the resolved data.
                            resolve:    resolves,

                            // A user supplied controller OR
                            // An internally created proxy controller, if resolves were requested for a Component.
                            controller: userController || (doResolve ? controller : undefined),

                            // Optionally controllerAs can be specifically set for those situations,
                            // when we use @State on a class and there is no @Component defined.
                            controllerAs: target.controllerAs || options.controllerAs || (ng2nOptions.hasOwnProperty('controllerAs') && !target.hasOwnProperty('selector') ? ng2nOptions.controllerAs : undefined),

                            // onEnter and onExit events
                            onEnter: options.onEnter,
                            onExit:  options.onExit,

                            // Custom parent State
                            parent: options.parent,

                            // Custom data
                            data: options.data
                        };


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
                            var args = Array.prototype.slice.call(arguments);

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

    // Allow configuration of some angular2-now default settings
    // controllerAs: if provided, will user this string instead of component name, for example "vm"
    function options(options) {
        if (!options) return ng2nOptions;

        if (typeof options.controllerAs !== 'undefined') {
            controllerAs = options.controllerAs;
        }

        // Optional spinner object can be registered. It must expose show() and hide() methods.
        // The spinner will be activated before any I/O operations and deactivated once they complete.
        ng2nOptions.spinner = options.spinner || {show: angular.noop, hide: angular.noop};

        // events expose beforeCall() and afterCall().
        // beforeCall() will be called before any I/O operations.
        // afterCall() will be called after any I/O operations have completed.
        ng2nOptions.events = options.events || {beforeCall: angular.noop, afterCall: angular.noop};

        // The noConflict option allows us to control whether or not angular2-now
        // monkey-patches angular.module.
        //  true = don't monkey patch.
        //  false = (default for versions < 0.4.0)  DO monkey patch angular.module
        //          for backwards compatibility
        if (typeof options.noConflict !== 'undefined') {
            if (options.noConflict)
                angular.module = angularModule;
            else
                angular.module = SetModule;
        }
    }

    function Options(options) {
        return function(target) {
            angular.merge(ng2nOptions, options);
            return target;
        }
    }

    // The name of the Meteor.method is the same as the name of class method.
    function MeteorMethod(_options) {
        var options = angular.merge({}, ng2nOptions, _options);
        var spinner = options.spinner || {show: angular.noop, hide: angular.noop};
        var events = options.events || {beforeCall: angular.noop, afterCall: angular.noop};

        return function (target, name, descriptor) {

            // Create a method that calls the back-end
            descriptor.value = function () {
                var argv = Array.prototype.slice.call(arguments);
                var deferred = $q.defer();

                if (typeof spinner === 'string') {
                    if (angular.injector(['ng', currentModule]).has(options.spinner)) {
                        spinner = angular.injector(['ng', currentModule]).get(options.spinner);
                        options.spinner = spinner;
                    } else
                        throw new Error('Spinner "' + spinner + '" does not exist.');
                }

                argv.unshift(name);
                argv.push(resolver);

                if (spinner) spinner.show();
                if (events.beforeCall) events.beforeCall();  // Call optional events.beforeCall()

                // todo: should call Meteor after resolution of promise returned by beforeCall()
                Meteor.call.apply(this, argv);

                deferred.promise.finally(function() {
                    spinner.hide();
                    if (events.afterCall) events.afterCall();  // Call optional events.afterCall()
                });

                return deferred.promise;

                function resolver(err, data) {
                    if (err)
                        deferred.reject(err);
                    else
                        deferred.resolve(data);
                }
            };

            return descriptor;
        }

    }

    return angular2now;

}();

// Node.js style
if (typeof module !== 'undefined' && module.exports) {
    module.exports = angular2now;
}
// AMD / RequireJS
else if (typeof define !== 'undefined' && define.amd) {
    define('angular2now', [], function () {
        return angular2now;
    });
}
// included directly
else {
    this.angular2now = angular2now;
}
