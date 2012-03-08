var instagram = require('instagram');

exports.sync = function(userInstagramObject, callback) {
  getPhotos(userInstagramObject.auth_token, function(err, photos) {
    callback(err, [{type:'photo', data: photos}]);
  });
}

exports.map = {
  photo: {
    text: function(obj) { return obj.caption? obj.caption.text: undefined },
    source_url: 'link',
    source_creation_date: function(obj) { return parseInt(obj.created_time) * 1000 }
  }
};

function getPhotos(token, callback) {
  var photos = [];
  instagram.getMedia({access_token:token}, function(photo) {photos.push(photo)}, function() { callback(undefined, photos)});
}