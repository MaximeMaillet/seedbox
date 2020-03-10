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
		id: user.id,
		email: user.email,
		roles: userService.getRoleString(user),
	};

	if(userService.isGranted(owner, USER_ROLES.USER)) {
		User.space = user.space / (1024*1024*1024);
	}

	if(userService.isGranted(owner, USER_ROLES.ADMIN)) {
		User.createdAt = user.createdAt;
		User.updatedAt = user.updatedAt;
		User.is_validated = user.is_validated;
	}

	return User;
}