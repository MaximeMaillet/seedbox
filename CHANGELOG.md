# Release 0.1.0
*2018-03-17*

Clean API with [express-imp-router](https://github.com/MaximeMaillet/express-imp-router) and authentication with JWT.

Upgrade dTorrent and normalize data.

Persistence with MariaDB.

### Refacto

* [x] Authenticate system (login, subscribe, forgot password, etc)
* [x] User model : replace username by email
* [x] Api /users
* [x] Api /torrents
* [x] Authentication with JWT
* [x] WebSocket

### Upload

* [x] Add one or multiple torrents
* [x] Blacklist/whitelist trackers

### Peristence

* [x] Stock upload of torrent for keep ratio
* [x] Link torrent with files and user
* [x] Reduce user's space when he downloads torrent

### User
* [x] He can download torrent (data)
* [x] Roles manager with admin, moderator and user