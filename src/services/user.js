'use strict';

const roleModel = require('../models/role')();

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
	for(const i in allRoles) {

		if(allRoles[i].replace(/\s/g, '') === 'owner' && object) {
			if(object.getOwnerID() !== user.id) {
				isGranted.push(false);
			}
		} else {
			if(new Buffer(user.roles).toString() & roleModel.getMask(allRoles[i].replace(/\s/g, ''))) {
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