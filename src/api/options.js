import { common } from './../common';
import { SetModule } from './set-module';

// Allow configuration of some angular2-now default settings
// controllerAs: if provided, will user this string instead of component name, for example "vm"
export function options(options) {
    if (!options) return common.ng2nOptions;

    if (typeof options.controllerAs !== 'undefined') {
        common.controllerAs = options.controllerAs;
    }

    // Optional spinner object can be registered. It must expose show() and hide() methods.
    // The spinner will be activated before any I/O operations and deactivated once they complete.
    common.ng2nOptions.spinner = options.spinner || {show: angular.noop, hide: angular.noop};

    // events expose beforeCall() and afterCall().
    // beforeCall() will be called before any I/O operations.
    // afterCall() will be called after any I/O operations have completed.
    common.ng2nOptions.events = options.events || {beforeCall: angular.noop, afterCall: angular.noop};

    // The noConflict option allows us to control whether or not angular2-now
    // monkey-patches angular.module.
    //  true = don't monkey patch.
    //  false = (default for versions < 0.4.0)  DO monkey patch angular.module
    //          for backwards compatibility
    if (typeof options.noConflict !== 'undefined') {
        if (options.noConflict)
            angular.module = common.angularModule;
        else
            angular.module = SetModule;
    }
}

export function Options(options) {
    return function(target) {
        angular.merge(common.ng2nOptions, options);
        return target;
    }
}
