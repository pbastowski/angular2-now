// Cancels out the automatic creation of isolate scope for the directive,
// because Angular 1.x allows only one isolate scope directive per element.
// This is useful when actually creating directives, which add behaviour
// to an existing element, as opposed to components which are stand alone
// bits of html and behaviour.
// The other way to do this is to pass "scope: undefined" to @Component.
export function ScopeShared(target) {
  target.scope = undefined;
  return target;
}
