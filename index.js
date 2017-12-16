const dtorrent = require('dtorrent');

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
		console.log(torrent);
	},
	/**
	 * Function called when torrent is downloading
	 * @param torrent
	 */
	onDownload: function(torrent) {
		console.log('client event download %s', torrent.hash);
		console.log(torrent);
	},
	/**
	 * Function called when torrent is finished
	 * @param torrent
	 */
	onFinished: function(torrent) {
		console.log('client event on finished %s', torrent.hash);
	}
};

dtorrent.start(dListener);
