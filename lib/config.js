var fs = require('fs');
var argv = require('optimist').argv;

var config;

if(!config) {
  config = JSON.parse(fs.readFileSync(argv.c || __dirname + '/../config.json'));
  // config.app.url = 'http://' + (config.app.host || 'localhost') + ':' + config.app.port;
  if(!(config.apiKeys && config.apiKeys.twitter)) config.apiKeys = { twitter: {
    consumerKey: process.env.GAGGLE_TWITTER_KEY_ID,
    consumerSecret: process.env.GAGGLE_TWITTER_SECRET
  }}
  if(process.env.RECRAWL === 'true') config.recrawl = true;
  if(process.env.REDIS_TO_GO_PASS) config.redis.pass = process.env.REDIS_TO_GO_PASS;
  if(process.env.MONGODB_PASS) config.mongo.pass = process.env.MONGODB_PASS;
  module.exports = config;
}