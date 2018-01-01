'use strict';

const userService = require('../../services/user');

module.exports.name = 'is_granted';

module.exports.main = (user, roles) => {
	return userService.isGranted(user, roles);
};