export default (angular2now, ngModuleName) => {
  describe("@Service()", () => {
    const name = 'TestService';
    const moduleMock = {
      service: function() {}
    }
    let spy;
    let spyService;

    function Target() {};


    beforeEach(() => {
      // set spies
      spy = spyOn(angular, 'module').and.returnValue(moduleMock);
      spyService = spyOn(moduleMock, 'service');
    });

    describe("with namespace", () => {
      beforeEach(() => {
        // set ngModuleName as currentModule
        angular2now.SetModule(`ns:${ngModuleName}`, []);
      });

      it("should set service if argument is a string", () => {
        angular2now.Service(name)(Target);

        expect(spy).toHaveBeenCalledWith(ngModuleName);
        expect(spyService).toHaveBeenCalledWith(`ns_${name}`, Target);
      });

      it("should set service if argument is an object with name property", () => {
        angular2now.Service({
          name
        })(Target);

        expect(spy).toHaveBeenCalledWith(ngModuleName);
        expect(spyService).toHaveBeenCalledWith(`ns_${name}`, Target);
      });
    });

    describe("without namespace", () => {
      beforeEach(() => {
        // set ngModuleName as currentModule
        angular2now.SetModule(`:${ngModuleName}`, []);
      });

      it("should set service if argument is a string", () => {
        angular2now.Service(name)(Target);

        expect(spy).toHaveBeenCalledWith(ngModuleName);
        expect(spyService).toHaveBeenCalledWith(name, Target);
      });

      it("should set service if argument is an object with name property", () => {
        angular2now.Service({
          name
        })(Target);

        expect(spy).toHaveBeenCalledWith(ngModuleName);
        expect(spyService).toHaveBeenCalledWith(name, Target);
      });
    });
  });
};
