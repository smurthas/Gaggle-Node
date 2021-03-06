var request = require('request');
var async = require('async');

// enumeration of all fields on a user for open graph, cuz they're not all default
var allUserFields = 'id,name,first_name,middle_name,last_name,gender,locale,languages,' +
                    'link,username,third_party_id,timezone,updated_time,verified,bio,' +
                    'birthday,education,email,hometown,interested_in,location,political,' +
                    'favorite_athletes,favorite_teams,quotes,relationship_status,' +
                    'religion,significant_other,video_upload_limits,website,work';

// walk a friends list getting/caching each one
exports.getFriends = function(arg, cbEach, cbDone) {
    var uri = 'https://graph.facebook.com/'+arg.id+'/friends?access_token=' + arg.accessToken + '&date_format=U';
    getOne(uri, function(err, friends) {
        if(err || !friends.data) return cbDone(err);
        async.forEach(friends.data, function(friend,cb){
            exports.getPerson({id:friend.id}, cbEach,cb);
        },cbDone);
    });
}

// get as much as we can about any single person, including caching their thumbnail
exports.getPerson = function(arg, cbEach, cbDone) {
    // should check cache here of people/id.json and just use that if it's recent enough
    var uri = 'https://graph.facebook.com/'+arg.id+'?access_token=' + arg.accessToken + '&date_format=U&fields='+allUserFields;
    getOne(uri, function(err,js) {
        if(err) return cbDone(err);
        cbEach(js);
        cbDone();
    });
}

// recurse getting all the photos in an album
exports.getAlbum = function (arg, cbEach, cbDone) {
    arg.uri = (arg.page)?arg.page:'https://graph.facebook.com/'+arg.id+'/photos?access_token=' + arg.accessToken + '&date_format=U';
    getDatas(arg, cbEach, cbDone);
}

// recurse getting all the albums for a person
exports.getAlbums = function (arg, cbEach, cbDone) {
    arg.uri = (arg.page)?arg.page:'https://graph.facebook.com/'+arg.id+'/albums?access_token=' + arg.accessToken + '&date_format=U';
    getDatas(arg, cbEach, cbDone);
}

// recurse getting all the photos tagged in
exports.getTagged = function (arg, cbEach, cbDone) {
    arg.uri = (arg.page)?arg.page:'https://graph.facebook.com/'+arg.id+'/photos?access_token=' + arg.accessToken + '&date_format=U';
    getDatas(arg, cbEach, cbDone);
}

// recurse getting all the posts for a person and type (wall or newsfeed) {id:'me',type:'home',since:123456789}
exports.getPosts = function (arg, cbEach, cbDone) {
    var since = (arg.since)?'&since='+arg.since:'';
    arg.uri = (arg.page)?arg.page:'https://graph.facebook.com/'+arg.id+'/'+arg.type+'?access_token=' + arg.accessToken + '&date_format=U'+since + '&limit=100';
    // possible facebook bug here when using since, sometimes the paging.next doesn't contain the since and it'll end up re-walking the whole list
    getDatas(arg, cbEach, cbDone);
}


exports.getProfile = function(arg, cbDone) {
    request.get({uri:'https://graph.facebook.com/me?access_token=' + arg.accessToken + '&fields='+allUserFields, json:true},
    function(err, resp, profile) {
        cbDone(err, profile);
    });
}

function getOne(uri, cb) {
    if(!uri) return cb('no uri');
    request.get({uri:uri}, function(err, resp, body) {
        var js;
        try {
            if(err) throw err;
            js = JSON.parse(body);
        } catch(e) {
            return cb(e);
        }
        cb(null,js);
    });
}

function getDatas(arg, cbEach, cbDone) {
    if(!arg.uri) return cbDone('no uri');
    request.get({uri:arg.uri, json:true}, function(err, resp, js) {
      if (err) return cbDone(err);
      if (resp.statusCode !== 200) return cbDone({statusCode:resp.statusCode});
        for(var i = 0; js.data && i < js.data.length; i++) cbEach(js.data[i]);
        if(js.paging && js.paging.next) {
            arg.uri = js.paging.next;
            if(arg.since && arg.uri.indexOf('since=') == -1) arg.uri += '&since='+arg.since;
            getDatas(arg,cbEach,cbDone);
        } else {
            cbDone();
        }
    });
}

