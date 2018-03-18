const roles = [
  {name: 'user', mask: 1 << 1},
  {name: 'moderator', mask: 1 << 2},
  {name: 'admin', mask: 1 << 3},
];

module.exports = (sequelize, DataTypes) => {
	const Roles = sequelize.define('roles', {
		name: {
			type: DataTypes.STRING,
			unique: true,
			allowNull: false
		},
		mask: {
			type: DataTypes.BLOB,
			allowNull: false
		}
	});

  roles.map((role) => {
    Roles.findOrCreate({where: {name: role.name}, defaults: {name: role.name, mask: role.mask}});
  });

  return Roles;
};

module.exports.getMask = (name) => {
  return roles
    .filter((role) => role.name === name)
    .map((role) => {
      return role.mask;
    })[0]
  ;
};