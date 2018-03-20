# Seedbox - Back end

Seedbox with [rTorrent](https://github.com/MaximeMaillet/rtorrent-daemon) + [dTorrent](https://github.com/MaximeMaillet/dtorrent).

## API

| Release | Method | Endpoint                    | Params        |
|:-------:|:------:| --------------------------- |:-------------:|
| 0.1.0   | POST   | /api/authenticate/login     | {email, password} |
| 0.1.0   | POST   | /api/authenticate/subscribe | {email, password} |
| 0.1.0   | GET    | /api/authenticate/confirm   | ?token= |
| 0.1.0   | POST   | /api/authenticate/forgot    | {email} |
| 0.1.0   | GET    | /api/authenticate/password  | ?token= |
| 0.1.0   | PATCH  | /api/authenticate/password  | {token, password} |
| 0.1.0   | GET    | /api/authenticate/logout    | |
| 0.1.0   | GET    | /api/users                  | |
| 0.1.0   | GET    | /api/users/:id              | |
| 0.1.0   | PATCH  | /api/users/:id              | {email, etc.} |
| 0.1.0   | DELETE | /api/users/:id              | |
| 0.1.0   | GET    | /api/torrents               | |
| 0.1.0   | GET    | /api/torrents/:id           | |
| 0.1.0   | POST   | /api/torrents/              | |
| 0.1.0   | DELETE | /api/torrents/:id           | |
| 0.1.0   | GET    | /api/torrents/:id/download/:idFile | |
| 0.2.0   | GET    | /api/torrents/:id/play      | |
| 0.2.0   | GET    | /api/torrents/:id/pause     | |