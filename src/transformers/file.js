const userService = require('../services/user');
const {USER_ROLES} = require('../class/Roles');
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

  if(userService.isGranted(owner, USER_ROLES.USER)) {
    File.torrent_id = get(file, 'torrent_id', null);
    File.path = get(file,'path', '');
  }

  return File;
}