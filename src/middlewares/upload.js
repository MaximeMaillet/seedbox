const fs = require('fs');
const multer = require('multer');
const ApiError = require('../class/ApiError');
const pictureService = require('../services/picture');
const config = require('../config');

const upload = multer({
  dest: config.api.torrent.temp_directory,
});

const picture = multer({
  limits: {
    fileSize: 100*1024, //100Ko
  },
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      if(!fs.existsSync(`${config.api.user.directory}/${req.user.id}`)) {
        fs.mkdirSync(`${config.api.user.directory}/${req.user.id}`);
      }
      cb(null, `${config.api.user.directory}/${req.user.id}`);
    },
    filename: (req, file, cb) => {
      cb(null, `${file.fieldname}-${Date.now()}.${pictureService.mimeTypeToExtension(file.mimetype)}`)
    },
  }),
  fileFilter: (req, file, cb) => {
    if(pictureService.availableMimeType.indexOf(file.mimetype) === -1) {
      cb(new ApiError(415, req.translation.get('generic.upload.bad_mime_type')))
    }

    cb(null, true)
  },
});

module.exports.torrent = upload
  .fields([
    { name: 'torrents'},
  ])
;

module.exports.picture = picture
  .single('picture');