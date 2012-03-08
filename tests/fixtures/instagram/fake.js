var fakeweb = require('node-fakeweb');
fakeweb.allowNetConnect = false;

fakeweb.registerUri({uri: 'https://api.instagram.com:443/v1//users/self/media/recent?access_token=qwerty',
                     file: __dirname+'/photos/1.json'});
fakeweb.registerUri({uri: 'https://api.instagram.com:443/v1/users/1920906/media/recent?access_token=qwerty&max_id=343370214_1920906',
                     file: __dirname+'/photos/2.json'});