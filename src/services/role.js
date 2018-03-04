'use strict';

const roleModel = require('../models/role');

module.exports.transformToMask = (roles) => {
	const allRoles = roles.split(',');
	let roleMask = 1 << 1;
	for(const i in allRoles) {
		roleMask = roleMask | roleModel.getMask(allRoles[i].replace(/\s/g, ''));
	}

	return roleMask;
};