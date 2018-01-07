'use strict';

const debug = require('debug');

const lDebug = debug('dTorrent:api:controllers:debug');
let manager, server = null;

/**
 * Initialize api
 * @param _server
 * @param _manager
 */
module.exports = (_server, _manager) => {
	lDebug('Initialize Web Socket controller');
	manager = _manager;
	server = _server;
	const io = require('socket.io')(server);
	io.sockets.on('connection', (socket) => {
		manager.addListener({
			onAdded: (torrent) => {
				socket.emit('torrent-added', JSON.stringify(torrent));
			},
			onRemoved: (torrent) => {
				socket.emit('torrent-removed', JSON.stringify(torrent));
			},
			onUpdated: (torrent) => {
				socket.emit('torrent-updated', JSON.stringify(torrent));
			},
			onResumed: (torrent) => {
				socket.emit('torrent-resumed', JSON.stringify(torrent));
			},
			onPaused: (torrent) => {
				socket.emit('torrent-paused', JSON.stringify(torrent));
			},
			onFinished: (torrent) => {
				socket.emit('torrent-finished', JSON.stringify(torrent));
			},
		});
	});


	return module.exports;
};