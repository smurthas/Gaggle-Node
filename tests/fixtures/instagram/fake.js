var fakeweb = require('node-fakeweb');
fakeweb.allowNetConnect = false;

fakeweb.registerUri({uri: 'https://api.instagram.com:443/v1//users/self/media/recent?access_token=1920906.b0b9af3.cb06e85ac9f84348bf3a6f3f7e7a1408',
                     file: __dirname+'/photos/1.json'});
fakeweb.registerUri({uri: 'https://api.instagram.com:443/v1/users/1920906/media/recent?access_token=1920906.b0b9af3.cb06e85ac9f84348bf3a6f3f7e7a1408&max_id=343370214_1920906',
                     file: __dirname+'/photos/2.json'});