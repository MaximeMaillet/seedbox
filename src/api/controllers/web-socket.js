const debug = require('debug');

const lDebug = debug('dTorrent:api:controllers:debug');
let manager = null;

/**
 * Initialize api
 * @param _manager
 */
module.exports = (_manager) => {
	lDebug('Initialize Web Socket controller');
	manager = _manager;
	return module.exports;
};

/**
 * Web socket
 * @param req
 * @param res
 */
module.exports.listener = (req, res) => {

	lDebug('Open connection');

	req.socket.setTimeout(120000);
	res.writeHead(200, {
		'Content-Type': 'text/event-stream',
		'Cache-Control': 'no-cache',
		'Connection': 'keep-alive'
	});
	res.write('\n');

	const refreshIntervalId = setInterval(() => {
		lDebug('Send ping to client');
		res.write(`data: ${JSON.stringify({'event': 'ping'})} \n\n`);
	}, 90000);

	/**
	 * @TODO
	 * Check de connexion
	 */

	const dListener = {
		/**
		 * Function called when torrent is inserted
		 * @param torrent
		 */
		onInsert: function(torrent) {
			res.write(`data: ${ JSON.stringify({
				'event': 'insert',
				'torrent': torrent
			})} \n\n`);
		},
		onUpdated: function(torrent) {
			res.write(`data: ${ JSON.stringify({
				'event': 'update',
				'torrent': torrent
			})} \n\n`);
		},
		onActive: function(torrent) {
			res.write(`data: ${ JSON.stringify({
				'event': 'active',
				'torrent': torrent
			})} \n\n`);
		},
		onRemove: function(torrent) {
			res.write(`data: ${ JSON.stringify({
				'event': 'remove',
				'torrent': torrent
			})} \n\n`);
		},
		/**
		 * Function called when torrent is uploading
		 * @param torrent
		 */
		onUpload: function(torrent) {
			res.write(`data: ${ JSON.stringify({
				'event': 'upload',
				'torrent': torrent
			})} \n\n`);
		},
		/**
		 * Function called when torrent is downloading
		 * @param torrent
		 */
		onDownload: function(torrent) {
			res.write(`data: ${ JSON.stringify({
				'event': 'download',
				'torrent': torrent
			})} \n\n`);
		},
		/**
		 * Function called when torrent is finished
		 * @param torrent
		 */
		onFinished: function(torrent) {
			res.write(`data: ${ JSON.stringify({
				'event': 'finish',
				'torrent': torrent
			})} \n\n`);
		}
	};

	manager.addListener(dListener);

	req.on('close', () => {
		lDebug('Connection close');
		manager.removeListener(dListener);
		clearInterval(refreshIntervalId);
		res.write(`data: ${ JSON.stringify({event: 'disconnect'}) } \n\n`);
		res.end();
	});

};