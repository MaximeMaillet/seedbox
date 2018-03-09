'use strict';

const roleModel = require('../models/role');

/**
 * Check user roles
 * @param user
 * @param roles
 * @param object
 * @return {*}
 */
module.exports.isGranted = (user, roles, object) => {

	if(!user || !user.roles) {
		return false;
	}

	const allRoles = roles.split(',');
	const isGranted = [];
  let currentRole = null;
	for(const i in allRoles) {
    currentRole = allRoles[i].replace(/\s/g, '');
		if(currentRole === 'owner' && object) {
			if(object.id !== user.id) {
				isGranted.push(false);
			}
		} else {
			if(new Buffer(user.roles).toString() & roleModel.getMask(currentRole)) {
				isGranted.push(true);
			} else {
				isGranted.push(false);
			}
		}
	}

	for(const i in isGranted) {
		if(!isGranted[i]) {
			return false;
		}
	}

	return true;
};