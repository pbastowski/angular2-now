export function View(options) {
  options = options || {};
  // Allow shorthand notation of just passing the templateUrl as a string
  if (typeof options === 'string')
    options = {
      templateUrl: options
    };

  //if (!options.template) options.template = undefined;

  return function(target) {
    target.template = options.template || target.template;
    target.templateUrl = options.templateUrl || target.templateUrl;

    // When a templateUrl is specified in options, then transclude can also be specified
    target.transclude = options.transclude || target.transclude;

    // directives is an array of child directive controllers (Classes)
    target.directives = options.directives || target.directives;

    // Check for the new <content> tag and add ng-transclude to it, if not there.
    if (target.template)
      target.template = transcludeContent(target.template);

    return target;
  };

  // If template contains the new <content> tag then add ng-transclude to it.
  // This will be picked up in @Component, where ddo.transclude will be set to true.
  function transcludeContent(template) {
    const s = (template || '').match(/\<content[ >]([^\>]+)/i);

    if (s && s[1].toLowerCase().indexOf('ng-transclude') === -1) {
      template = template.replace(/\<content/i, '<content ng-transclude');
    }
    
    return template;
  }
}
