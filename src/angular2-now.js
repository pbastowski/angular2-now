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

const angular2now = {
    SetModule: SetModule,

    Component:   Component,
    Directive:   Component,
    ScopeShared: ScopeShared,
    ScopeNew:    ScopeNew,
    View:        View,
    Inject:      Inject,
    Controller:  Controller,
    Service:     Service,
    Filter:      Filter,
    Injectable:  Service,
    bootstrap:   bootstrap,
    State:       State,

    options: options,
    Options: Options,

    MeteorMethod: MeteorMethod,

    init: init
};

function init() {
    common.isCordova = typeof cordova !== 'undefined';
    common.angularModule = angular.module;
}

if(typeof Meteor === 'undefined') {
  init();
}

export default angular2now;
