## Angular 2.0 component syntax using Angular 1.x and Babel

This library allows you to continue using Angular 1.3 or higher, while giving you the opportunity to start coding your Angular 1.x applicantions in Angular 2 syntax. You get to keep your investment in Angular 1.x while preparing for Angular 2.  

If either of the statements below applies to you, then you need angular2-now:

- You are about to start a new development in Angular 1.x and are thinking about migrating to Angular 2, when it finally arrives.

- You just like the clean syntax of Angular 2, but don't care much for the rest of Angular 2 at this stage.

You are welcome to contribute to this project.

### Can I use this outside of Meteor?

Yes, you can. The angular2-now.js library works with both ES6 (Babel) and plain ES5. ES6 examples are in this README and for an ES5 usage demo see [Plunker](http://plnkr.co/edit/uxV781?p=preview).

Install it like this

    bower install angular2-now

To use this library, include it in your Angular 1.3 (or higher) project, ensuring that it loads before it's functions are used. `window.angular2now` gives you access to all the decorator functions. You can import the functions you need into each module that requires them, like this:

Babel/ES6

    var {Component, View, Inject} = angular2now;

ES5

    var Component = angular2now.Component;
    var View = angular2now.View;
    var Inject = angular2now.Inject;

Or, if you want all the angular2-now decorator functions available for use anywhere in your application without explicitly importing them, then you could try this

    angular.extend(window, angular2now)

Please note that to use the Angular 2 `@` notation, as shown in the examples below, such as `@Component` or `@View`, you will need to have a build workflow that uses Babel to transpile your ES6 code to plain ES5 JavaScript that your browser can understand. 


### Meteor Installation

    meteor add pbastowski:angular2-now
    

### What's implemented?

The following decorators have been implemented to support the Angular 2.0 component syntax, as far as possible.

- **@Component** `({ selector: 'tag-name', bind: { a: '=', etc: '@' }, injectables: ['$http', myServiceClass], ?module: 'angularModuleName', ?name: 'bootstrapComponentName' })`
- **@View** `({ template: '<div>Inline template</div>', templateUrl: 'pth/to/template.html'})`
- **@Inject** `(['$http', myServiceClass, '$q'])`
- **bootstrap** `(app [, config ])` 

The decorators below are not Angular 2, as such, but for me they make coding in Angular a bit nicer. 

- **@Service** `({ name: 'serviceName', ?module: 'angularModuleName' })`
- **@Filter** `({ name: 'filterName', ?module: 'angularModuleName' })`
- **@State** `({name: 'stateName', ?url: '/stateurl', ?defaultRoute: true/false, ?resolve: {...}, ?controller: controllerFunction, ?template: { }, ?html5Mode: true/false }))`


### Using angular.module 

- **angular.module** `( 'app', ['angular-meteor', 'my-other-module'] )`

This allows us to set the Angular 1 module name in which Components, Services, Filters and State configuration will be created by the @decorator functions. The syntax is identical to Angular's own `angular.module`, see: https://docs.angularjs.org/api/ng/function/angular.module.
 
 
#### How does it work? 
angular.module() has been monkey-patched to remember the module name and then call the original angular.module function (and return its return value). 


### Name-spacing your app's providers

Creating a namespace for your Angular 1 providers is simple. Just change your use of angular.module from this

    angular.module('moduleName')

to this
 
    angular.module('nameSpace:moduleName')

The `nameSpace` portion will be used to automatically prefix all provider names within your application. For example

    
    angular.module('webshop:helpers');
    
    @Service({ name: "myService" })   // will create a service called "webshop_myService"
    
    @Inject(['myService'])  // the "webshop_" a prefix will be added automatically by the annotation

    @Inject(['$anyThing', '@otherComponent', 'booking_getDate'])  // these will not be prefixed
    

As shown above, angular2-now will also automatically prefix with the current name-space your @Injected dependencies that are not already prefixed with another namespace or prefixed with the special characters "$" (Angular's global services) and "@" (component controller injections, such as ngModel).

> Caveat: You can't use the underscore "_" character in naming your providers. This is because angular2-now uses the "_" character to separate the namespace from the provider name. If you need to use "_" in your provider names then don't use the name-spacing feature of angular2-now. 


**Why bother with name-spacing?**

Within a bootstrapped Angular 1 app, all module and provider names created must be unique. This is usually not a problem when you're the only one working on your app. 

In a larger company, however, it is common for two or more teams to be working on different parts of the same overall app. Often on different projects. They may be creating different parts of the company homepage, such as booking or webshop. Booking could have a provider called "getData" and webshop could have its own provider named "getData". Within an Angular 1 app this would create a clash, even if these providers were created in different modules. 

To prevent the clash a naming convention is used, which clearly separates the provider names in two different teams. For example, booking could name their "getData" provider "booking_getData" and webshop could call their's "webshop_getData". In this way, all providers within the same Angular 1 bootstrapped app will be unique.
   

### ui-router support through @State

This is completely not Angular 2, but I love how easy it makes my routing.

You'll have to include ui-router in your app

Meteor:

    meteor add angularui:angular-ui-router
    
Bower:

    bower install angular-ui-router

And then add the `ui.router` dependency to your bootstrap module, like this
  
    angular.module('myApp', ['angular-meteor', 'ui.router']);

Then, you can simply annotate your component with the route/state info, like so 

```javascript
@State({name: 'defect', url: '/defect', defaultRoute: true})

@Component({selector: 'defect'})
@View({templateUrl: 'client/defect/defect.html'})
@Inject(['lookupTables'])
class defect { 
}
```

#### Resolving and injecting dependencies 

To add a `ui-router` resolve block, add in to the @State annotation as shown below.

```javascript
@State({
    name: 'defect', 
    url: '/defect', 
    defaultRoute: true,
    resolve: {
        user: function() { return 'paul'; },
        role: function() { return 'admin'; }
    }
})
```

A resolve block can also be added as a `static` property on the class itself, like shown below. Either way produces the same results.

```javascript
@State({ name: 'root', url: '' })
@Inject(['defect'])
class defect {
    constructor(defect) { 
        // defect.name == 'paul'
        // defect.role == 'admin'
    }
    static resolve = {
        user: function() { return 'paul'; },
        role: function() { return 'admin'; }
    }
}
```

The resolved values are made available for injection into a component's constructor, as shown above. The injected parameter `defect` is the name of a service created for you that holds the resolved return values. The name of this service is always the camelCased version of your component's selector. So, if the selector == 'my-app', then the name of the injectable service will be 'myApp'. 

#### States without a component
    
It is also possible to define a state without a component, as in

```javascript
@State({ 
    name: 'test', 
    url: '/test', 
    resolve: { 
        user: function() { return 'paul'; },
        role: function() { return 'admin'; } 
    } 
})
class myApp {
    constructor(user, role) {
        console.log('myApp resolved: ', user, role);
    }
}
```

In this case, the class itself is the controller for the route and receives the injected properties directly.  


### Bootstrapping the app
- `bootstrap (app [, config ])` 

This allows you to bootstrap your Angular 1 app using the Angular 2 component bootstrap syntax. So, there is no need to use `ng-app`. Using `bootstrap` is the equivalend of the Angular 1 manual bootstrapping method: `angular.bootstrap(DOMelement, ['app'])`. The bootstrap function also knows how to handle Meteor.isCordova apps.
`config` is the same parameter as in angular.bootstrap: https://code.angularjs.org/1.3.15/docs/api/ng/function/angular.bootstrap. It can be used to enforce strictDi, for testing before deployment. 

Somewhere in your HTML add this:
```html
<my-app>Optional content inside my app that can be transcluded</my-app>
```
And in your JavaScript add the code below.  

```javascript
angular.module('app', []);

@Component({selector: 'my-app', name: 'app' })
@View({template: `<content></content>`})
class app { 
}

bootstrap(app);
```

A bootstrap component can optionally specify the component name, which is the module name that will be used to bootstrap that Angular app. So, if the bootstrap module name was 'socially', then the example above would look like this:

    @Component({ selector: 'my-app', name: 'socially' })

And you would also need to create the module named "socially".

If you don't specify a module "name" in the @Component annotation, then bootstrap() will use the selector name as the name for your bootstrap module. 


### ControllerAs
The created components use ControllerAs syntax. So, when referring to properties or functions on the controller's "scope", make sure to prefix them with this in the controller and with the className, or the camel-cased selector name if different from the className, in the HTML templates.
  
### Transclude and `<content></content>`
If your inline template includes a `<content>` tag then `@View` will automatically add `ng-transclude` to it and the directive's transclude flag will be set to true.

Templates specified using the templateUrl property aren't currently checked and thus do not get `ng-transclude` added to them by `@View`. You will have to manually add ng-transclude to the element you want to transclude in your non-inline templates and also add `transclude: true` to the @View annotation's options, as shown below:

    @View({ templateUrl: '/client/mytemplate.html', transclude: true })


### Importing the required "@" decorators from the package

This package exports the object `angular2now` (angular2 deprecated since 0.1.2), from which you can import the decorators that you need, like so:

```javascript
// Import the Angular2now decorators using ES6 destructuring assignment
// Look up ES6 destructuring here: https://babeljs.io/docs/learn-es6/ 
var {Component, Template, Service, Filter, Inject, bootstrap} = angular2now;
```

or like this:

```javascript
// You can also do it like this
 var Component = angular2now.Component;
 var Template = angular2now.Template;
 ...
```

I like the first syntax, because it looks a bit like the ES6 module import syntax. 

### How do I access `ngModel` and other component's controllers?

You `@Inject` the names of the components whose controller you want, prefixed with `"@"` or `"@^"` (looks for a parent controller). Due to the nature of Angular 1 and Babel, these dependencies can not be directly injected into the constructor. However, they can be accessed within the constructor like this: 

```javascript
@Component({ selector: 'my-validator' })
@Inject(['@ngModel', '@^tabContainer'])
class myValidator {
    constructor() {
    
        this.$dependson = function (ngModel, tabContainer) {
            ngModel.$parsers.unshift(function (value) { ... });
            
            // This gives you access to tabContainer's scope methods and properties
            tabContainer.someFunction();
            if (tabContainer.tabCount === 0) { ... }
        }
    }
}
```

Please note that the injected component controllers are not listed as arguments to the constructor.

> Warning: This is a breaking change introduced in 0.1.7. The use of `this.ngModel = function(ngModel) { // do stuff with ngModel }` within the constructor is no longer supported. Please use the syntax shown above.


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
var {Component, Template, Service, Filter, Inject, bootstrap} = angular2now;

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
    consoleLog('! myApp constructor');
  }
}


// Bootstrap the app
bootstrap(myApp);

```
