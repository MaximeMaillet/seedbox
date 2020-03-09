const _multer = require('multer')

const upload = _multer({dest: './public/uploads/'});
module.exports.torrentFiles = upload.fields([
  { name: 'torrents'},
  { name: 'torrentFiles'}
]);
