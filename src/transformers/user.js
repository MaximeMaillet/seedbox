require('dotenv').config();
const userService = require('../services/user');
const {USER_ROLES} = require('../class/Roles');

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
	const User = {
	};

	if(userService.isGranted(owner, USER_ROLES.USER)) {
		User.id = user.id;
		User.email = user.email;
		User.space = parseInt((user.space / (1024*1024*1024)).toFixed(4));
		User.roles = userService.getRoleString(user);
		User.picture = user.picture ? `${process.env.API_URL}/static/profile/${user.id}/${user.picture}` : null;
	}

	if(userService.isGranted(owner, USER_ROLES.ADMIN)) {
		User.createdAt = user.createdAt;
		User.updatedAt = user.updatedAt;
		User.is_validated = user.is_validated;
	}

	return User;
}