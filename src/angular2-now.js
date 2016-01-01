import { common } from './common';
import { SetModule } from './api/set-module';
import { Component } from './api/component';
import { ScopeShared } from './api/scope-shared';
import { ScopeNew } from './api/scope-new';
import { View } from './api/view';
import { Inject } from './api/inject';
import { Controller } from './api/controller';
import { Service } from './api/service';
import { Filter } from './api/filter';
import { bootstrap } from './api/bootstrap';
import { State } from './api/state';
import { options, Options } from './api/options';
import { MeteorMethod } from './api/meteor-method';
import { MeteorReactive } from './api/meteor-reactive';
import { LocalInjectables } from './api/local-injectables';

const angular2now = {
    init,

    SetModule,

    Component,
    ScopeShared,
    ScopeNew,
    View,
    Inject,
    Controller,
    Service,
    Filter,
    bootstrap,
    State,

    options,
    Options,

    MeteorMethod,
    MeteorReactive,
    LocalInjectables,

    Directive:   Component,
    Injectable:  Service
};

function init() {
    common.isCordova = typeof cordova !== 'undefined';
    common.angularModule = angular.module;
}

if(typeof Meteor === 'undefined') {
  init();
}

export default angular2now;
