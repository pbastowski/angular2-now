## Angular 2.0 component syntax using Angular 1.x and Babel with Meteor

This is only a "technology preview" and very much a work in progress. I was really curious if I could use the Angular 2 `@` Component syntax in Angular 1, by using Babel. Guess what, it's pretty amazing what can be achieved and not too difficult. Ok, so it's not Angular 2, but I like the syntax and the ability to create new components by extend existing components. Anyway, have a look, play around with it, and if you feel like it then let me know what you think. 

You are also welcome to contribute to this project.
  
### Installation

    meteor add pbastowski:angular2-now
    
You will also need the packages below:

    meteor add pbastowski:angular-babel
    meteor add urigo:angular
    
### What's implemented?

The following decorators have been implemented to partially support the Angular 2.0 directive syntax.

- `@Component` ({ selector: 'tag-name', bind: { a: '=', etc: '@' }, services: ['$http', myServiceClass], (opt)module: 'angularModuleName' })
- `@Template` ({ inline: '`<div>Inline template</div>', url: 'pth/to/template.html`'})
- `@Inject` (['$http', myServiceClass, '$q'])
- `@Service` ({ (opt) module: 'angular1ModuleName' })
- `@Filter` ({ (opt) module: 'angular1ModuleName' })

This is not part of Angular 2 spec. I just wanted to see how to implement it. My advice: don't use it.
- `@Controller`

This is not implemented for the moment.
- `@Bootstrap`

### SetModuleName

Here is a helper function that allows us to set the Angular 1 module name in which to create the directives. Why is it necessary? Because I decided that the default module name for all directives is "app" ... so I can easily play with the code. So, to allow me to use other module names, I can set the module name with:

- `SetModuleName` ( 'angular1ModuleName' )

The module does not have to exist already. If it does not exist then it will be created. After this function call, all decorators will use this module name as the Angular 1.x module to create components in. 

### ControllerAs
The created components use ControllerAs syntax. So, when referring to properties or functions on the controller's "scope", make sure to prefix them with this in the controller and with the className, or the camel-cased selector name if different from the className, in the HTML templates.
  
### Transclude and `<content></content>`
`@Template` will automatically add "ng-transclude" to the `<component>` tag in your inline template. Also, the directive's transclude flag is set to true for all cases, whether or not they have a transcluded element or not. It does not seem to hurt anything and makes the code a bit simpler. Please correct me if I'm wrong.

Templates specified using the url property aren't currently checked and thus do not get "ng-transclude" added to them by `@Template`. You will have to manually add ng-transclude to the element you want to transclude in your non-inline templates.

### Importing the required "@" decorators from the package

This package exports angular2, from which you can import the decorators that you need, like so:

```javascript
// Import the Angular2 decorators using ES6 destructuring assignment
// Look up ES6 destructuring here: https://babeljs.io/docs/learn-es6/ 
var {Component, Template, Service, Filter, Inject, SetModuleName} = angular2;
```

or like so:

```javascript
// You can also do it like this
 var Component = angular2.Component;
 var Template = angular2.Template;
 ...
```

I like the first syntax, because it looks a bit like the import syntax. 

### Examples

```javascript
var {Component, Template, Service, Filter, Inject, SetModuleName} = angular2;

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
@Template({ inline:'<p><b>Uploaded Images</b></p>'})
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
@Template({
    // Using a url to specify the template location. This is the equivalent of
    // templateUrl in Angular 1.x.
    url: 'client/booger.html'
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
@Template({
    inline:`
        <h2>Another Booger</h2>
        <p>@template takes precedence over @Component: {{ anotherBooger.abc }}</p>
        <content></content>
    `,
    url: undefined
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
@Template({
    inline: `
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
    services: [ 'service1', service2 ]
})
@Template({
    inline: `
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