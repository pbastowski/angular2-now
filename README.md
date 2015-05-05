## Angular 2.0 component syntax using Angular 1.x and Babel

This library and Meteor package will allow you to continue using Angular 1.3 or higher, while giving you the opportunity to start coding your directives (components) using Angular 2 @Component syntax. You get to keep your investment in Angular 1.x while preparing for Angular 2.  

If either of the statements below applies to you, then you need angular2-now:

- You are about to start a new development in Angular 1.x and are thinking about migrating to Angular 2, when if finally arrives.

- You just like the Angular 2 component annotations for creating directives, but don't care much for the rest of Angular 2 at this stage.

You are welcome to contribute to this project.

### Can I use this outside of Meteor?
Sure. The example code is for Meteor, however, you can just as easily use this library in any other workflow that can run Babel. All the work is done by the ES6 decorator functions in angular2-now.es6.js. Just include that library in your code and expose/import them where you want to use the @ decorators.

### Installation

    meteor add pbastowski:angular2-now
    
You will also need the packages below:

    meteor add pbastowski:angular-babel
    meteor add urigo:angular
    
### What's implemented?

The following decorators have been implemented to support the Angular 2.0 component syntax, as far as possible.

- **@Component** `({ selector: 'tag-name', bind: { a: '=', etc: '@' }, injectables: ['$http', myServiceClass], ?module: 'angularModuleName', ?name: 'bootstrapComponentName' })`
- **@View** `({ template: '<div>Inline template</div>', templateUrl: 'pth/to/template.html'})`
- **@Inject** `(['$http', myServiceClass, '$q'])`
- **bootstrap** `(app [, config ])` 

The decorators below are not Angular 2, as I haven't seen what Angular 2 services will actually look like yet. But, they are nice. 

- **@Service** `({ name: 'serviceName', ?module: 'angularModuleName' })`
- **@Filter** `({ name: 'filterName', ?module: 'angularModuleName' })`

### SetModuleName *(deprecated in 0.1.0)*

Just use `angular.module('app', ...)` instead. I have monkey patched angular.module, so, SetModuleName is no longer required. This also resolves an issue with ng-annotate. For the rest of this section, assume that `angular.module` can be used in place of `SetModuleName`.

- **SetModuleName** `( 'app', ['angular-meteor', 'my-other-module'])`

This function allows us to set the Angular 1 module name in which the directives, services and filters will be created by the decorator functions. The optional second parameter can be used to specify which other modules this module depends on. It is equivalent to `angular.module( 'app', ['angular-meteor', 'my-other-module'] )`.   

The module does not have to exist already. If it does not exist then it will be created. After this function call, all decorators will use this module name as the Angular 1.x module to create components, services and filters in. 

### Bootstrapping the app
- `bootstrap (app [, config ])` 

This allows you to bootstrap your Angular 1 app using the Angular 2 component bootstrap syntax. So, there is no need to use `ng-app`. Using `bootstrap` is the equivalend of the Angular 1 manual bootstrapping method: `angular.bootstrap(DOMelement, ['app'])`. The bootstrap function also knows how to handle Meteor.isCordova apps.
`config` is the same parameter as in angular.bootstrap: https://code.angularjs.org/1.3.15/docs/api/ng/function/angular.bootstrap. It can be used to enforce strictDi, for testing before deployment. 

Somewhere in your HTML add this:
```html
<my-app>Optional content inside my app that can be transcluded</my-app>
```
And in your JavaScript add the code below. Note that your app-class-name must be the same as the app name you used with SetModuleName. Thus, `SetModuleName('app')` must have a corresponding `class app {}` and `bootstrap(app)`.  

```javascript
SetModuleName('app');

@Component({selector: 'my-app'})
@View({template: `<content></content>`})
class app { 
}

bootstrap(app);
```

A bootstrap component can optionally specify the component name, which is the module name that will be used to bootstrap that Angular app. So, if the bootstrap module name is 'socially', then the example above would look like this:

    @Component({ selector: 'my-app', name: 'socially' })
    
If you don't specify a component name then bootstrap will use the current module name, as set with `SetModuleName()`.

### ControllerAs
The created components use ControllerAs syntax. So, when referring to properties or functions on the controller's "scope", make sure to prefix them with this in the controller and with the className, or the camel-cased selector name if different from the className, in the HTML templates.
  
### Transclude and `<content></content>`
If your inline template includes a `<content>` tag then `@View` will automatically add `ng-transclude` to it and the directive's transclude flag will be set to true.

Templates specified using the url property aren't currently checked and thus do not get `ng-transclude` added to them by `@View`. You will have to manually add ng-transclude to the element you want to transclude in your non-inline templates.

### Importing the required "@" decorators from the package

This package exports angular2, from which you can import the decorators that you need, like so:

```javascript
// Import the Angular2 decorators using ES6 destructuring assignment
// Look up ES6 destructuring here: https://babeljs.io/docs/learn-es6/ 
var {Component, Template, Service, Filter, Inject, SetModuleName, bootstrap} = angular2;
```

or like this:

```javascript
// You can also do it like this
 var Component = angular2.Component;
 var Template = angular2.Template;
 ...
```

I like the first syntax, because it looks a bit like the ES6 module import syntax. 

### What environment is required?
- Angular 1.3+
- Babel 5.1.10+ (lower versions process decorators in the wrong order)
- Meteor 1.1.0.2

#### Browsers
- IE9+
- Chrome
- FireFox

### Examples

```javascript

// "Import" the angular2-now decorators and functions into local scope
var {Component, Template, Service, Filter, Inject, bootstrap} = angular2;

// Use angular.module() to create the 'my-components' module for our components/directives.
// All components created with @Component, @Filter and @Service will automatically
// go into this module.
angular.module('my-components', []);

// The filter name is 'ucase'. You can use this like so: "'string' | ucase"
@Filter({ name: 'ucase' })
class filter1 {
    constructor (prefix) {
        return function(input) {
            return (input + '').toUpperCase();
        }
    }
}

// The name of the service that you can inject is 'service1'
@Service({ name: 'service1' })
class myService {
    // this service has no methods
    hello = 'this is'
    world = 'a test'
}

@Service({ name: 'service2' })
class otherService {
    hello = 'hello'
    world = 'world'
    test() {
        // this is a method in our service
        return this.hello + ' ' + this.world;
    }
}

/**
 * file-change (directive) - attribute only
 *
 * The ng-change directive in conjunction with ng-model does not support input[type=file]. 
 * file-change does.
 *
 * Usage: <input type="file" file-change="upload($event)">
 */
@Component({
    // The name of the directive will be the camelCased version of the selector name.
    selector: 'file-change',
    
    // bind is the same as scope was in Angular 1.x
    // Plus, all components always use private scope.
    bind: { fileChange: '&' }
})
class fileChange {
    constructor ($element, $scope) {
        // Arrow functions, you either love them or hate them.
        // I'm still deciding, cause, they're so ugly.
        $element.on('change', (evt) => {
            if (this.fileChange && this.fileChange !== '') {
                $scope.$apply(() => {
                    this.fileChange({'$event': evt});
                })
            }
        })
    }
}


// Here is a component with a template. All this one does is display some text.
// Clicking on the text toggles its color to yellow and back.
// Do note the use of @Inject().
@Component({ selector: 'upload-images' })
@View({ template: '<p><b>Uploaded Images</b></p>' })
@Inject(['$scope', '$element'])
class uploadedImages {

    constructor ($scope, $element) {
        $element.on('click', toggle);
        $element.css('cursor', 'pointer');

        function toggle() {
            var el = $element.children(0);
            el.css('background-color', el.css('background-color') == 'rgb(255, 255, 0)' ? '' : 'yellow');
        }
    }
}


// Here we use bind to expose attributes a1 (two-way), a2 (value only) and a3 (function) on
// our private scope. 
// Note, also, the use of templateUrl to define the template.
@Component({
    selector: 'booger',
    bind : {
        a1: '=',
        a2: '@',
        a3: '&'
    }
})
@View({
    // templateUrl works the same as in Angular 1.x directives.
    templateUrl: 'client/booger.html'
})
@Inject(['$element'])
class booger {
    // constructor() is the controller. There is no link function at all. At least not at this moment. 
    constructor($element) {
        $element.css({'cursor': 'pointer', '-webkit-user-select': 'none'});
        $element.on('click', function () {
            if ($element.children(0)[0].style.background !=='yellow')
                $element.children(0).css('background', 'yellow');
            else
                $element.children(0).css('background', '');
        });
    }
}

// Let's extend the above class and make a new component. We also use <content> to denote
// where our transcluded content will go. 
// Do note that scope = this. Whatever you put on this in your constructor will appear in the scope.
// To access the scope you must prefix it with the controller name (anotherBooger), because controllerAs was used when defining the directive.
@Component({
    selector: 'another-booger',
    bind: { abc: '=' }
})
@View({
    template:`
        <h2>Another Booger</h2>
        <p>anotherBooger.abc = {{ anotherBooger.abc }}</p>
        <content></content>
    `
})
@Inject(['$element'])
class bigBooger extends booger {
    constructor ($element) {
        // This executes the parent class constructor passing $element to it
        super($element);
        
        // Some local scope variables
        this.a = 1;
        this.b = 2;
    }
}


// Finally, we get ready to bootstrap the app.

// This assumes that the angular-meteor package is used and that your components will be 
// created in an Angular 1.x module called "my-components". 
angular.module('myApp', [
    'angular-meteor',
    'my-components'
]);


// The component "name", below, is optional. If you don't supply a component name
// then the camelCased selector name will be used. If the selector name is not supplied then
// the current module name, as specified with angular.module(), will be used
// to bootstrap the app.
// In your HTML add "<my-app></my-app>" within the body, where you want your app to exist.
// The '<content></content>' template ensures that any content is transcluded.
// *Please note that without a template the constructor will not execute.* 

@Component({ selector: 'my-app', name: 'myApp' })
@View({ template: `<content></content>` })
class myApp {
  constructor() {
    console.log('! myApp constructor');
  }
}


// Bootstrap the app
bootstrap(myApp);

```
