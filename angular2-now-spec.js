// angular2now
import angular2now from './angular2-now';
// specs
import basic from './tests/basic-spec';
import SetModule from './tests/set-module-spec';
import Inject from './tests/inject-spec';
import View from './tests/view-spec';
import Controller from './tests/controller-spec';
import Service from './tests/service-spec';
import Filter from './tests/filter-spec';
import ScopeShared from './tests/scope-shared-spec';
import ScopeNew from './tests/scope-new-spec';
import Directive from './tests/directive-spec';
import Component from './tests/component-spec';
// main test module name
const ngModuleName = 'test';
// specs in array
const specs = [
  basic,
  SetModule,
  Inject,
  View,
  Controller,
  Service,
  Filter,
  ScopeShared,
  ScopeNew,
  Directive,
  Component
];
// call each spec
specs.forEach((spec) => {
  spec(angular2now, ngModuleName);
});
