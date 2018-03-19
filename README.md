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

## Roadmap

### Release 0.2.0

###### Bugfixes

* [ ] Download : add extension in url for download file
* [x] Find and fix "Unhandled rejection" (promises loosed in univers)
* [ ] Optimize socket.io
* [x] Optimize listener for transactions with db

###### Refacto
* [ ] Errors handlers via express-imp-router
* [x] Api /torrents

###### Admin
* [ ] Get data from server (size, ram, etc.)

###### Torrent
* [ ] Put torrent in pause
* [ ] Put torrent in play
* [ ] Pagination

###### Torrents validation
* [ ] Validate or remove when user add torrent
  * [ ] Admin can validate torrent
  * [ ] Admin can post torrent without validation

###### Multi-server

* [ ] add another rtorrent server for listen
* [ ] download from other server
  * [ ] add http/https in config
  * [ ] secure nginx for rtorrent


### Release 0.3.0 - alpha test

###### Upload
* [ ] Add one or many torrents
  * [ ] With data + tracker
  * [ ] With .torrent + one data
  * [ ] With .torrent + many data

###### Multi-server
* [ ] Upload to another server



### Release 0.4.0 - Streaming
* Send data by chunks
* To think ...


### Release 0.5.0

###### App mobile
* [ ] Webhook + events
* [ ] Get notifications when events

###### Metadata
* [ ] Get meta data from external api
* [ ] Picture, name, description, keywords
* No Persistence


### Release 0.6.0  - bêta test

###### Module de recherche

* [ ] Elasticsearch 


###### Statistiques

* [ ] Number of torrent/files downloaded
* [ ] Number of movie seeing


### After

* Custom loader for download