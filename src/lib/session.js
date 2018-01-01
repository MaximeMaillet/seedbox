'use strict';

let fileStore = null;

module.exports = (session) => {
	const FileStore = require('session-file-store')(session);

	fileStore = new FileStore({
		path: './sessions'
	});

	return fileStore;
};