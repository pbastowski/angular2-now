export default (angular2now, ngModuleName) => {
  describe("@Controller()", () => {
    const name = 'TestCtrl';
    const moduleMock = {
      controller: function() {}
    }
    let spy;
    let spyCtrl;

    function Target() {};


    beforeEach(() => {
      // set spies
      spy = spyOn(angular, 'module').and.returnValue(moduleMock);
      spyCtrl = spyOn(moduleMock, 'controller');
    });

    describe("with namespace", () => {
      beforeEach(() => {
        // set ngModuleName as currentModule
        angular2now.SetModule(`ns:${ngModuleName}`);
      });

      it("should set name if argument is a string", () => {
        angular2now.Controller(name)(Target);

        expect(spy).toHaveBeenCalledWith(ngModuleName);
        expect(spyCtrl).toHaveBeenCalledWith(`ns_${name}`, Target);
      });

      it("should set name if argument is an object with name property", () => {
        angular2now.Controller({
          name
        })(Target);

        expect(spy).toHaveBeenCalledWith(ngModuleName);
        expect(spyCtrl).toHaveBeenCalledWith(`ns_${name}`, Target);
      });
    });

    describe("without namespace", () => {
      beforeEach(() => {
        // set ngModuleName as currentModule
        angular2now.SetModule(`:${ngModuleName}`);
      });

      it("should set name if argument is a string", () => {
        angular2now.Controller(name)(Target);

        expect(spy).toHaveBeenCalledWith(ngModuleName);
        expect(spyCtrl).toHaveBeenCalledWith(name, Target);
      });

      it("should set name if argument is an object with name property", () => {
        angular2now.Controller({
          name
        })(Target);

        expect(spy).toHaveBeenCalledWith(ngModuleName);
        expect(spyCtrl).toHaveBeenCalledWith(name, Target);
      });
    });

    it("should return target", () => {
      const result = angular2now.Controller({
        name
      })(Target);

      expect(result).toBe(Target);
    });
  });
};
