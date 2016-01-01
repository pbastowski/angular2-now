import { common } from './../common';
import { nameSpace } from './../utils';

export function Controller(options) {
    options = options || {};
    // Allow shorthand notation of just passing the name as a string
    if (typeof options === 'string')
        options = { name: options };

    return function (target) {
        angular.module(common.currentModule)
            .controller(nameSpace(options.name), target);

        return target;
    };
}
