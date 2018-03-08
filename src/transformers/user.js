'use strict';

const roleModel = require('../models/role');
const userService = require('../services/user');

module.exports.transform = (user, owner) => {
	if(Array.isArray(user)) {
		return user.map((user) => {
			return transformUser(user, owner);
		});
	} else {
		return transformUser(user, owner);
	}
};

function transformUser(user, owner) {
	let roleString = '';
	if(user.roles & roleModel.getMask('admin')) {
		roleString = `admin,${roleString}`;
	}
	if(user.roles & roleModel.getMask('user')) {
		roleString = `user,${roleString}`;
	}
	if(user.roles & roleModel.getMask('moderator')) {
		roleString = `moderator,${roleString}`;
	}

	const User = {
		id: user.id,
		email: user.email,
		roles: roleString.substring(0, roleString.length - 1),
		space: user.space / (1024*1024*1024),
		createdAt: user.createdAt,
		updatedAt: user.updatedAt
	};

	if(owner && userService.isGranted(owner, 'admin')) {
		User.is_validated = user.is_validated;
	}

	return User;
}