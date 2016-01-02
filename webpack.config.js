require('argv-set-env')();
var webpack = require('./webpack/config')[process.env.NODE_ENV === 'development' ? 'dist' : 'prod'];

module.exports = webpack;
