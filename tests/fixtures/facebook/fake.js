var fakeweb = require('node-fakeweb');
fakeweb.allowNetConnect = false;

fakeweb.registerUri({uri: 'https://graph.facebook.com:443/me/albums?access_token=qwerty&date_format=U',
                     file: __dirname+'/me/albums1.json'});
fakeweb.registerUri({uri: 'https://graph.facebook.com:443/me/albums?access_token=qwerty&date_format=U&limit=25&until=1178414055&__paging_token=509208145684',
                     file: __dirname+'/me/albums2.json'});

fakeweb.registerUri({uri: 'https://graph.facebook.com:443/987502594774/photos?access_token=qwerty&date_format=U',
                     file: __dirname+'/photos/photos1.json'});
fakeweb.registerUri({uri: 'https://graph.facebook.com:443/987502594774/photos?access_token=qwerty&date_format=U&limit=25&offset=25&__after_id=987502599764',
                     file: __dirname+'/photos/photos2.json'});
fakeweb.registerUri({uri: 'https://graph.facebook.com:443/769345144054/photos?access_token=qwerty&date_format=U',
                     file: __dirname+'/photos/photos3.json'});
fakeweb.registerUri({uri: 'https://graph.facebook.com:443/769345144054/photos?access_token=qwerty&date_format=U&limit=25&offset=25&__after_id=526938808294',
                     file: __dirname+'/photos/photos4.json'});
fakeweb.registerUri({uri: 'https://graph.facebook.com:443/769345139064/photos?access_token=qwerty&date_format=U',
                     file: __dirname+'/photos/photos5.json'});

fakeweb.registerUri({uri: 'https://graph.facebook.com:443/me/feed?access_token=qwerty&date_format=U&limit=100',
                     file: __dirname+'/feed/feed1.json'});
fakeweb.registerUri({uri: 'https://graph.facebook.com:443/me/feed?access_token=qwerty&date_format=U&limit=100&until=1304122899',
                     file: __dirname+'/feed/feed2.json'});
fakeweb.registerUri({uri: 'https://graph.facebook.com:443/me/feed?access_token=qwerty&date_format=U&limit=100&until=1266874405',
                     file: __dirname+'/feed/feed3.json'});