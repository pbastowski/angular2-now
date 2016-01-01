import { nameSpace } from './../utils';

// 2015-09-01 Replaced the whole Inject function with a new more flexible version.
// Thanks to Steven Weingärtner for his code, which works with both Classes and Methods,
// as well as preserving injectables from a parent class (when extending a parent class).
// New features:
// - Dependencies can be passed in as arguments, not requiring the array wrapper. The
//   original syntax with the array wrapper is still supported.
// - Methods of a class can now be Injected also
// - Child classes will inherit the parent class's injectables, which will be appended
//   to the end of the child's dependencies
export function Inject() {
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
