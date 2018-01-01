'use strict';

const userService = require('../services/user');

module.exports.transform = (torrent, owner) => {
	if(Array.isArray(torrent)) {
		return torrent.map((user) => {
			return transformTorrent(user, owner);
		});
	} else {
		return transformTorrent(torrent, owner);
	}
};

function transformTorrent(torrent, owner) {
	const Torrent = {
		hash: torrent.infoHash,
		name: torrent.name,
		progress: torrent.progress || 0,
		// down_rate: Number,
		// mb_downloaded: Number,
		// mb_uploaded: Number,
		// mb_total: Number,
		// ratio: Number,
		// nb_leechers: Number,
		// nb_seeders: Number,
		playing: torrent.playing || true,
		is_finished: torrent.is_finished || false,
		is_active: torrent.is_active || false,
		is_removed: torrent.is_removed || false,
	};

	if(owner && userService.isGranted(owner, 'admin')) {
		//TODO
	}

	return Torrent;
}