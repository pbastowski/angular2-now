# angular2-now
## Angular 2.0 component syntax for Angular 1 apps

Angular2-now gives you the ability to start coding your Angular 1.4+ apps using Angular 2 component syntax. You get to keep your investment in Angular 1 while learning some Angular 2 concepts.

So, if you like the clean syntax of Angular 2, but are not yet ready or able to commit to it, then this library might just be what you're looking for.

> **Meteor note**: Meteor package version 1.0.0 of angular2-now works with Meteor 1.2 or higher (repo branch `meteor1.2`). The latest Meteor 1.1 package version is 0.3.15.

## Install

**NPM**

    npm install angular2-now

**BOWER**

    bower install angular2-now

**Meteor**

    meteor add pbastowski:angular2-now

**CDN**

```html
<!-- Meteor 1.2 -->
<script src="https://npmcdn.com/angular2-now@1.0.0/angular2-now.js"></script>

<!-- Meteor 1.1 -->
<script src="https://npmcdn.com/angular2-now@0.3.15/angular2-now.js"></script>
```

## Usage with ES6

Use angular2-now with an **ES6 transpiler** like **Babel** or **TypeScript**. Both work equally well.

Include angular2-now in your AngularJS project, ensuring that it loads before any of it's functions are used. If you're not using any module loaders, then `window.angular2now` gives you direct access to all the annotation functions.

> See the **Examples and Demos** section below for examples.

### With SystemJS

If your app loads SystemJS before angular2-now, then angular2-now will register itself with SystemJS and you will be able to import annotations as shown below.

```javascript
import {Component, View, Inject, bootstrap, Options} from 'angular2now';
```

### With Meteor

With Meteor 1.2 you will be using `angular2-now` in combination with `angular-meteor`, whose package name is simply `angular`. `angular-meteor` automatically includes `pbastowski:angular-babel`, which provides ES6 (ES2015) support. So, there is no need for you to add Babel to your Meteor project explicitly. You can also use TypeScript, if you want, by adding the package `pbastowski:typescript` to your project.

#### Meteor and SystemJS module loader

SystemJS support is provided by adding the package `pbastowski:systemjs` to your project. Make sure to read the [README](https://github.com/pbastowski/angular-meteor-babel/tree/meteor1.2) for `pbastowski:angular-babel` to understand:
- how to enable SystemJS support and
- how `angular-babel` names SystemJS modules in your project

Otherwise, you might have trouble importing from them.

#### Meteor without SystemJS (the old way)

Meteor does not need any kind of module loader, because it bundles and loads your files according to its [convention](http://docs.meteor.com/#/full/fileloadorder). This may be enough for you, if you're happy to use angular2-now through the globally visible `window.angular2now` object.

On the other hand, if you like to use ES6 `import ... from` statements in your project and don't want to use SystemJS, then add the package `pbastowski:require` to your project. It provides basic `module.exports` functionality in the browser and will allow you to export like this

**MyService.js**

```javascript
export class MyService { }

export var things = {
    thing1,
    thing2
}
```

And import like this

**MyComponent.js**

```javascript
import "MyService";

import {thing1} from "things"
```

> When using `pbastowski:require` individual objects are exported by their name. There is no concept of a module, as such. Think of exporting as making the object global. In fact you can also access the exported object through `window.things` or `window.MyService`.

In the above example, when we `import "MyService"` we are actually importing the whole class object, whereas `thing1` is the only object imported from `things`.

## Which Angular 2 annotations can I use in my Angular 1 apps?

The following annotations have been implemented to support Angular 2.0 component syntax. Any parameters preceeded with `?` are optional.

```javascript
SetModule('my-app', ['angular-meteor']);  // Use SetModule in place of angular.module

@Component({
    selector: 'my-app',
    ?bind: { twoWay: '=', value: '@', function: '&' },
    ?services: ['$http', '$q', 'myService'],
    ?replace: true or false,
    ?transclude: true or false,
    ?scope: undefined or true or same as bind
})

@View({
    template: '<div>Inline template</div>',    // inline template
    templateUrl: 'path/to/the_template.html',  // importing a template
    ?transclude: true or false
})

@Inject('$http', '$q'); // Passing injectables directly
                        // Also valid: @Inject(['$http', '$q'])

class App {
    constructor($http, $q) { }
}

bootstrap(App, ?config);  // config is optional
```

The annotations below are not Angular 2, but for me they make coding in Angular a bit nicer.

```javascript
@Service({ name: 'serviceName' })

@Filter({ name: 'filterName' })

@Directive()     // alias for @Component

@ScopeShared()  // same as { scope: undefined } on @Directive

@ScopeNew()     // same as { scope: true } on @Directive
```

Client-side routing with ui-router
```javascript
@State({
    name: 'stateName',
    ?url: '/stateurl',
    ?defaultRoute: true/false or '/default/route/url',
    ?abstract: true or false,
    ?html5Mode: true/false,
    ?params: { id: 123 },  // default params, see ui-router docs
    ?data: { a: 1, b: 2},  // custom data
    ?resolve: {...},
    ?controller: controllerFunction,
    ?template: '<div></div>',
    ?templateUrl: 'client/app/app.html',
    ?templateProvider: function ($stateParams) { return '<h1>' + $stateParams.contactId + '</h1>'; }
}))
```

### Meteor specific annotations

The annotation below will only work with Meteor.

```javascript
@MeteorMethod( ?options )
```

## Examples and Demos

Please visit the following github repositories and Plunker examples before you start coding. It will save you some "WTF" time.

#### ES6 example

[ES6 Angular2-now Plunker](http://plnkr.co/edit/JhHlOr?p=preview)

#### Meteor examples on GitHub

[Thinkster-MEAN-Tutorial-in-angular-meteor](https://github.com/pbastowski/Thinkster-MEAN-Tutorial-in-angular-meteor/tree/feature/ng2-now-with-services)

[meteor-angular-socially](https://github.com/pbastowski/meteor-angular-socially/tree/feature/ng2now)

[todo-ng2now](https://github.com/pbastowski/todo-ng2now)


## API in-depth

### Component vs Directive

`Directive` is an alias for `Component`, which means it does the same thing, but is spelled different. The main difference between directives and components is that directives have no template HTML. A Directive is an attribute on an existing HTML element that simply adds new behaviour to that element. It is one attribute amongst any number of other attributes on an element.

There is an implication to this, in that AngularJS only allows one directive to have isolate scope on the same HTML element. By default, `Component` creates isolate scope and since `Directive` is an alias for `Component` it also creates isolate scope. This sometimes causes issues.

 To overcome that, you can use a couple of annotations:
 - `ScopeShared` same as passing `{ scope: undefined }` to `@Directive`
 - `ScopeNew` same as passing `{ scope: true }` to `@Directive`

 ```javascript
@Directive({ ... })
@ScopeShared()
class MyDirective { }
```

### SetModule instead of angular.module

```javascript
SetModule( 'app', ['angular-meteor', 'ui.router', 'my-other-module'] )
```

You must use `SetModule` at least once in your app, before you use any annotations, to tell angular2-now in which module to create all Components, Services, Filters and State configuration. The syntax is identical to Angular's own [angular.module()](https://docs.angularjs.org/api/ng/function/angular.module). Use `SetModule` in the same places you would normally use `angular.module`.

### ui-router support through @State

This is completely not Angular 2, but I love how easy it makes my routing. You'll have to include ui-router in your app

Meteor:

    meteor add angularui:angular-ui-router

Bower:

    bower install angular-ui-router

And then add the `ui.router` dependency to your bootstrap module, like this

    SetModule('myApp', ['angular-meteor', 'ui.router']);

Then, you can simply annotate your component with the route/state info, like so

```javascript
@State({name: 'defect', url: '/defect', defaultRoute: true})

@Component({selector: 'defect'})
@View({templateUrl: 'client/defect/defect.html'})
@Inject(['lookupTables'])
class Defect {
}
```

#### defaultRoute

```javascript
{ name: 'root',               url: '' }
{ name: 'root.defect',        url: '/defect', defaultRoute: '/defect' }
{ name: 'root.defect.report', url: '/report', defaultRoute: '/defect/report' }
{ name: 'root.defect',        url: '/defect', defaultRoute: true }
```

The `defaultRoute` property makes the annotated state the default for your app. That is, if the user types an unrecognised path into the address bar, or does not type any path other than the url of your app, they will be redirected to the path specified in defaultRoute. It is a bit like the old 404 not found redirect, except that in single page apps there is no 404. There is just the default page (or route).

> Meteor's web server automatically redirects all unrecognised routes to the app root "/". However, if you're not using Meteor, you'll want to make sure that all unrecognised routes are redirected to the app root, which in many cases is "/".

Note that `defaultRoute: true` only works when the state's `url` is the same as it's defaultRoute.

For example

```javascript
{ name: 'root.defect', url: '/defect', defaultRoute: '/defect' }
```

can be replaced with

```javascript
{ name: 'root.defect', url: '/defect', defaultRoute: true }
```

For nested states, where the default state has parent states with their own URLs, always specify the `defaultRoute` as a string that represents the final URL that you want the app to navigate to by default.

#### Resolving Values

A `ui-router` resolve block can be added to the @State annotation, as shown below.

```javascript
@State({
    name: 'defect',
    url: '/defect',
    defaultRoute: true,
    resolve: {
        user: ['$q', function($q) { return 'paul'; }],
        role: function() { return 'admin'; }
    }
})

@Component({ selector: 'defect' })
@View({ tamplateUrl: 'client/defect/defect.html' })
@Inject('defect')

class Defect {
    constructor(defect) {
        // defect.name == 'paul'
        // defect.role == 'admin'
    }
}
```

Adding a @State annotation to a Component does NOT make the component's Class the State's controller and thus you can't directly inject resolved values into it. This is, because the Component's Class is the Component's controller and can not also be reused as the State's controller.

Read on for how to inject the resolved values into your component's controller.

####  Injecting Resolved Dependencies into your component's controller

The resolved values are made available for injection into a component's constructor, as shown in the example above. The injected parameter `defect` is the name of a service automatically created for you, which holds the resolved return values. The name of this service is always the camelCased version of your component's selector. So, if the selector == 'my-app', then the name of the injectable service will be 'myApp'.


#### States without a component

It is also possible to define a state without a component, as shown below, provided that you do not also annotate it's Class as a Component.

```javascript
@State({
    name: 'test',
    url: '/test',
    resolve: {
        user: function() { return 'paul'; },
        role: function() { return 'admin'; }
    }
})
class App {
    constructor(user, role) {
        console.log('myApp resolved: ', user, role);
    }
}
```

In this case, the class constructor is the controller for the route and receives the injected properties directly (as per ui-router documentation).

### Bootstrapping the app

This allows you to bootstrap your Angular 1 app using the Angular 2 component bootstrap syntax. There is no need to use `ng-app`.

```javascript
bootstrap (App [, config ])
```

Using `bootstrap` is the equivalent of the Angular 1 manual bootstrapping method: `angular.bootstrap(DOMelement, ['app'])`. The bootstrap function also knows how to handle Cordova apps.
`config` is the same parameter as in [angular.bootstrap()](https://code.angularjs.org/1.3.15/docs/api/ng/function/angular.bootstrap). It can be used to enforce strictDi, for testing before deployment to production.

#### An example showing how to bootstrap an app

In your HTML body add this:

```html
<my-app>Optional content inside my app that can be transcluded</my-app>
```

And in your JavaScript add the code below.

```javascript
SetModule('my-app', []);

@Component({selector: 'my-app' })
@View({template: `<content></content>`})
class App {
}

bootstrap(App);
```

> The bootstrap module must have the same name as the bootstrap component's selector.

### ControllerAs syntax

The created components use `ControllerAs` syntax. So, when referring to properties or functions on the controller's "scope", make sure to prefix them with `this` in the controller and with the camel-cased selector name in the HTML templates. If the component's selector is `home-page` then your html might look like this:

```html
<div ng-click="homePage.test()"></div>
```

#### Can I use `vm` instead of `homePage`?

Sure. If you want to use `vm` as the controller name for a specific component, then do this:

```javascript
@Component({ selector: 'defect', controllerAs: 'vm' })
class Defect {
    test() {}
}
```

and then in your HTML template you will then be able do this:

```html
<div ng-click="vm.test()"></div>
```

#### I want to use "vm" as the name of all my component's controllers

No problem. Just configure angular2-now to use `vm` instead, like this

```javascript
import {options} from 'angular2now';
options({ controllerAs: 'vm' })
```

Do this before you use any angular2-now components!


### Transclusion

#### Inline templates

If your inline `template` includes `<content></content>` then `@View` will automatically add `ng-transclude` to it and internally the directive's `transclude` flag will be set to `true`.

So, this inline HTML template

```html
h2 This is my header
<content></content>
```

will be automatically changed to look like this

```html
h2 This is my header
<content ng-transclude></content>
```

#### `templateUrl` and transclusion

Templates specified using the `templateUrl` property aren't currently checked and thus do not get `ng-transclude` added to them by `@View`. You will have to manually add ng-transclude to the element you want to transclude in your template. You will also need to add `transclude: true` to the @View annotation's options, as shown below:

```javascript
@View({ templateUrl: '/client/mytemplate.html', transclude: true })
```

### How do I access `ngModel` and other component's controllers?

You `@Inject` the names of the components whose controllers you want. Prefix each controller name with `"@"` or `"@^"` (looks for a parent controller). These dependencies are not directly injected into the constructor (controller), because they are not available at the time the constructor executes, but at `link` time (see AngularJS documentation about this). However, they can be accessed within the constructor like this:

```javascript
@Component({ selector: 'tab' })
@Inject('@ngModel', '@^tabContainer')
class Tab {
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

### angular2-now `options`

Below is the list of angular2-now options that can be changed.

Attribute | Type | Description
----------|------|-------------------
controllerAs | string | Allows you to specify a default controllerAs prefix to use for all components. The default prefix is the camel-cased version of the component's selector.
spinner	| object | Exposes show() and hide() methods, that show and hide a busy-spinner
events	| object | Exposes beforeCall() and afterCall(), which will be called before and after the ajax call. Only `afterCall` is guaranteed to run after the call to the MeteorMethod completes.


Options can be defined or changed like this:

```javascript
import {options} from 'angular2now';

options({
    spinner: {
        show: function () { document.body.style.background = 'yellow'; },
        hide: function () { document.body.style.background = ''; }
    },
    events:  {
        beforeCall: () => console.log('< BEFORE call'),
        afterCall:  () => console.log('> AFTER call'),
    }
})
```

Do this before executing any other angular2-now code.


## Meteor Helper Annotations

### MeteorMethod

```javascript
@MeteorMethod( ?options )
```

The `MeteorMethod` annotation is used to create a client-side method that calls a procedure defined on the Meteor server. The `options` argument is optional. Here is an example.

On the server side you create the Meteor method like this:

```javascript
Meteor.methods({
    sendEmail: function(from, to, subject, body) {
        try {
            Email.send({from: from, to: to, subject: subject, text: body});
        } catch (er) {
            return er;
        }
    }
})
```

On the client side, you annotate a stub method, in this case `sendEmail(){}`, in your `Service` or `Component` class with `@MeteorMethod()`. The name of the stub method must be the same as the name of the Meteor method on the server:

```javascript
class Mail {
   @MeteorMethod()
   sendEmail() { }
}
```

And then you call ` sendEmail() ` somewhere, like this:

```javascript
@Inject('mail')
class MyComponent {
    constructor(mail) {
        mail.sendEmail('me@home.com', 'you@wherever.net', 'hello', 'Hi there!')
            .then( () => console.log('success'), (er) => console.log('Error: ', er) );
    }
}
```

#### The `options` argument

The `options` argument of `MeteorMethod` allows you to override global options on a per-method basis. To find out what global angular2-now options are available please the **angular2-now  Options** section.

When defining a `MeteorMethod`, the options can be overridden like this:

```javascript
@MeteorMethod({ spinner: { ... }, events: { ... })
sendEmail() {}
```

## Breaking changes between 1.0.0 and 0.3.15

- `angular.module` is no longer monkey-patched by angular2-now. You must use `SetModule` instead of `angular.module` for all modules where you wish to use angular2-now. SetModule has the exact same syntax as angular.module. This change was necessary due to problems encountered with the monkey-patching approach under certain conditions.

## What environment is required?
- Angular 1.4+
- Babel 5.1.10+
- Meteor 1.2+

### Browsers
- IE9+
- Chrome
- FireFox
- Safari desktop and mobile (IOS 7 or better)

## I need more Angular 2 features

Then you may want to have a look at [ng-forward](https://github.com/ngUpgraders/ng-forward). It is a very comprehensive library with a lot of Angular 2 features and it is developed by really clever people, whom I had the pleasure to work with :)

### But I really love angular2-now, so, can't you just add more Angular 2 features?

The short answer is no, because I designed `angular2-now` for a specific purpose with narrow requirements:

- make Angular 1 coding simple and fun for myself and my team
- make me think of web apps in terms of components within components, instead of HTML + controllers + directives + ui-router
- make ui-router configuration simple (because it is not)

As it stands now, the above three requirements are satisfied for myself, but if you would like to contribute then I am happy to consider a PR.

## Contributing

If you think you have a great feature that should be incorporated in the main library, or a fix for a bug, or some doco updates then please send me a PR.

When sending code changes or new code make sure to describe in details what it is that you are trying to achieve and what the code does. I am not going to accept pure code without detailed descriptions of what it does and why.
