export default (angular2now, ngModuleName) => {
  describe("@View()", () => {
    it("should set templateUrl if argument is a string", () => {
      const target = {};
      const templateUrl = 'test.html';

      angular2now.View(templateUrl)(target);

      expect(target.templateUrl).toBe(templateUrl);
    });

    it("should overwrite target's templateUrl if argument is a string", () => {
      const templateUrl = 'test.html';
      const target = {
        templateUrl: `old-${templateUrl}`
      };

      angular2now.View(templateUrl)(target);

      expect(target.templateUrl).toBe(templateUrl);
    });

    it("should overwrite target's templateUrl if specified in options", () => {
      const templateUrl = 'test.html';
      const target = {
        templateUrl: `old-${templateUrl}`
      };

      angular2now.View({
        templateUrl
      })(target);

      expect(target.templateUrl).toBe(templateUrl);
    });

    it("should set template", () => {
      const template = 'foobar';
      const target = {};

      angular2now.View({
        template
      })(target);

      expect(target.template).toBe(template);
    });

    it("should overwrite target's template", () => {
      const template = 'foobar';
      const target = {
        template: `old-${template}`
      };

      angular2now.View({
        template
      })(target);

      expect(target.template).toBe(template);
    });

    it("should set transclude", () => {
      const transclude = true;
      const target = {};

      angular2now.View({
        transclude
      })(target);

      expect(target.transclude).toBe(transclude);
    });

    it("should overwrite transclude", () => {
      const transclude = true;
      const target = {
        transclude: false
      };

      angular2now.View({
        transclude
      })(target);

      expect(target.transclude).toBe(transclude);
    });

    it("should transclude content directive if available", () => {
      const template = `
      <div>
        <content></content>
      </div>
    `;
      const target = {
        template
      };

      angular2now.View()(target);

      expect(target.template).toContain('ng-transclude');
    });

    it("should set directives", () => {
      const directives = ['directive'];
      const target = {};

      angular2now.View({
        directives
      })(target);

      expect(target.directives).toBe(directives);
    });

    it("should overwrite directives", () => {
      const directives = ['directive'];
      const target = {
        directives: _.map(directives, (d) => `old-${d}`)
      };

      angular2now.View({
        directives
      })(target);

      expect(target.directives).toBe(directives);
    });
  });
};
