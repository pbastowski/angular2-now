import { common } from './common';

// Create a new name from the concatenation of
// the currentNameSpace and the name argument
export function nameSpace(name) {
    var nsName = name;

    if (common.currentNameSpace) {
        //nsName = camelCase(currentModule) + '.' + name;
        nsName = common.currentNameSpace + '_' + name;
    }

    return nsName;
}

// Does a provider with a specific name exist in the current module
export function serviceExists(serviceName) {
    return !!getService(serviceName);
}

export function getService(serviceName, moduleName) {
    if (!moduleName)
        moduleName = common.currentModule;

    return angular.module(moduleName)
        ._invokeQueue
        .filter(function (v, i) {
            return v[0] === '$provide' && v[2][0] === serviceName
        })[0];
}

export function camelCase(s) {
    return s.replace(/-(.)/g, function (a, b) {
        return b.toUpperCase();
    });
}

export function unCamelCase(c) {
    var s = c.replace(/([A-Z])/g, '-$1')
             .replace(/--/g, '-')
             .toLowerCase();
    if (s[0] === '-') s = s.slice(1);
    return s;
}
