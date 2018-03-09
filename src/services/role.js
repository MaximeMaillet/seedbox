'use strict';

const roleModel = require('../models/role');

module.exports.transformToMask = (roles) => {
	const allRoles = roles.split(',');
	let roleMask = null;
	for(const i in allRoles) {
		roleMask = roleMask | roleModel.getMask(allRoles[i].replace(/\s/g, ''));
	}

	return new Buffer(roleMask.toString(), 'binary');
};