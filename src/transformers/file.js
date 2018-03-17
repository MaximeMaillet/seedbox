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
  };

  if(owner && userService.isGranted(owner, 'admin')) {
    File.torrent_id = get(file, 'torrentId', null);
    File.path = get(file,'path', '');
  }

  return File;
}