## Roadmap

### Release 0.2.0

###### Bugfixes

* [x] Download : add extension in url for download file
* [x] Find and fix "Unhandled rejection" (promises loosed in univers)
* [x] Optimize socket.io
* [x] Optimize listener for transactions with db
* [x] Manager active and update via websocket
* [x] Add changelog for releases

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