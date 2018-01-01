'use strict';

const torrentTransformer = require('../../transformers/torrent');

let manager = null;

/**
 * Init
 * @param _manager
 */
module.exports = (_manager) => {
	manager = _manager;
	return module.exports;
};

/**
 * Get all torrents
 * @param req
 * @param res
 * @return {Promise.<*>}
 */
module.exports.getAll = async(req, res) => {
	if(!req.session || !req.session.user) {
		return res.redirect('/login');
	}

	res.send((await manager.getAll()));
};

module.exports.post = async(req, res) => {
	if(!req.session || !req.session.user) {
		return res.status(409).send();
	}

	const promises = [];
	let torrent = null;
	if(req.files.torrents.length > 0) {
		for(const i in req.files.torrents) {
			torrent = manager.getTorrentContent(req.files.torrents[i].path);
			if(req.session.user.space > torrent.info.total_size) {
				req.session.user.space -= torrent.info.total_size;
				promises.push(manager.createFromTorrent(torrent));
			}
		}
	}

	Promise.all(promises)
	.then((torrents) => {
		for(const i in torrents) {
			torrents[i].torrent = Object.assign(
				torrentTransformer.transform(torrents[i].torrent, req.session.user),
				torrents[i].torrent);
		}
		console.log(torrents);
		res.status(200).send(torrents);
	})
	.catch((e) => {
		console.log(e);
		res.status(422).send({success: false});
	});

};