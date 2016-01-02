// angular2now
import angular2now from './../src/angular2-now';
// specs
import basic from './basic-spec';
import SetModule from './set-module-spec';
import Inject from './inject-spec';
import View from './view-spec';
import Controller from './controller-spec';
import Service from './service-spec';
import Filter from './filter-spec';
import ScopeShared from './scope-shared-spec';
import ScopeNew from './scope-new-spec';
import Directive from './directive-spec';
import Component from './component-spec';
import bootstrap from './bootstrap-spec';
import State from './state-spec';
import MeteorMethod from './meteor-method-spec';
import MeteorReactive from './meteor-reactive-spec';
import LocalInjectables from './local-injectables-spec';
import Options from './options-spec';
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
  Component,
  bootstrap,
  State,
  MeteorMethod,
  MeteorReactive,
  LocalInjectables,
  Options
];
// call each spec
specs.forEach((spec) => {
  spec(angular2now, ngModuleName);
});
