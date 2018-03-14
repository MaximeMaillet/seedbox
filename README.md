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

###### Upload

* [x] Ajouter un/des torrents
  * [x] Avec un ou plusieurs fichiers .torrent

* [x] Blacklist/whitelist des tracker

###### Peristence

* [x] Stocker upload de tout les torrents pour garder le ratio
* [ ] Historique et appairage quand l'user upload un torrent
  * [ ] Diminuer l'espace disque d'un user quand il upload

###### User

* [ ] Télécharger un fichier data

### Release 0.0.7

###### Refacto

* [ ] Api /torrents

###### Admin

* [ ] Récupérer info serveur comme l'espace qu'il reste

###### Validation des torrents

* [ ] Valider ou supprimer l'ajout d'un torrent
  * [ ] Un admin peut ou non valider un torrent avant upload



### Release 0.1.0 - alpha test

###### Upload

* [ ] Ajouter un/des torrents
  * [ ] Avec un fichier data + un/des tracker(s)
  * [ ] Avec un fichier .torrent + un fichier data
  * [ ] Avec un fichier .torrent et plusieurs fichier data

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