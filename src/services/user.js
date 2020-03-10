const {USER_ROLES} = require('../class/Roles');

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

	return (user.roles & roles) !== 0;
};

module.exports.getRoleString = (user) => {
	let role = '';
	if((user.roles & USER_ROLES.USER) !== 0) {
		role += 'user,';
	}

	if((user.roles & USER_ROLES.ADMIN) !== 0) {
		role += 'admin,'
	}

	if((user.roles & USER_ROLES.BOT) !== 0) {
		role += 'bot,';
	}

	return role.substring(0, role.length-1);
};