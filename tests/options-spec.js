export default (angular2now, ngModuleName) => {
  describe("Options()", () => {
    let target;

    function doOptions(opts) {
      return angular2now.Options(opts)(target);
    }

    beforeEach(() => {
      target = {};
    });

    it("should merge options", () => {
      const spinner = {
        show: function showSpinner() {},
        hide: function hideSpinner() {}
      };
      const overwriteSpinner = {
        show: function showAnotherSpinner() {}
      };

      // set options
      doOptions({
        spinner
      });
      // expect spinner to be the new one
      expect(angular2now.options().spinner.show).toBe(spinner.show);
      expect(angular2now.options().spinner.hide).toBe(spinner.hide);

      // update options
      doOptions({
        spinner: overwriteSpinner
      });
      // expect to be overwritten
      expect(angular2now.options().spinner.show).not.toBe(spinner.show);
      expect(angular2now.options().spinner.show).toBe(overwriteSpinner.show);
      // expect hide to be kept
      expect(angular2now.options().spinner.hide).toBe(spinner.hide);
    });

    it("should return target", () => {
      const result = doOptions({});

      expect(result).toBe(target);
    });

    it("should be able to monkey-patch angular.module", () => {
      angular2now.options({
        noConflict: true
      });

      expect(angular.module.name).not.toBe(angular2now.SetModule.name);
      expect(angular.module.name).toBe('module');
    });

    it("should be able to not monkey-patch angular.module", () => {
      angular2now.options({
        noConflict: false
      });

      expect(angular.module.name).toBe(angular2now.SetModule.name);
      expect(angular.module.name).not.toBe('module');
    });
  });
};
