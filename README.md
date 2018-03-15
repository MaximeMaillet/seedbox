# Seedbox - Back end

Seedbox with [rTorrent](https://github.com/MaximeMaillet/rtorrent-daemon) + [dTorrent](https://github.com/MaximeMaillet/dtorrent).


# Workflow

* API
  * /api/users (TODO)

| Release | Method | Endpoint                    | Params        |
|:-------:|:------:| --------------------------- |:-------------:|
| 0.0.6   | POST   | /api/authenticate/login     | {email, password} |
| 0.0.6   | POST   | /api/authenticate/subscribe | {email, password} |
| 0.0.6   | GET    | /api/authenticate/confirm   | ?token= |
| 0.0.6   | POST   | /api/authenticate/forgot    | {email} |
| 0.0.6   | GET    | /api/authenticate/password  | ?token= |
| 0.0.6   | PATCH  | /api/authenticate/password  | {token, password} |
| 0.0.6   | GET    | /api/authenticate/logout    | |
| 0.0.6   | GET    | /api/users                  | |
| 0.0.6   | GET    | /api/users/:id              | |
| 0.0.6   | PATCH  | /api/users/:id              | {email, etc.} |
| 0.0.6   | DELETE | /api/users/:id              | |
| 0.0.6   | GET    | /api/torrents               | |
| 0.0.6   | GET    | /api/torrents/:id           | |
| 0.0.6   | POST   | /api/torrents/              | |
| 0.0.7   | PATCH  | /api/torrents/:id           | |
| 0.0.7   | DELETE | /api/torrents/:id           | |

# Roadmap

### Release 0.0.6

###### Refacto

* [x] Authenticate system (login, subscribe, forgot password, etc)
* [x] User model : replace username by email
* [x] Api /users
* [ ] Authentication with JWT

###### Upload

* [x] Ajouter un/des torrents
  * [x] Avec un ou plusieurs fichiers .torrent

* [x] Blacklist/whitelist des tracker

###### Peristence

* [x] Stocker upload de tout les torrents pour garder le ratio
* [x] Historique et appairage quand l'user upload un torrent
  * [x] Diminuer l'espace disque d'un user quand il upload

###### User
* [ ] Download torrent (data)


### Release 0.0.7

###### Refacto
* [ ] Api /torrents

###### Admin
* [ ] Get data from server (size, ram, etc.)

###### Torrent
* [ ] Put torrent in pause
* [ ] Put torrent in play

###### Torrents validation
* [ ] Validate or remove when user add torrent
  * [ ] Admin can validate torrent
  * [ ] Admin can post torrent without validation


### Release 0.1.0 - alpha test

###### Upload
* [ ] Add one or many torrents
  * [ ] With data + tracker
  * [ ] With .torrent + one data
  * [ ] With .torrent + many data


### Release 0.2.0 - Streaming
* Send data by chunks
* To think ...


### Release 0.3.0

###### App mobile
* [ ] Webhook + events
* [ ] Get notifications when events

###### Metadata
* [ ] Get meta data from external api
* [ ] Picture, name, description, keywords
* No Persistence


### Release 0.4.0

###### Module de recherche

* [ ] Elasticsearch 


###### Statistiques

* [ ] Number of torrent downloaded
* [ ] Number of movie seeing


### Release 0.7.0 - bêta test