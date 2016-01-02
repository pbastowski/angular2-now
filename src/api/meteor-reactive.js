// Turn on an indication to run $reactive(this).attach($scope) for the component's controller.
// Uses with Angular-Meteor: http://angular-meteor.com, v1.3 and up only
export function MeteorReactive(target) {
  target.meteorReactive = true;
  return target;
}
