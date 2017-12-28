'use strict';

let manager = null;

/**
 * Init
 * @param _manager
 */
module.exports = (_manager) => {
	manager = _manager;
	return module.exports;
};

module.exports.getAll = async(req, res) => {
	if(!req.session || !req.session.user) {
		return res.redirect('/login');
	}

	res.send((await manager.getAll()));
};