'use strict';

const form = require('../lib/form');
const {uid} = require('rand-token');

module.exports = async(user, data, owner) => {

	return form.run(
		user,
		[
			{
        name: 'email',
        value: data.email,
        required: true,
      },
			{
        name: 'password',
        value: data.password,
        required: true,
      },
      {
        name: 'roles',
        type: 'Role',
        value: data.roles,
        canSet: ['admin'],
        default: 'user'
      },
			{
        name: 'space',
        value: data.space * (1024*1024*1024),
        canSet: ['admin'],
        default: 5*(1024*1024*1024)
      },
			{
        name: 'is_validated',
        value: data.is_validated,
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
		owner);
};