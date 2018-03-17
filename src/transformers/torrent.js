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
    Torrent.progress = get(torrent, 'progress', 0);
    Torrent.downloaded = get(torrent, 'downloaded', 0);
    Torrent.uploaded = get(torrent, 'uploaded', 0);
    Torrent.total = get(torrent, 'total', 0);
    Torrent.ratio = get(torrent, 'ratio', 0);
    Torrent.playing = get(torrent, 'playing', true);
    Torrent.is_finished = get(torrent, 'is_finished', false);
    Torrent.is_active = get(torrent, 'is_active', false);
    Torrent.is_removed = get(torrent, 'is_removed', false);
    Torrent.user = userTransformer.transform(get(torrent, 'user', false), owner);
    Torrent.files = fileTransformer.transform(get(torrent, 'files', []), owner);
  }

	return Torrent;
}