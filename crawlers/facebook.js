var async = require('async');
var fb = require('facebook');

exports.sync = function(userFbObject, callback) {
  getAllAlbums(userFbObject.profile.id, userFbObject.accessToken, function(err, albums) {
    if (err) return callback(err);
    getAllPhotos(userFbObject.profile.id, userFbObject.accessToken, albums, function(err, photos) {
      callback(err, {albums: albums, photos:photos});
    });
  });
}

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