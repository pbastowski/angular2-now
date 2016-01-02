import { common } from './common';

// Create a new name from the concatenation of
// the currentNameSpace and the name argument
export function nameSpace(name) {
  return common.currentNameSpace ? common.currentNameSpace + '_' + name : name;
}

export function getService(serviceName, moduleName) {
  return angular.module(moduleName || common.currentModule)
    ._invokeQueue
    .filter((v) => v[0] === '$provide' && v[2][0] === serviceName)[0];
}

// Does a provider with a specific name exist in the current module
export function serviceExists(serviceName) {
  return !!getService(serviceName);
}

export function camelCase(s) {
  return s.replace(/-(.)/g, (a, b) => b.toUpperCase());
}

export function unCamelCase(c) {
  const s = c.replace(/([A-Z])/g, '-$1')
    .replace(/--/g, '-')
    .toLowerCase();

  if (s[0] === '-') {
    return s.slice(1);
  }

  return s;
}
