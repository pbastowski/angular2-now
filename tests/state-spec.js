export default (angular2now, ngModuleName) => {
  describe("@State()", () => {
    let target;

    function doState(opts) {
      return angular2now.State(opts)(target);
    }

    beforeEach(() => {
      target = {};
    });

    it("should fail on missing options", () => {
      expect(() => {
        angular2now.State();
      }).toThrowError(Error, /options/);
    });

    it("should fail on missing name option", () => {
      expect(() => {
        angular2now.State({
          foo: 'bar'
        });
      }).toThrowError(Error, /options/);
    });

    it("should fail if argument is not an instance of Object", () => {
      expect(() => {
        angular2now.State("");
      }).toThrowError(Error, /options/);
    });

  });
};
