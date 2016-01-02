import { common } from './../common';

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
export function bootstrap(target, config) {
  let bootOnDocument = false;

  if (!target || (target && !target.selector && typeof target === 'function')) {
    target = {
      selector: common.currentModule
    };
    bootOnDocument = true;
  }

  // Allow string shortcut for target.selector. Can be the name of any HTML tag.
  if (typeof target === 'string') {
    target = {
      selector: target
    };
  }

  // Mark this class as a bootstrap component. This allows @State
  // to handle it correctly.
  target.bootstrap = true;

  const bootModule = target.selector || common.currentModule;

  if (bootModule !== common.currentModule)
    angular.module(bootModule);

  if (!config)
    config = {
      strictDi: false
    };

  if (common.isCordova)
    angular.element(document).on("deviceready", onReady);
  else
    angular.element(document).ready(onReady);

  function onReady() {
    let el;

    // Find the component's element
    if (!bootOnDocument) {
      el = document.querySelector(target.selector);
    }
    // Or use document, if user passed no arguments
    else {
      el = document.body;
    }

    angular.bootstrap(el, [bootModule], config);
  }
}
