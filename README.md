## Angular 2.0 component syntax using Angular 1.x and Babel.

The following decorators have been implemented to partially support the Angular 2.0 directive syntax.

- @Component ({ selector: 'tag-name', bind: { a: '=', etc: '@' }, services: ['$http', myServiceClass], (opt)module: 'angularModuleName' })
- @Template ({ inline: '<div>Inline template</div>', url: 'pth/to/template.html'})
- @Inject (['$http', myServiceClass, '$q'])
- @Service ({ (opt) module: 'angular1ModuleName' })
- @Filter ({ (opt) module: 'angular1ModuleName' })

This is not part of Angular 2 spec:
- @Controller

This is not implemented
- @Bootstrap

And a helper that allows us to se the Angular 1 module name in which to create the directives.

- SetModuleName( 'angular1ModuleName' )
The module does not have to exist first. If it does not exist then it will be created.

### ControllerAs
The created components use ControllerAs syntax. So, when referring to properties or functions on the controller's "scope", make sure to prefix them with this in the controller and with the className, or the camel-cased selector name if different from the className, in the HTML templates.
  
### Transclude and <content></content>
@Template will automatically add "ng-transclude" the the <component> tag, if it finds one in your inline template. Also, the directive's transclude flag is set to true for all cases, whether or not they have a transcluded element or not. It does not seem to hurt anything and makes the code a bit simpler.

Templates specified using the url property aren't currently checked and thus do not have "ng-transclude" added to them. You will have to manually add ng-transclude to the element you want to transclude in your template.