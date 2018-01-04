'use strict';

const torrentTransformer = require('../../transformers/torrent');
const userService = require('../../services/user');

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

	try {
		res.send((await manager.getAll()));
	} catch(e) {
		res.status(500).send(e);
	}
};

/**
 * Get one torret
 * @param req
 * @param res
 * @return {Promise.<void>}
 */
module.exports.getOne = async(req, res) => {
	if(!req.session || !req.session.user) {
		return res.redirect('/login');
	}

	try {
		res.send((await manager.getOne(req.params.hash)));
	} catch(e) {
		res.status(500).send(e);
	}
};

/**
 * Get metadata for one torrent
 * @param req
 * @param res
 * @return {Promise.<void>}
 */
module.exports.getOneMetadata = async(req, res) => {
	if(!req.session || !req.session.user) {
		return res.redirect('/login');
	}

	try {
		const torrent = await manager.getOne(req.params.hash);
		res.send((await manager.extractTorrentFile(torrent.file_path)));
	} catch(e) {
		res.status(500).send(e);
	}
};

/**
 * @param req
 * @param res
 * @return {Promise.<void>}
 */
module.exports.pause = async(req, res) => {
	if(!req.session || !req.session.user) {
		return res.redirect('/login');
	}

	try {
		res.send((await manager.pause(req.params.hash)));
	} catch(e) {
		res.status(500).send(e);
	}
};

/**
 * @param req
 * @param res
 * @return {Promise.<void>}
 */
module.exports.resume = async(req, res) => {
	if(!req.session || !req.session.user) {
		return res.redirect('/login');
	}

	try {
		res.send((await manager.resume(req.params.hash)));
	} catch(e) {
		res.status(500).send(e);
	}
};

/**
 * @param req
 * @param res
 * @return {Promise.<void>}
 */
module.exports.delete = async(req, res) => {
	if (!req.session.user || !userService.isGranted(req.session.user, 'admin')) {
		return res.status(403).send();
	}

	try {
		res.send((await manager.delete(req.params.hash)));
	} catch(e) {
		res.status(500).send(e);
	}
};

module.exports.download = async(req, res) => {
	if(!req.session || !req.session.user) {
		return res.redirect('/login');
	}

	const torrent = await manager.getOne(req.params.hash);
	const file = `${process.env.STORAGE}/dtorrent/downloaded/${torrent.name}`;
	res.download(file);
};

/**
 * Add torrent
 * @param req
 * @param res
 * @return {Promise.<void>}
 */
module.exports.post = async(req, res) => {
	if(!req.session || !req.session.user || !userService.isGranted(req.session.user, 'admin')) {
		return res.status(409).send();
	}

	const promises = [];
	let torrent = null;

	if(req.body && req.body.tracker && req.files.files && req.files.files.length > 0) {
		promises.push(manager.createFromDataAndTracker(req.files.files, req.body.tracker));
	}
	else if(req.files.files && req.files.files.length > 0 && req.files.torrents && req.files.torrents.length === 1) {
		promises.push(manager.createFromTorrentAndData(req.files.torrents[0].path, req.files.files[0].path));
	}
	else if(req.files.torrents && req.files.torrents.length > 0 && !req.files.files) {
		for(const i in req.files.torrents) {
			torrent = manager.extractTorrentFile(req.files.torrents[i].path);
			if(req.session.user.space > torrent.info.total_size) {
				req.session.user.space -= torrent.info.total_size;
				promises.push(manager.createFromTorrent(req.files.torrents[i].path));
			}
		}
	}
	else {
		res.status(404).send();
	}

	Promise.all(promises)
	.then((torrents) => {
		for(const i in torrents) {
			torrents[i].torrent = Object.assign(
				torrentTransformer.transform(torrents[i].torrent, req.session.user),
				torrents[i].torrent);
		}
		res.status(200).send(torrents);
	})
	.catch((e) => {
		console.log(e);
		res.status(422).send({success: false});
	});

};