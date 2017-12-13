const dtorrent = require('dtorrent');

const dConfig = {
	torrent: {
		client: 'rTorrent', // Client for download torrent
		host: '127.0.0.1', // IP of client torrent
		port: 8092, // Port of client torrent
		path: '/RPC2' // Path to join client torrent via XML RPC
	}
};

var dListener = {
	/**
	 * Function called when torrent is inserted
	 * @param torrent
	 */
	onInsert: function(torrent) {
		console.log("Event insert %s", torrent.hash);
	},
	/**
	 * Function called when torrent is uploading
	 * @param torrent
	 */
	onUploaded: function(torrent) {
		console.log("event uploaded %s", torrent.hash);
	},
	/**
	 * Function called when torrent is downloading
	 * @param torrent
	 */
	onDownloaded: function(torrent) {
		console.log("event download %s", torrent.hash);
	},
	/**
	 * Function called when torrent is finished
	 * @param torrent
	 */
	onFinished: function(torrent) {
		console.log("event on finished %s", torrent.hash)
	}
};

dtorrent.start(dConfig, dListener);
