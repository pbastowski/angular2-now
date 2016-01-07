# Change Log

All notable changes to this project will be documented in this file. This project adheres to [Semantic Versioning](http://semver.org/).

## [Unreleased]

### Fixed

- *(State)* - templateUrl overwrites template #d97096e (Closes #49)

## [1.1.3] - 2016-01-05

### Added

- `providers` property to @Component as an alias for @Inject. An angular2-now component can now be fully defined with the @Component decorator, just like in Angular2.
- coveralls code coverage badge to readme

### Changed

- For Meteor users, updated Meteor package angular dependency to 1.3.4.

## [1.1.0] - 2016-01-02

We have a new contributor: Kamil Kisiela.

### Added

- **MeteorReactive** support: this version of angular2-now includes the MeteorReactive decorator, which only works with Meteor. See angular-meteor docs for more information on it's usage.  
- Kamil has added some long overdue features to angular2-now:
 - tests
 - coverage reporting (95% currently) and
 - continuous integration through Travis-ci
- Kamil also added a build process that generates both Npm and Meteor bundles

### Changed

- BREAKING CHANGE: Meteor 1.1 version is now deprecated and will not be updated any further, other than to possibly fix very annoying errors.

[Unreleased]: https://github.com/pbastowski/angular2-now/compare/a8e7c2a...HEAD
[1.1.3]: https://github.com/pbastowski/angular2-now/compare/v1.1.0...a8e7c2a
[1.1.0]: https://github.com/pbastowski/angular2-now/compare/689efb3...v1.1.0
