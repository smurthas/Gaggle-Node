var fs = require('fs');
var crawler = require(__dirname+ '/../crawlers/' + process.argv[2]);

crawler.sync(JSON.parse(fs.readFileSync(process.argv[3])), function(err, datas) {
  console.error("DEBUG: datas", datas);
});