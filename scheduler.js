var config = require('config');
var crawlers = require('crawlerClient');
var users = require('models/users');

crawlers.init(config.dnode.workers, function() {
  scheduleAll();
  setInterval(scheduleAll, 60 * 1000);
});

function scheduleAll() {
  users.getByStalest(function(err, cursor) {
    console.error("DEBUG: err", err);
    console.error("DEBUG: cursor", cursor);
    cursor.each(function(err, user) {
      console.error("DEBUG: user", user);
      if(user.facebook) crawlers.crawl(user, 'facebook')
      if(user.twitter) crawlers.crawl(user, 'twitter')
      if(user.instagram) crawlers.crawl(user, 'instagram')
    });
  });
}