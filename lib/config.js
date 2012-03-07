var fs = require('fs');
var argv = require('optimist').argv;

var config;

if(!config) {
  config = JSON.parse(fs.readFileSync(argv.c || __dirname + '/../config.json'));
  module.exports = config;
}