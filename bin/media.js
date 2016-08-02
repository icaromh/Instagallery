'use strict';
const fs   = require('fs');
const path = require('path');
const http = require('http');
var Media  = {};

const ext = (str) => {
  let nUrl = str.replace(/\?ig_cache_key.*/,'');
  return path.extname(nUrl);
};

Media.download = (url, id) => {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      res.setEncoding('binary');
      var body = '';
      res.on('data', (d) => body += d);
      res.on('end', () => {
        let filePath = path.resolve(__dirname + '/../temp/'+ id + ext(url));
        fs.writeFile(filePath, body, 'binary', (err) => {
          if(err) reject(err);
          else resolve(filePath);
        });
      });
    });
  });
};



// Client.Session.create(device, cookiePath, 'afashiongallery', 'fashion@123')
// .then(function(session){
//   return [Client.Upload.photo(session, pathOrStream), session];
// })
// .spread(function(upload, session) {
//   var caption = '#ootd \nrepost of';
//   return Client.Media.configurePhoto(session, upload.params.uploadId, caption);
// })
// .then(function(medium) {
//   console.log(medium);
// });
//

module.exports = Media;