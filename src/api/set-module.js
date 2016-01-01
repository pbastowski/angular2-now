import { common } from './../common';

export function SetModule() {
  /**
   * Name-spacing applies to provider names, not modules. Each module
   * has to have a unique name of it's own.
   *
   * A namespace may be specified like this:
   *     SetModule('ftdesiree:helpers')
   * The namespace, once set, will remain in force until removed.
   * Remove the namespace like this:
   *     angular.module(':helpers')
   **/
  common.currentModule = arguments[0].split(':');

  if (common.currentModule.length === 1) {
    // No namespace, just the module name
    common.currentModule = common.currentModule[0];
  } else {
    // Split off the name-space and module name
    common.currentNameSpace = common.currentModule[0];
    common.currentModule = common.currentModule[1];

    // Reassign arguments[0] without the namespace
    arguments[0] = common.currentModule;
  }

  return common.angularModule.apply(angular, arguments);
}
