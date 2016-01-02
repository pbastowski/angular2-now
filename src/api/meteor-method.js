import { common } from './../common';

// The name of the Meteor.method is the same as the name of class method.
export function MeteorMethod(_options) {
  const options = angular.merge({}, common.ng2nOptions, _options);
  let spinner = options.spinner || {
    show: angular.noop,
    hide: angular.noop
  };
  const events = options.events || {
    beforeCall: angular.noop,
    afterCall: angular.noop
  };

  return function MeteorMethodTarget(target, name, descriptor) {
    // Create a method that calls the back-end
    descriptor.value = function () {
      const argv = Array.prototype.slice.call(arguments);
      const deferred = common.$q.defer();

      if (typeof spinner === 'string') {
        if (angular.injector(['ng', common.currentModule]).has(options.spinner)) {
          spinner = angular.injector(['ng', common.currentModule]).get(options.spinner);
          options.spinner = spinner;
        } else {
          throw new Error('Spinner "' + spinner + '" does not exist.');
        }
      }

      argv.unshift(name);
      argv.push(resolver);

      if (spinner) {
        spinner.show();
      }

      if (events.beforeCall) {
        events.beforeCall();
      }
      // Call optional events.beforeCall()

      // todo: should call Meteor after resolution of promise returned by beforeCall()
      Meteor.call.apply(this, argv);

      deferred.promise.finally(function () {
        spinner.hide();
        // Call optional events.afterCall()
        if (events.afterCall) {
          events.afterCall();
        }
      });

      return deferred.promise;

      function resolver(err, data) {
        if (err) {
          deferred.reject(err);
        } else {
          deferred.resolve(data);
        }
      }
    };

    return descriptor;
  };
}
