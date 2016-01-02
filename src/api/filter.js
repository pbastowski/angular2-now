import { common } from './../common';
import { nameSpace } from './../utils';

export function Filter(options) {
  options = options || {};
  // Allow shorthand notation of just passing the name as a string
  if (typeof options === 'string') {
    options = {
      name: options
    };
  }

  return function FilterTarget(target) {
    filterFunc.$inject = target.$inject;

    angular.module(common.currentModule)
      .filter(nameSpace(options.name), filterFunc);

    function filterFunc() {
      const args = Array.prototype.slice.call(arguments);
      const f = new(Function.prototype.bind.apply(target, [null].concat(args)));

      return f;
    }

    return target;
  };
}
