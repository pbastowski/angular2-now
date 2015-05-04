## Angular 2.0 component syntax using Angular 1.x and Babel with Meteor

I was really curious if I could use the Angular 2 @ Component syntax in Angular 1, by using Babel. Apparently I can, and it is not too difficult either. Ok, so it's not Angular 2, but it looks like it. Anyway, it's a work in progress. So, have a look, play around with it and let me know what you think.

You are also welcome to contribute to this project.

### Can I use this outside of Meteor?
Sure. This example is coded for Meteor, however, you can just as easily use this library in any other workflow that can run Babel. All the work is done by the ES6 decorator functions in angular2-now.js. Just include that library in your code and expose/import them where you want to use them as decorators.

### Installation

    meteor add pbastowski:angular2-now
    
You will also need the packages below:

    meteor add pbastowski:angular-babel
    meteor add urigo:angular
    
### What's implemented?

The following decorators have been implemented to partially support the Angular 2.0 directive syntax.

- `@Component ({ selector: 'tag-name', bind: { a: '=', etc: '@' }, injectables: ['$http', myServiceClass], (opt)module: 'angularModuleName' })`
- `@View ({ template: '<div>Inline template</div>', templateUrl: 'pth/to/template.html'})`
- `@Inject (['$http', myServiceClass, '$q'])`
- `@Service ({ (opt) module: 'angular1ModuleName' })`
- `@Filter ({ (opt) module: 'angular1ModuleName' })`

### SetModuleName

- `SetModuleName ( 'app', ['angular-meteor', 'my-other-module'])`

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
var {Component, Template, Service, Filter, Inject, SetModuleName} = angular2;

// This assumes angular-meteor is used and that your components will be in 
// and Angular 1.x module called "my-components" 
// In your HTML add an ng-app on a div within the body.
angular.module('app', [
    'angular-meteor',
    'my-components'
]);

// If we don't call SetModuleName then "app" will be assumed by default.
SetModuleName('my-components');

// The filter name is the same as the class name.
@Filter()
class keys {
    constructor ($log) {
        return ((input, logIt) => { logIt && $log.debug(input); return Object.keys(input);})
    }
}

@Filter()
class fil1 {
    prefix = 'filter '
    constructor (prefix) {
        if (prefix) this.prefix = prefix;
        else prefix = this.prefix;

        return function(input) {
            return prefix + (input + '').toUpperCase();
        }
    }
}

@Filter()
class fil2 extends fil1 {
    constructor () {
        return super('other ');
    }
}

// service name is the same as the classname, in this case "service1"
@Service()
class service1 {
    // this service has no methods
    hello = 'this is'
    world = 'a test'
}

@Service()
class service2 {
    hello = 'hello'
    world = 'world'
    test() {
        // this is a method in our service
        return this.hello + ' ' + this.world;
    }
}

// Well, this is not Angular2, but it is fun to use classes, is it not?
@Controller()
@Inject(['$scope', '$log', 'FileUpload'])
class appController {
    constructor($scope, $log, FileUpload) {

        $scope.upload = FileUpload.uploadImg;
        $scope.url = FileUpload.url;
        $scope.images = FileUpload.images;
        this.test = 'testing 123...';

        $scope.takePhoto = takePhoto;

        function takePhoto() {
            MeteorCamera.getPicture(callback);

            function callback(error, data) {
                if (error)
                    return $log.error('camera returned an error: ', error);

                FileUpload.uploadImg(data);
            }
        }

    }
}



/**
 * file-change (directive) - attribute only
 *
 * The ng-change directive in conjunction with ng-model does not support input[type=file]. file-change does.
 *
 * Usage: <input type="file" file-change="upload($event)">
 */
@Component({
    // The name of the directive is a camelCased selector name
    // If a selector is not supplied then directive name will be the same className.
    selector: 'file-change',
    
    // bind is the same as scope was in Angular 1.x
    // Plus, all components always use private scope.
    bind: { fileChange: '&' }
})
class fileChange {
    constructor ($element, $scope) {
        $element.on('change', (evt) => {
            if (this.fileChange && this.fileChange !== '') {
                $scope.$apply(() => {
                    this.fileChange({'$event': evt});
                })
            }
        })
    }
}


// selector is assumed to be "upload-images"
@Component()
@View({ template:'<p><b>Uploaded Images</b></p>'})
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

@Component({
    bind : {
        a1: '=',
        a2: '@',
        a3: '&'
    }
})
@View({
    // Using a url to specify the template location. This is the equivalent of
    // templateUrl in Angular 1.x.
    templateUrl: 'client/booger.html'
})
@Inject(['$element'])
class booger {
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


@Component({
    selector: 'another-booger',
    bind: { abc: '=' }
})
@View({
    template:`
        <h2>Another Booger</h2>
        <p>@template takes precedence over @Component: {{ anotherBooger.abc }}</p>
        <content></content>
    `,
    templateUrl: undefined
})
@Inject(['$element'])
class bigBooger extends booger {
    constructor ($element) {
        super($element);
        this.a = 1;
        this.b = 2;
        console.log('- controller 321');
    }
}


@Component({
    selector: 'my-special',
    bind: { xxx: '=' }
})
@View({
    template: `
        <h2>my-special</h2>
        <pre>Name is {{paulSpecial.xxx}}</pre>
        <content></content>
    `
})
@Inject(['$element'])
class proto {
    constructor ($element) {
        this.xxx = 'Hello World 2';

        if ($element) {
            $element.css({cursor: 'pointer', 'user-select': 'none'});
            $element.on('click', () => { console.log('click!' + $element[0].tagName) });
        }
    }
}


@Component({
    selector: 'my-special2',
    bind: { yyy: '@' },
    injectables: [ 'service1', service2 ]
})
@View({
    template: `
        <h2>my-special 2</h2>
        <pre>Name is {{paulSpecial2.yyy}}</pre>
        <content></content>
    `
})
class fancyProto extends proto {
    constructor ($element, service1, service2) {
        // The super() call below will inherit the click event handler from the parent
        super($element);
        console.log('fancyProto: services: ', service1, service2, service2.test());
    }
}

```
