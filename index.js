const dtorrent = require('dtorrent');

const dConfig = {
	rtorrent_host: '127.0.0.1', // IP of client torrent
	rtorrent_port: 8092, // Port of client torrent
	rtorrent_path: '/RPC2' // Path to join client torrent via XML RPC
};

const dListener = {
	/**
	 * Function called when torrent is inserted
	 * @param torrent
	 */
	onInsert: function(torrent) {
		console.log('client Event insert %s', torrent.hash);
	},
	/**
	 * Function called when torrent is uploading
	 * @param torrent
	 */
	onUpload: function(torrent) {
		console.log('client event uploaded %s', torrent.hash);
	},
	/**
	 * Function called when torrent is downloading
	 * @param torrent
	 */
	onDownload: function(torrent) {
		console.log('client event download %s', torrent.hash);
	},
	/**
	 * Function called when torrent is finished
	 * @param torrent
	 */
	onFinished: function(torrent) {
		console.log('client event on finished %s', torrent.hash);
	}
};

dtorrent.addConfig(dConfig);

dtorrent.start(dListener);
