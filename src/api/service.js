import { common } from './../common';
import { nameSpace } from './../utils';

export function Service(options) {
  options = options || {};
  // Allow shorthand notation of just passing the name as a string
  if (typeof options === 'string')
    options = {
      name: options
    };

  return function(target) {
    angular.module(common.currentModule)
      .service(nameSpace(options.name), target);
    //.factory(options.name, function () { return new target })

    return target;
  };
}
