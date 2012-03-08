var async = require('async');
var fb = require('facebook');

exports.sync = function(userFbObject, callback) {
  getAllAlbums(userFbObject.profile.id, userFbObject.accessToken, function(err, albums) {
    if (err) return callback(err);
    getAllPhotos(userFbObject.profile.id, userFbObject.accessToken, albums, function(err, photos) {
      callback(err, [{type:'albums', data: albums}, {type:'photos', data:photos}]);
    });
  });
}

exports.map = {
  photos: {
    text: 'name',
    source_url: 'link',
    source_creation_date: function(obj) { return obj.created_time * 1000 }
  },
  albums: {}
};

function getAllAlbums(fbId, accessToken, callback) {
  var albums = [];
  fb.getAlbums({id:"me", accessToken:accessToken}, function(album) {albums.push(album)}, function() { callback(undefined, albums)});
}

function getAllPhotos(fbId, accessToken, albums, callback) {
  var photos = [];
  async.forEachSeries(albums, function(album, cbDone) {
    fb.getAlbum({id:album.id, accessToken:accessToken}, function(photo) {photos.push(photo)}, cbDone);
  }, function() {
    return callback(undefined, photos);
  });
}