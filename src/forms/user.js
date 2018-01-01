'use strict';

const form = require('../lib/form');
const {uid} = require('rand-token');

module.exports = async(user, data, owner) => {

	return form.run(
		user,
		[
			{name: 'username', value: data.username},
			{name: 'password', value: data.password},
			{name: 'roles', type: 'Role', value: data.roles, canEdit: 'admin', canCreate: 'admin', default: 'user'},
			{name: 'space', value: data.space * (1024*1024*1024), canEdit: 'admin', canCreate: 'admin', default: 5*(1024*1024*1024)},
			{name: 'is_validated', value: data.is_validated, canEdit: 'admin', canCreate: 'admin', default: false},
			{name: 'token', value: uid(32), canEdit: 'admin', canCreate: 'admin'}
		],
		owner);
};