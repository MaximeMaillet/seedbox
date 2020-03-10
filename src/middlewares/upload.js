const _multer = require('multer');
const config = require('../config');

const upload = _multer({
  dest: config.api.torrent.temp_directory,
});

module.exports.torrent = upload
  .fields([
    { name: 'torrents'},
  ])
;
