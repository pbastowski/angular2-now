this.angular2now = angular2now = angular2 = function () {

    'use strict';

    var angular2now = {
        Component:     Component,
        Directive:     Component,
        View:          View,
        Inject:        Inject,
        Controller:    Controller,
        Service:       Service,
        'Filter':      Filter,
        Injectable:    Service,
        bootstrap:     bootstrap,
        State:         State
    };

    var currentModule;
    var currentNameSpace;

    var angularModule = angular.module;

    // Monkey patch angular.module
    angular.module = function () {
        // A namespace may be specified like this:
        //     angular.module('ftdesiree:helpers')
        //
        currentModule = arguments[0].split(':');

        if (currentModule.length === 1) {
            // no namespace, just the module name
            currentModule = currentModule[0];
        } else {
            // split off the name-space and module name
            currentNameSpace = currentModule[0];
            currentModule = currentModule[1];

            // reassign arguments[0] without the namespace
            arguments[0] = currentModule;
            //console.log('@angular.module: ns: ', currentNameSpace, arguments[0]);
        }

        return angularModule.apply(angular, arguments);
    };


    function nameSpace(name) {
        var nsName = name;

        if (currentNameSpace) {
            //nsName = camelCase(currentModule) + '.' + name;
            nsName = currentNameSpace + '.' + name;
        }

        return nsName;
    }

    function Component(options) {
        options = options || {};

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
            options.template = target.template || undefined;
            options.templateUrl = target.templateUrl || undefined;

            // Build the require array.
            // Our controller needs the same injections as the component's controller,
            // but with the "@*" injections renamed to "$scope". The link function will pass
            // the "@*" injections directly to the component controller.
            var requiredControllers = [options.selector];
            controller.$inject = target.$inject || [];
            controller.$inject = controller.$inject.map(function(dep) {
                if ( dep[0] === '@' ) {
                    requiredControllers.push('^?'+dep.slice(1));
                    dep = '$scope'
                }
                return dep;
            });

            // Remember the original $inject, as it will be needed in the link function.
            // In the link function we will receive any requested component controllers
            // which we will then inject into the arguments that we will pass to the
            // actual constructor of our component.
            target.$injectDefer = target.$inject || [];

            // Create the angular directive
            var ddo = {
                restrict:         (options.template + options.templateUrl) ? 'EA' : isClass ? 'C' : 'A',
                controllerAs:     target.controllerAs || options.selector,
                scope:            target.scope || options['bind'] || {},
                bindToController: target.bindToController || true,
                template:         options.template,
                templateUrl:      options.templateUrl,
                controller:       target.controller || controller,
                replace:          false,
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

            function controller() {
                var that = this;

                // Convert arguments to a normal JS array
                var args = Array.prototype.slice.call(arguments);

                // Create our controller function from the class.
                // We have to do this, because Babel disallows calling classes and passing this to them.
                var ctl = makeFunction(target);

                // Create a callback that will be execute in the link function when it executes
                // where our controller will be actually instantiated.
                // We need to do this because dependencies on other component controllers are only
                // available in Angular 1 in the link function.
                controller.___$$cb = function(controllers) {

                    // Find all the "@*" injections and replace them (in the args array) with the
                    // actual controller from the passed in controllers array.
                    var controllerIndex = 0;
                    for (var i= 0; i < args.length; i++) {
                        var arg = args[i];
                        if (target.$injectDefer[i][0] === '@') {
                            args[i] = controllers[controllerIndex];
                            controllerIndex++;
                        }
                    }

                    ctl.apply(that, args);
                };
            }

            function link(scope, el, attr, controllers) {
                // Execute the callback, passing all but the first argument (our own controller)
                if (controller.___$$cb) {
                    controller.___$$cb(controllers.slice(1));
                    delete controller.___$$cb;
                }

            }
        };


    }

    // Takes a class and remakes it using Function, so that it's this can be reassigned
    // and so it can be called and arguments passed to it.
    // Classes can not be called directly due to Babel restrictions.
    function makeFunction(target) {
        // convert to string and remove final "}"
        var fnBody = target.toString().slice(0, -1);
        var i = fnBody.indexOf('{');
        fnBody = [fnBody.slice(0,i-1), fnBody.slice(i+1)];

        //console.log('! makeFunction1: ', fnBody);

        // extract function argument names
        var fnArgs = fnBody[0].split('function ')[1].split(/[()]/).slice(1,-1)[0].split(', ');
        //console.log('! makeFunction2: ', fnArgs, fnBody[1]);

        // remove the Babel classCheck... call, which will prevent us from calling this
        if (fnBody[1].indexOf('_classCallCheck') !== -1) {
            fnBody[1] = fnBody[1].slice(fnBody[1].indexOf(';') + 1);
        }

        // Append function body as last arg in fnArgs
        fnArgs.push(fnBody[1]);

        //console.log('! makeFunction3: ', target.selector, fnArgs);

        var f = Function.apply(null, fnArgs);

        return f
    }

    // Does a provider with a specific name exist in the current module
    function serviceExists(serviceName, type) {
        return !!getService(serviceName, currentModule, type);
    }

    function getService(serviceName, moduleName, type) {
        if (!moduleName)
            moduleName = currentModule;

        if (!type)
            type = '$provide';

        return angular.module(moduleName)
                ._invokeQueue
                .find(function(v,i) {
                    return v[0] === type && v[2][0] === serviceName
                });
    }

    function camelCase(s) {
        return s.replace(/-(.)/g, function (a, b) {
            return b.toUpperCase();
        });
    }

    function unCamelCase(c) {
        var s = c.replace(/([A-Z])/g, function (a, b) {
            return '-' + b.toLowerCase();
        });
        if (s[0] === '-') s = s.slice(1);
        return s;
    }

    function Inject(deps) {
        if (typeof deps !== 'undefined' && !(deps instanceof Array)) {
            throw new Error('@Inject: dependencies must be passed as an array.');
        }

        deps = deps || [];

        return function (target) {
            if (!target.$inject)
                target.$inject = [];

            angular.forEach(deps, function (dep) {
                // Namespace any injectables without an existing module prefix and not prefixed with '$'.
                if (dep[0] !== '$' && dep[0] !== '@' && dep.indexOf('.') === -1) dep = nameSpace(dep);

                if (target.$inject.indexOf(dep) === -1)
                    target.$inject.push(dep);
            });

            return target;
        };
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

        return function (target) {
            angular.module(currentModule)
                .controller(nameSpace(options.name), target);

            return target;
        };
    }

    function Service(options) {
        options = options || {};

        return function (target) {
            angular.module(currentModule)
                .service(nameSpace(options.name), target);
            //.factory(options.name, function () { return new target })

            return target;
        };
    }

    function Filter(options) {
        options = options || {};

        return function (target) {

            angular.module(currentModule)
                .filter(nameSpace(options.name), function () {
                    return new target;
                });

            return target;
        };
    }

    function bootstrap(target, config) {
        if (!target || !(target instanceof Object)) {
            throw new Error("bootstrap: Can't bootstrap Angular without an object");
        }

        var bootModule = target.moduleName || target.selector || currentModule;

        if (bootModule !== currentModule)
            angular.module(bootModule);

        if (!config)
            config = {strictDi: false};

        if (!Meteor) var Meteor = {};
        if (Meteor.isCordova)
            angular.element(document).on("deviceready", onReady);
        else
            angular.element(document).ready(onReady);

        function onReady() {
            // Find the component's element
            var el = document.querySelector(target.selector);

            angular.bootstrap(el, [bootModule], config);
        }
    }

    /**
     * @State can be used to annotate either a Component or a class.
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
            throw new Error('@State: Valid options are: name, url, defaultRoute, template, resolve, abstract.');

        return function (target) {

            var deps;
            var resolved = {};
            var resolvedServiceName = nameSpace(camelCase(target.selector || options.name));

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
                            //console.log('SSS state controller: ', target.selector);

                            var args = Array.prototype.slice.call(arguments);

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

    return angular2now;

}();
