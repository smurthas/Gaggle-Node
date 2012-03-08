var async = require('async');
var fb = require('facebook');

exports.sync = function(userFbObject, callback) {
  getAllStatuses(userFbObject.auth_token, function(err, statuses) {
    getAllAlbums(userFbObject.info.id, userFbObject.auth_token, function(err, albums) {
      if (err) return callback(err);
      getAllPhotos(userFbObject.info.id, userFbObject.auth_token, albums, function(err, photos) {
        callback(err, [{type:'album', data: albums}, {type:'photo', data:photos}, {type:'status', data:statuses}]);
      });
    });
  });
}

exports.map = {
  photo: {
    text: 'name',
    source_url: 'link',
    source_creation_date: function(obj) { return obj.created_time * 1000 }
  },
  album: {},
  status: {
    filter: function(obj, user) {
      if(obj.type !== 'status') return;
      if(obj.from && obj.from.id != user.facebook.uid) return;
      return true;
      if(!obj.story) return;
      return true;
    },
    text: 'story',
    source_url: function(obj) {
      var ids = obj.id.split('_');
      return 'https://facebook.com/' + ids[0] + '/posts/' + ids[1];
    },
    source_creation_date: function(obj) { return obj.created_time * 1000 }
  }
};

function getAllAlbums(fbId, accessToken, callback) {
  var albums = [];
  fb.getAlbums({id:'me', accessToken:accessToken}, function(album) {albums.push(album)}, function() { callback(undefined, albums)});
}

function getAllStatuses(accessToken, callback) {
  var statuses = [];
  fb.getPosts({id:'me', type:'feed', accessToken:accessToken}, function(album) {statuses.push(album)}, function() { callback(undefined, statuses)});
}

function getAllPhotos(fbId, accessToken, albums, callback) {
  var photos = [];
  async.forEachSeries(albums, function(album, cbDone) {
    fb.getAlbum({id:album.id, accessToken:accessToken}, function(photo) {photos.push(photo)}, cbDone);
  }, function() {
    return callback(undefined, photos);
  });
}