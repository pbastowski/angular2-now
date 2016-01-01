export const common = {
  angularModule: undefined,
  currentModule: undefined,
  currentNameSpace: undefined,
  isCordova: false,
  ng2nOptions: {
    currentModule() {
      return common.currentModule;
    }
  },
  controllerAs: undefined,
  $q: angular.injector(['ng']).get('$q')
};
