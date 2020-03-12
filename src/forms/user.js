const form = require('../lib/form');
const {uid} = require('rand-token');
const {USER_ROLES} = require('../class/Roles');

module.exports = async(user, data, owner, options) => {
	return form.run(
	  [
      {
        name: 'email',
        type: form.TYPE.EMAIL,
        canSet: form.ROLE.ADMIN | form.ROLE.OWNER,
        required: true,
      },
      {
        name: 'password',
        canSet: form.ROLE.ADMIN | form.ROLE.OWNER,
        required: !!options.create,
      },
      {
        name: 'roles',
        canSet: form.ROLE.ADMIN,
        required: !!options.create,
        default: USER_ROLES.USER,
      },
      {
        name: 'space',
        transform: (value) => value*1024*1024*1024,
        canSet: form.ROLE.ADMIN,
        default: 10*(1024*1024*1024)
      },
      {
        name: 'is_validated',
        canSet: form.ROLE.ADMIN,
        default: false
      },
    ].concat(
      options.create ?
        [
          {
            name: 'token',
            default: uid(32),
            canSet: form.ROLE.ADMIN,
            required: true,
          }
        ]
      :
        []
    ),
    user,
    data,
		owner,
    options
  );
};
