const userService = require('../services/user');
const {get} = require('lodash');

module.exports.transform = (file, owner) => {
  if(Array.isArray(file)) {
    return file.map((_file) => {
      return transformTorrent(_file, owner);
    });
  } else {
    return transformTorrent(file, owner);
  }
};

function transformTorrent(file, owner) {
  const File = {
    id: get(file, 'id'),
    name: get(file,'name', ''),
    path: get(file,'path', ''),
  };

  if(owner && userService.isGranted(owner, 'admin')) {
    File.torrent_id = get(file, 'torrentId', null);
  }

  return File;
}