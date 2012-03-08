var fakeweb = require('node-fakeweb');
fakeweb.allowNetConnect = false;

fakeweb.registerUri({uri: 'https://api.twitter.com:443/1/statuses/user_timeline.json?screen_name=smurthas&path=%2Fstatuses%2Fuser_timeline.json&include_rts=true&count=200&include_entities=true&page=1',
                     file: __dirname+'/user_timeline/1.json'});
fakeweb.registerUri({uri: 'https://api.twitter.com:443/1/statuses/user_timeline.json?screen_name=smurthas&path=%2Fstatuses%2Fuser_timeline.json&include_rts=true&count=200&include_entities=true&page=2',
                     file: __dirname+'/user_timeline/2.json'});
fakeweb.registerUri({uri: 'https://api.twitter.com:443/1/statuses/user_timeline.json?screen_name=smurthas&path=%2Fstatuses%2Fuser_timeline.json&include_rts=true&count=200&include_entities=true&page=3',
                     file: __dirname+'/user_timeline/3.json'});