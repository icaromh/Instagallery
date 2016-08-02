'use strict';

const Account  = require('./auth');
const Media    = require('./bin/media');

var Client       = require('instagram-private-api').Client.V1;
const device     = new Client.Device('SAMSUNG_GALAXY_S2', Account.username);
const cookiePath = __dirname + '/cookies/' + Account.username + '.json';
const query      = 'fashion';

Client.Session.create(device, cookiePath, Account.username, Account.password)

  /**
   * Search for Fashion tags at explore tab
   */
  .then((session) => {
    const feed =  new Client.Feed.TagMedia(session, query);
    return feed.get();
  })

  /**
   * Map posts
   */
  .then((feed) => {
    return new Promise((resolve) => {
      let data = feed.map((el) => {
        return {
          media: el._params,
          owner: el.account._params
        };
      });
      resolve(data);
    });
  })

  /**
   * Get a random post
   */
  .then((data) => {
    return new Promise((resolve) => {
      let id = Math.round(Math.random() * (data.length));
      resolve(data[id]);
    });
  })

  /**
   * Download Image and merge info with post
   */
  .then((post) => {
    return Media
      .download(post.media.images[0].url, post.media.id)
      .then((filename) => {
        return { post: post, file: filename };
      });
  })

  /**
   * Prepare Upload
   */
  .then((meta) => {
    let session = new Client.Session(device, cookiePath);
    return [Client.Upload.photo(session, meta.file), meta, session];
  })

  /**
   * Add the caption to photo and upload that
   */
  .spread((upload, meta, session) => {
    let caption = `${meta.post.media.caption} \nrepost from @${meta.post.owner.username}`;
    console.log(caption);
    return Client.Media.configurePhoto(session, upload.params.uploadId, caption);
  })

  /**
   * Return of Instagram Upload :)
   */
  .then(function(medium) {
    console.log(medium);
  });