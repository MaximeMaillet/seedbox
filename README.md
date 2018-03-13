# Seedbox - Back end

Seedbox with [rTorrent](https://github.com/MaximeMaillet/rtorrent-daemon) + [dTorrent](https://github.com/MaximeMaillet/dtorrent).


# Workflow

* API
  * /api/users (TODO)

| Method | Endpoint                    | Params        |
|:------:| --------------------------- |:-------------:|
| POST   | /api/authenticate/login     | {email, password} |
| POST   | /api/authenticate/subscribe | {email, password} |
| GET    | /api/authenticate/confirm   | ?token= |
| POST   | /api/authenticate/forgot    | {email} |
| GET    | /api/authenticate/password  | ?token= |
| PATCH  | /api/authenticate/password  | {token, password} |
| GET    | /api/authenticate/logout    | |
|        |                             | |
| GET    | /api/users                  | |
| GET    | /api/users/:id              | |
| PATCH  | /api/users/:id              | {email, etc.} |
| DELETE | /api/users/:id              | |
|        |                             | |
| GET    | /api/torrents               | |
| GET    | /api/torrents/:id           | |
| POST   | /api/torrents/              | |
| PATCH  | /api/torrents/:id           | |
| DELETE | /api/torrents/:id           | |

# Roadmap

### Release 0.0.6

###### Refacto

* [x] Authenticate system (login, subscribe, forgot password, etc)
* [x] User model : replace username by email
* [x] Api /users
* [ ] Api /torrents

###### Upload

* [ ] Ajouter un/des torrents
  * [x] Avec un ou plusieurs fichiers .torrent
  * [ ] Avec un fichier .torrent + un fichier data
  * [ ] Avec un fichier .torrent et plusieurs fichier data

* [x] Blacklist/whitelist des tracker

###### Peristence

* [ ] Stocker upload de tout les torrents pour garder le ratio
* [ ] Historique et appairage quand l'user upload un torrent

###### User

* [ ] Diminuer l'espace disque d'un user quand il upload
* [ ] Télécharger un fichier data

###### Validation des torrents

* [ ] Valider ou supprimer l'ajout d'un torrent
  * [ ] Un admin peut ou non valider un torrent avant upload

###### Admin

* [ ] Récupérer info serveur comme l'espace qu'il reste



### Release 0.1.0 - alpha test

###### Upload

* [ ] Ajouter un/des torrents
  * [ ] Avec un fichier data

###### Torrent

* [ ] Mettre un torrent en pause
* [ ] Mettre un torrent en resume


### Release 0.2.0 - Streaming

* Générer des fichiers m3u8 (second temps)
* Send data by chunks


### Release 0.3.0

###### App mobile

* Recevoir un push quand un torrent est ajouté

###### Metadata

* Récupérer les méta data d'un film
* Photo, nom
* persistence


### Release 0.4.0

###### Module de recherche

* Elasticsearch 


###### Statistiques

* Torrent nombre de fois téléchargé
* Nombre de fois vue


### Release 0.7.0 - bêta test