var instagram = require('instagram');

exports.sync = function(userInstagramObject, callback) {
  getPhotos(userInstagramObject.auth_token, userInstagramObject.last_update, function(err, photos) {
    callback(err, {data:[{type:'photo', data: photos}]});
  });
}

exports.map = {
  photo: {
    text: function(obj) { return obj.caption? obj.caption.text: undefined },
    source_url: 'link',
    source_creation_date: function(obj) { return parseInt(obj.created_time) * 1000 }
  }
};

function getPhotos(token, min_timestamp, callback) {
  var photos = [];
  if(!min_timestamp) min_timestamp = 0;
  instagram.getMedia({access_token:token, min_timestamp:min_timestamp}, function(photo) {photos.push(photo)}, function(err) { callback(err, photos)});
}