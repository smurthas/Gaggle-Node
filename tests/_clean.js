var vows = require('vows');
var assert = require('assert');
var clean = require(__dirname + '/utils/clean');

vows.describe('Mongo').addBatch(clean).export(module);