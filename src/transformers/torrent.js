const userService = require('../services/user');
const fileTransformer = require('./file');
const userTransformer = require('./user');
const {get} = require('lodash');

module.exports.transform = (torrent, owner) => {
	if(Array.isArray(torrent)) {
		return torrent.map((torrent) => {
			return transformTorrent(torrent, owner);
		});
	} else {
		return transformTorrent(torrent, owner);
	}
};

function transformTorrent(torrent, owner) {
	const Torrent = {
    id: get(torrent, 'id'),
		hash: get(torrent, 'hash', ''),
		name: get(torrent,'name', ''),
	};

	if(owner && userService.isGranted(owner, 'admin')) {
		//TODO
	}

  if(owner && userService.isGranted(owner, 'user')) {
    Torrent.downloaded = get(torrent, 'downloaded', 0);
    Torrent.uploaded = get(torrent, 'uploaded', 0);
    Torrent.total = get(torrent, 'total', 0);
    Torrent.active = get(torrent, 'active', 0);
    Torrent.progress = Math.round((Torrent.downloaded*100) / Torrent.total);
    Torrent.ratio = (Torrent.uploaded / Torrent.total).toFixed(4);
    Torrent.finished = get(torrent, 'finished', Torrent.downloaded === Torrent.total);
    Torrent.user = userTransformer.transform(get(torrent, 'user', false), owner);
    Torrent.files = fileTransformer.transform(get(torrent, 'files', []), owner);
  }

	return Torrent;
}