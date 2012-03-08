var config = require('config');
var crawlers = require('crawlerClient');
var users = require('models/users');

crawlers.init(config.dnode.workers, function() {
  users.connect(function() {
    scheduleAll();
    setInterval(scheduleAll, config.scheduler.interval);
  });
});

function scheduleAll() {
  users.getByStalest(function(err, cursor) {
    cursor.each(function(err, user) {
      if(!user) return;
      if(user.facebook) crawlers.crawl(user, 'facebook')
      if(user.twitter) crawlers.crawl(user, 'twitter')
      if(user.instagram) crawlers.crawl(user, 'instagram')
    });
  });
}