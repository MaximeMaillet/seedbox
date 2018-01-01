'use strict';

const roleModel = require('../models/role')();

/**
 * Check user roles
 * @param user
 * @param roles
 * @return {*}
 */
module.exports.isGranted = (user, roles) => {

	if(!user || !user.roles) {
		return false;
	}

	return new Buffer(user.roles).toString() & roleModel.getMask(roles);
};