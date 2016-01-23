var _ = require('lodash');
var test = require('./test');
var dist = require('./dist');
var prod = require('./prod');
var common = require('./common');

module.exports = {
  test: extend(test),
  dist: extend(dist),
  prod: extend(prod)
};

function extend(cfg) {
  var config = _.merge({}, common, cfg);

  return config;
}
