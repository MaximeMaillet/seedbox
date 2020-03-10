# Seedbox - API

Seedbox with [rTorrent](https://github.com/MaximeMaillet/rtorrent-daemon) + [dTorrent](https://github.com/MaximeMaillet/dtorrent).


## Features

- User management (CRUD + roles)
- Multiple torrent server management
- Bot which listen on all torrent server


## Endoints

| Release | Method | Endpoint                                 | Params            |
|:-------:|:------:| ---------------------------------------- |:-----------------:|
| 0.2.0   | POST   | /api/authentication/login                | {email, password} |
| 0.2.0   | GET    | /api/authentication/confirm              | ?token=           |
| 0.2.0   | POST   | /api/authentication/forgot               | {email}           |
| 0.2.0   | GET    | /api/authentication/password             | ?token=           |
| 0.2.0   | POST   | /api/authentication/password             | {token, password} |
| 0.2.0   | GET    | /api/users                               | |
| 0.2.0   | POST   | /api/users                               | |
| 0.2.0   | GET    | /api/users/:id                           | |
| 0.2.0   | PATCH  | /api/users/:id                           | {email, etc.}     |
| 0.2.0   | DELETE | /api/users/:id                           | |
| 0.2.0   | GET    | /api/servers                             | |
| 0.2.0   | GET    | /api/torrents                            | |
| 0.2.0   | GET    | /api/torrents/:torrentId                 | |
| 0.2.0   | GET    | /api/torrents/:torrentId/files/:fileId   | |
| 0.2.0   | GET    | /api/torrents/:torrentId/resume          | |
| 0.2.0   | GET    | /api/torrents/:torrentId/pause           | |
| 0.2.0   | DELETE | /api/torrents/:torrentId                 | |
| 0.2.0   | GET    | /api/torrents/:hash                      | |
| 0.2.0   | GET    | /api/torrents/:hash/files/:fileId        | |
| 0.2.0   | GET    | /api/torrents/:hash/resume               | |
| 0.2.0   | GET    | /api/torrents/:hash/pause                | |
| 0.2.0   | DELETE | /api/torrents/:hash                      | |
| 0.2.0   | POST   | /api/torrents/                           | |