'use strict';

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
	// if(user.roles & roleModel.getMask('admin')) {
	// 	roleString = `admin,${roleString}`;
	// }
	// if(user.roles & roleModel.getMask('user')) {
	// 	roleString = `user,${roleString}`;
	// }
	// if(user.roles & roleModel.getMask('moderator')) {
	// 	roleString = `moderator,${roleString}`;
	// }

	const User = {
		id: user.id,
		email: user.email,
		space: user.space / (1024*1024*1024),
		createdAt: user.createdAt,
		updatedAt: user.updatedAt
	};

	if(owner && userService.isGranted(owner, 'admin')) {
		User.is_validated = user.is_validated;
    User.roles = roleString.substring(0, roleString.length - 1);
	}

	return User;
}