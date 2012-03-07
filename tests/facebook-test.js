var vows = require('vows');
var assert = require('assert');
var fb = require(__dirname + '/../crawlers/facebook.js')

var fakeweb = require('node-fakeweb');
fakeweb.allowNetConnect = false;

fakeweb.registerUri({uri: 'https://graph.facebook.com:443/me/albums?access_token=qwerty&date_format=U',
                     file: __dirname+'/fixtures/facebook/me/albums1.json'});
fakeweb.registerUri({uri: 'https://graph.facebook.com:443/me/albums?access_token=qwerty&date_format=U&limit=25&until=1178414055&__paging_token=509208145684',
                     file: __dirname+'/fixtures/facebook/me/albums2.json'});
fakeweb.registerUri({uri: 'https://graph.facebook.com:443/987502594774/photos?access_token=qwerty&date_format=U',
                     file: __dirname+'/fixtures/facebook/photos/photos1.json'});
fakeweb.registerUri({uri: 'https://graph.facebook.com:443/987502594774/photos?access_token=qwerty&date_format=U&limit=25&offset=25&__after_id=987502599764',
                     file: __dirname+'/fixtures/facebook/photos/photos2.json'});
fakeweb.registerUri({uri: 'https://graph.facebook.com:443/769345144054/photos?access_token=qwerty&date_format=U',
                     file: __dirname+'/fixtures/facebook/photos/photos3.json'});
fakeweb.registerUri({uri: 'https://graph.facebook.com:443/769345144054/photos?access_token=qwerty&date_format=U&limit=25&offset=25&__after_id=526938808294',
                     file: __dirname+'/fixtures/facebook/photos/photos4.json'});
fakeweb.registerUri({uri: 'https://graph.facebook.com:443/769345139064/photos?access_token=qwerty&date_format=U',
                     file: __dirname+'/fixtures/facebook/photos/photos5.json'});

var fs = require('fs');

var user = JSON.parse(fs.readFileSync(__dirname + '/fixtures/user.json'));

vows.describe('The Facebook Crawler').addBatch({
  'when syncing from facebook': {
    topic: function() {
      fb.sync(user.facebook, this.callback)
    },
    'returns albums and photos': function(err, datas) {
      assert.notEqual(typeof err, Object);
      assert.notEqual(datas.albums.length, 0);
      assert.notEqual(datas.photos.length, 0);
    }
  }
}).export(module);