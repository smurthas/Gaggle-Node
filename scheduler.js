var config = require('config');
var users = require('models/users');
var redis = require('redis');
var client = redis.createClient(config.redis.port, config.redis.host, {});

client.on('ready', function() {
  users.connect(function() {
    scheduleAll();
    setInterval(scheduleAll, config.scheduler.interval);
  });
});



function scheduleAll() {
  users.getByStalest(function(err, cursor) {
    cursor.each(function(err, user) {
      if(!user) return;
      client.lpush(config.redis.key, JSON.stringify(user));
    });
  });
}