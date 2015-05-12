export declare function Component(options?: {
    name?: string;
    module?: string;
    selector?: string;
    injectables?: Array<string>;
    template?: string;
    templateUrl?: string;
}): (target: any) => void;
export declare function Inject(deps: any): (target: any) => any;
export declare function View(options: any): (target: any) => any;
export declare function Controller(options: any): (target: any) => void;
export declare function Service(options: any): (target: any) => void;
export declare function Filter(options: any): (target: any) => void;
export declare function bootstrap(target: any, config?: any): void;
export declare function State(options: any): (target: any) => void;
