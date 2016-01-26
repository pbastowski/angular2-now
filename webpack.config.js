require('argv-set-env')();
var webpack = require('./webpack')(process.env.NODE_ENV === 'production' ? 'prod' : 'dist');

module.exports = webpack;
