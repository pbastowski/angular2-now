/// <reference path="../angularjs/angular.d.ts" />

declare var bootstrap: typeof angular2now.bootstrap;
declare var SetModule: typeof angular2now.SetModule;

declare module 'angular2now' {
    export var Filter: typeof angular2now.Filter;
    export var State: typeof angular2now.State;
    export var Component: typeof angular2now.Component;
    export var Service: typeof angular2now.Service;
    export var View: typeof angular2now.View;
    export var options: typeof angular2now.options;

    //export var bootstrap: typeof angular2now.bootstrap;
    //export var SetModule: typeof angular2now.SetModule;

    export var Inject: typeof angular2now.Inject;

    export var MeteorMethod: typeof angular2now.MeteorMethod;
}

declare module angular2now {
    // Class decorators.
    export function Component(config: ComponentConfig|string): ClassDecorator;

    export function Service(config: ServiceConfig|string): ClassDecorator;

    export function Filter(config: FilterConfig|string): ClassDecorator;

    export function State(config: StateConfig): ClassDecorator;

    export function View(config: ViewConfig|string): ClassDecorator;

    export function bootstrap(appName: any, dependencies?: string[]);

    export function SetModule(appName: string, dependencies?: string[]);

    export function options(config: options);

    export function Inject(dependencies: string[]);

    export function MeteorMethod(config?: options);

    interface options {
        controllerAs?: string;
        spinner?: any;
        events?: any;
        noConflict?: boolean;
    }

    interface ServiceConfig {
        name: string;
    }

    interface StateConfig {
        name: string;
        url?: string;
        defaultRoute?: boolean|string;
        resolve?: any;
        controller?: ControllerClass;
        template?: any;
        html5Mode?: boolean;
    }

    interface ViewConfig {
        template?: string;
        templateUrl?: string;
    }

    interface ComponentConfig {
        selector: string;
        bind?: Bind;
        injectables?: string[];
        require?: string;
        transclude?: boolean;
    }

    interface Bind {
        [id: string]: any;
    }

    interface FilterConfig {
        name: string;
    }

    interface ControllerClass extends Function {
        template?: string|Function;
        templateUrl?: string|Function;
        link?: Function;
        compile?: any;
    }
}
