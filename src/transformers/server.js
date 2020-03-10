const userService = require('../services/user');
const {USER_ROLES} = require('../class/Roles');
const {get} = require('lodash');

module.exports.transform = (server, owner) => {
  if(Array.isArray(server)) {
    return server.map((s) => {
      return transformServer(s, owner);
    });
  } else {
    return transformServer(server, owner);
  }
};

function transformServer(server, owner) {
  const Server = {
    name: get(server,'name', ''),
    client: get(server,'client', ''),
    host: get(server,'host', ''),
    port: get(server,'port', ''),
    endpoint: get(server,'endpoint', ''),
  };

  if(userService.isGranted(owner, USER_ROLES.ADMIN)) {
    Server.interval_check = get(server,'interval_check', '');
    Server.auth = get(server, 'auth', '');
  }

  return Server;
}