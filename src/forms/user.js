const form = require('../lib/form');
const {uid} = require('rand-token');
const get = require('lodash.get');
const {USER_ROLES} = require('../class/Roles');

module.exports = async(user, data, owner, options) => {
	return form.run(
		user,
		[
			{
        name: 'email',
        value: get(data, 'email', null),
        type: 'email',
        required: true,
      },
			{
        name: 'password',
        value: get(data, 'password', null),
        required: true,
      },
      {
        name: 'roles',
        value: get(data, 'roles', null),
        canSet: ['admin'],
        default: USER_ROLES.USER,
      },
			{
        name: 'space',
        value: get(data, 'space', 0) * (1024*1024*1024),
        canSet: ['admin'],
        default: 5*(1024*1024*1024)
      },
			{
        name: 'is_validated',
        value: get(data, 'is_validated', false),
        canSet: ['admin', 'owner'],
        default: false
      },
			{
        name: 'token',
        value: '',
        default: uid(32),
        canSet: []
      }
		],
		owner,
    options
  );
};
