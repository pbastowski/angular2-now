// Requests a new scope to be created when the directive is created.
// The other way to do this is to pass "scope: true" to @Component.
export function ScopeNew (target) {
    target.scope = true;
    return target
}
