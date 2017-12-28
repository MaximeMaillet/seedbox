'use strict';

angular
	.module('dragNTorrent')
	.factory('TorrentList',
		() => {
			const TorrentList = {
				add: (torrent) => {
					if(!this.torrents) {
						this.torrents = [];
					}
					if(torrent.length > 0) {
						for(let i=0; i<torrent.length; i++) {
							this.torrents.push(torrent[i]);
						}
					} else {
						this.torrents.push(torrent);
					}
				},
				set: (torrents) => {
					this.torrents = torrents;
				},
				get: () => {
					return this.torrents;
				},
				remove: (hash) => {
					for(let i=0; i<this.torrents.length; i++) {
						if(this.torrents[i].hash === hash) {
							return this.torrents.splice(i, 1);
						}
					}
				},
				getOne: (hash) => {
					for(let i=0; i<this.torrents.length; i++) {
						if(this.torrents[i].hash === hash) {
							return this.torrents[i];
						}
					}
				},
			};

			TorrentList.torrents = [];
			return TorrentList;
		}
	);