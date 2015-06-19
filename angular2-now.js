var angular2now = function () {
    'use strict';

    var angular2now = {
        SetModule: SetModule,

        Component:  Component,
        Directive:  Component,
        View:       View,
        Inject:     Inject,
        Controller: Controller,
        Service:    Service,
        Filter:     Filter,
        Injectable: Service,
        bootstrap:  bootstrap,
        State:      State,

        options: options,
        Options: Options,

        MeteorMethod: MeteorMethod,
        RestCall:     RestCall,
        RestConfig:   RestConfig
    };

    var $q = angular.injector(['ng']).get('$q');

    var currentModule;
    var currentNameSpace;
    var controllerAs;
    var ng2nowOptions = {};

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
    };


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

    function Component(options) {
        options = options || {};
        // Allow shorthand notation of just passing the selector name as a string
        if (typeof options === 'string')
            options = { selector: options }

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

            // The template can be passed in from the @Template decorator
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
                restrict:         (options.template + options.templateUrl) ? 'EA' : isClass ? 'C' : 'A',
                controllerAs:     options.controllerAs || controllerAs || target.controllerAs || options.selector,
                scope:            target.hasOwnProperty('scope') ? target.scope : options.hasOwnProperty('scope') ? options.scope : options['bind'] || {},
                bindToController: target.bindToController || true,
                template:         options.template,
                templateUrl:      options.templateUrl,
                controller:       target,
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
    function serviceExists(serviceName, type) {
        //return !!angular.injector(['ng', currentModule]).has(serviceName);
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
                // Namespace any injectables without an existing nameSpace prefix and also
                // not already prefixed with '$', '@' or '@^'.
                if (dep[0] !== '$' && dep[0] !== '@' && dep.indexOf('_') === -1)
                    dep = nameSpace(dep);

                if (target.$inject.indexOf(dep) === -1)
                    target.$inject.push(dep);
            });

            return target;
        };
    }


    function View(options) {
        options = options || {};
        // Allow shorthand notation of just passing the templateUrl as a string
        if (typeof options === 'string')
            options = { templateUrl: options }

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
        // Allow shorthand notation of just passing the name as a string
        if (typeof options === 'string')
            options = { name: options }

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
            options = { name: options }

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
            options = { name: options }

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
        //if (!target) {
        //    throw new Error("bootstrap: Can't bootstrap Angular without an object");
        //}

        if (!target) {
            target = {selector: currentModule};
            var bootOnDocument = true;
        }

        // Allow string shortcut for target.selector. Can be the name of any HTML tag.
        if (typeof target === 'string') {
            target = {selector: target};
        }

        var bootModule = target.selector || currentModule;

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
            if (!bootOnDocument)
                var el = document.querySelector(target.selector);

            // Or use document, if user passed no arguments
            else
                var el = document;

            angular.bootstrap(el, [bootModule], config);
        }
    }

    /**
     * State can be used to annotate either a Component or a class and assign
     * a ui-router state to it.
     *
     * @param options   literal object
     *      name:           name of the state
     *      url:            url associted with this state
     *      template:       template
     *      templateUrl:    templateUrl
     *      defaultRoute:   truthy = .otherwise(url)
     *                      string = .otherwise(defaultRoute)
     *      resolve:        Literal object, see ui-router resolve
     *      abstract:       true/false
     *      params:         Literal object, see ui-router doco
     *      controller:     A controller is automaticaly assigned, but if you nee
     *                      finer control then you can assign your won controller
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
                        if (userController && userController.$inject && deps.length) {
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

                            // The bootstrap component should always be abstract, otherwise weird stuff happens.

                            abstract: options.abstract,

                            templateUrl: options.templateUrl,

                            // If this is an abstract state then we just provide a <div ui-view> for the children
                            template: options.templateUrl ? undefined : options.template || (options.abstract ? '<div ui-view=""></div>' : target.selector ? '<' + target.selector + '></' + target.selector + '>' : ''),

                            // Do we need to resolve stuff? If so, then we also provide a controller to catch the resolved data.
                            resolve:    resolves,

                            // A user supplied controller OR
                            // A class, if no Component was annotated (thus no selector is available) OR
                            // A proxy controller, if resolves were requested with an annotated Component
                            controller: userController || (doResolve ? controller : undefined),
                            //controller: options.controller || (!target.selector ? target : undefined) || (doResolve ? controller : undefined)

                            // onEnter and onExit events
                            onEnter: options.onEnter,
                            onExit:  options.onExit
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
        if (!options) return ng2nowOptions;

        if (typeof options.controllerAs !== 'undefined') {
            controllerAs = options.controllerAs;
        }

        // Optional spinner object can be registered. It must expose show() and hide() methods.
        // The spinner will be activated before any I/O operations and deactivated once they complete.
        if (typeof options.spinner !== 'undefined') {
            ng2nowOptions.spinner = options.spinner;
        }

        // ioHooks expose beforeCall() and afterCall().
        // beforeCall() will be called before any I/O operations.
        // afterCall() will be called after any I/O operations have completed.
        if (typeof options.ioHooks !== 'undefined') {
            ng2nowOptions.ioHooks= options.ioHooks;
        }

    }

    function Options(options) {
        return function(target) {
            angular.merge(ng2nowOptions, options);
            return target;
        }
    }

    function MeteorMethod(methodName, _options) {
        var options = angular.merge({}, _options, ng2nowOptions);
        var spinner = options.spinner;

        return function (target, name, descriptor) {

            // Create a method that calls the back-end
            target[methodName] = function () {
                var argv = Array.prototype.slice.call(arguments);
                var deferred = $q.defer();

                if (typeof spinner === 'string') {
                    spinner = angular.injector(['ng', currentModule]).get(options.spinner);
                    options.spinner = spinner;
                }

                argv.unshift(methodName);
                argv.push(resolver);

                // Show the spinner
                if (spinner) {
                    spinner.show();
                }

                // Call optional ioHooks.beforeCall()
                if (options.ioHooks && options.ioHooks.beforeCall)
                    options.ioHooks.beforeCall();

                // todo: should call Meteor after resolution of promise returned by beforeCall()
                Meteor.call.apply(this, argv);

                deferred.promise.finally(function() {
                    // Hide the spinner
                    if (spinner) {
                        spinner.hide();
                    }

                    // Call optional ioHooks.afterCall()
                    // If afterCall() returns a promise then finally will be delayed until
                    // that promise resolves.
                    if (options.ioHooks && options.ioHooks.afterCall)
                        return options.ioHooks.afterCall();
                });

                return deferred.promise;

                function resolver(err, data) {
                    if (err)
                        deferred.reject(err);
                    else
                        deferred.resolve(data);
                };
            }

            return target;
        }

    }

    /**
     * ng2nowOptions.restOptions sets global options for rest calls. These can be overridden
     * by using the options argument in the RestCall itself.
     *
     * - showSpinner truthy = show the spinner before the ajax call and hide after
     * - spinner     object = exposes show() and hide() methods
     * - showError   truthy = show the error dialog, falsy = don't show it
     * - ignoreErrors[] array of error/status codes to pass through to the caller
     * - apiPrefix   string = for example '/rest/'
     */
    ng2nowOptions.restOptions = {
        apiPrefix:    '',
        jsonPrefix:   'for(;;);',
        showError:    1,
        showSpinner:  1,
        ignoreErrors: [],
    };

    /**
     * RestConfig annotation sets the base URL and other options for rest api calls.
     *
     * @param options same as restOptions, above, but can be changed per call
     */

    function RestConfig(options) {
        return function (target) {
            angular.merge(ng2nowOptions.restOptions, options);
            return target;
        }
    }

    function RestCall(apiTemplate, method, _options) {
        var options = angular.merge({}, _options, ng2nowOptions.restOptions);
        var spinner = ng2nowOptions.spinner;

        return function (target, name, descriptor) {

            target[name] = function() {
                var api = apiTemplate;
                var REGEX = /\${(\w+)}/g;

                if (typeof spinner === 'string') {
                    spinner = angular.injector(['ng', currentModule]).get(spinner);
                    ng2nowOptions.spinner = spinner;
                    window.sp = spinner;
                }

                var args = Array.prototype.slice.call(arguments);

                // Interpolate any parameters in the apiTemplate
                var apiArgs = apiTemplate.match(REGEX) || [];

                apiArgs.forEach(function(name, index) {
                    api = api.replace(name, args[index]);
                });
                args.splice(0, apiArgs.length);

                // Show the spinner
                if (options.showSpinner && spinner) spinner.show();

                // Call optional ioHooks.beforeCall()
                if (ng2nowOptions.ioHooks && ng2nowOptions.ioHooks.beforeCall)
                    ng2nowOptions.ioHooks.beforeCall();

                // todo: should call Meteor after resolution of promise returned by beforeCall()
                // Call the restService
                var promise = restService(api, method, args[0], options);

                // Do post call tasks
                promise.finally(function() {
                    // Hide the spinner
                    if (options.showSpinner && spinner) spinner.hide();

                    // Call optional ioHooks.afterCall()
                    // If afterCall() returns a promise then finally will be delayed until
                    // that promise resolves.
                    if (ng2nowOptions.ioHooks && ng2nowOptions.ioHooks.afterCall)
                        return ng2nowOptions.ioHooks.afterCall();
                });

                return promise;

            }

            return target;
        }
    }

    function restService(api, method, args, _options) {
        var options = angular.merge({}, ng2nowOptions.restOptions, _options);

        var $http = angular.injector(['ng']).get('$http');
        var $log = angular.injector(['ng']).get('$log');

        if (!checkParameters()) return;

        // Call the REST API
        var pr = $http({
            url:               options.apiPrefix + api,
            data:              args,
            method:            method,
            transformResponse: function (data) {
                return stripJsonVulnerabilityPrefix(data);
            }
        }).then(success, failed);

        return pr;

        function checkParameters() {
            if (!angular.isString(api))
                throw new Error('restService: api parameter empty');

            // UPPER CASE and trim method name, for doing comparisons
            method = (method || '').toUpperCase().trim();

            // Default method is GET.
            if (!method) method = 'GET';

            // Only GET, POST, DELETE, UPDATE and PUT are allowed
            if (!/^(GET|POST|DELETE|UPDATE|PUT)$/.test(method))
                return false;

            // All is good, parameter checks passed.
            return true;
        }

        function success(data) {
            return data.data;
        }

        // global API failure handler
        function failed(data) {
            // Status code 400 is now actually a data validation error, so, no default messages for it any more.
            // Perhaps, one day it may be moved to the success side of the equation and passed in as an error object.
            // see: http://stackoverflow.com/questions/3290182/rest-http-status-codes-for-failed-validation-or-invalid-duplicate
            if (data.status !== 400) {

                var er = 'An unexpected error was encountered. The details are below.\n\n';

                // 404 = not found (ex: API method does not exist)
                if (data.status === 404) er = 'Method ' + api + ' does not exist.\n\n';
                // 403 = forbidden (ex: user already logged in, so, can't log in again)
                if (data.status === 403) er = 'Method ' + api + ' is not allowed in this context.\n\n';
                // 401 = authorization required (ex: logout when logged out already)
                if (data.status === 401) er = 'Method ' + api + ' requires authorization.\n\n';

                // log the error, showing the submitted data and the returned data
                $log.warn('Error: ', method, api, '\n', args, '\n', data.data);

                if (options.showError && !(options.ignoreErrors && options.ignoreErrors.indexOf(data.status) > -1)) {
                    // handle options.ignoreErrors array, if present
                    alert(
                        (options.errorMsg ? options.errorMsg + '\n' : '')
                        + er
                        + 'Status code: ' + data.status + '\n\n'
                        + (data.data ? JSON.stringify(data.data.objectErrors[0].message) : '')
                    );
                }
            }

            // must reject this using a new promise, otherwise it will come in through the success side of the chain
            return $q.reject(data);
            //var deferred = $q.defer();
            //deferred.reject(data);

            //return deferred.promise;
        }

        function stripJsonVulnerabilityPrefix(data) {
            if ('string' === typeof data) {
                // Remove the leading JSON vulnerability prefix
                if (data.indexOf(ng2nowOptions.restOptions.jsonPrefix) > -1)
                    data = angular.fromJson(data.slice(8));
            }
            return data;
        }
    }

    return angular2now;

}();

// Node.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = angular2now;
}
// AMD / RequireJS
else if (typeof define !== 'undefined' && define.amd) {
    define([], function () {
        return angular2now;
    });
}
// included directly
else {
    this.angular2now = angular2now;
}
