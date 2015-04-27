'use strict';

angular2 = {
        Component:     Component,
        Template:      Template,
        Inject:        Inject,
        Controller:    Controller,
        Service:       Service,
        bootstrap:     bootstrap,
        'Filter':      Filter,
        SetModuleName: SetModuleName
};

var currentModule = 'app';

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
        if (options.services && options.services instanceof Array)
            target = Inject(options.services)(target);

        // selector is optional, if not specified then the className is used
        options.selector = camelCase(options.selector||'') || target.name+'';
        if (options.selector[0] === '.') {
            var isClass = true;
            options.selector = options.selector.slice(1);
        }

        // Save the unCamelCased selector name, so that bootstrap() can use it
        target.selector = unCamelCase(options.selector);

        // The template can be passed in from the @Template decorator
        options.template = target.template || options.template || undefined;
        options.templateUrl = target.templateUrl || options.templateUrl || undefined;

        // Create the angular directive
        // todo: use module and name-spaced directive naming, perhaps from a config file like Greg suggested
        try {
            angular.module(options.module)
                .directive(options.selector, function () {
                return {
                    restrict:         (options.template+options.templateUrl) ? 'EA' : isClass ? 'C' : 'A',
                    controllerAs:     options.selector,
                    scope:            options['bind'] || {},
                    bindToController: true,
                    template:         options.template,
                    templateUrl:      options.templateUrl,
                    controller:       target,
                    replace:          false,
                    transclude:       /ng-transclude/i.test(options.template) || target.transclude
                };
            });
        } catch (er) {
            throw new Error('Does module "' + options.module + '" exist? You may need to use SetModuleName("youModuleName").');
        }
    };

    function camelCase(s) {
        return s.replace(/-(.)/g, function(a,b) { return b.toUpperCase() })
    }

    function unCamelCase(c) {
        var s = c.replace(/([A-Z])/g, function(a,b) { return '-'+b.toLowerCase() });
        if (s[0] === '-') s = s.slice(1);
        return s;
    }


}

function Inject(deps) {
    deps = deps || [];
    return function(target) {
        if (!target.$inject)
            target.$inject = [];

        angular.forEach(deps, function(v) {
            if (v instanceof Object) v = v.name;
            if (target.$inject.indexOf(v) === -1)
                target.$inject.push(v);
        });

        return target
    }
}



function Template(options) {
    options = options || {};
    if (!options.inline) options.inline = undefined;

    return function (target) {
        target.template = options.inline;
        target.templateUrl = options.url;

            // When a template url is specified in options, then transclude can also be specified
            target.transclude = options.transclude;

        // If template contains the new <content> tag then add ng-transclude to it.
        // This will be picked up in @Component, where ddo.transclude will be set to true.
        // Note: If using options.url, you will have to add ng-transclude yourself to the element you wish to transclude
        // todo: access $templateCache looking for <content> and then add ng-transclude to it, as for an inline template
        var s = (options.inline ||'').match(/\<content[ >]([^\>]+)/i);
        if (s) {
            if (s[1].toLowerCase().indexOf('ng-transclude') === -1)
                target.template = target.template.replace(/\<content/i, '<content ng-transclude');
        }
        return target;
    }
}

function Controller(module) {
    module = module || currentModule || 'app';
    return function (target) {
        target.controllerAs = target.name || '';
        target.bindToController = true;

                //module+target.name.slice(0,1).toUpperCase()+target.name.slice(1),
        angular.module(module)
            .controller(
                module+'.'+target.name,
                target
            );
    }
}

function Service(options) {
    options = options || {};
    if (!options.module) options.module = currentModule || 'app';

    return function(target) {
        angular.module(options.module)
            .service(target.name, target);
            //.factory(target.name, function () { return new target })
    }
}

function Filter(options) {
    options = options || {};
    if (!options.module) options.module = currentModule || 'app';

    return function(target) {

        angular.module(options.module)
            .filter(target.name, function () { return new target } );
    }
}

function bootstrap(target) {
    if (!target) {
        throw new Error("Can't bootstrap Angular without an object");
    }

    SetModuleName(target.name);

    angular.element(document).ready(function() {

        // Find the component's element
        var el = document.querySelector(target.selector);

        angular.bootstrap(el, [target.name]);
    })
}

