'use strict';

angular
	.module('dragNTorrent')
	.controller('connectionListenerController',
		['$scope', 'torrentApi', 'notify', 'TorrentList',
		($scope, torrentApi, notify, TorrentList) => {

				const socket = io.connect('http://localhost:8080');

				// setTimeout(() => {
				// 	const t = TorrentList.get();
				// 	for(const i in t) {
				// 		$scope.$apply(() => {
				// 			t[i].removed = true;
				// 			console.log('ok');
				// 		});
				// 	}
				// }, 1000);

				socket.on('torrent-added', (data) => {
					const torrent = JSON.parse(data);
					$scope.$apply(() => {
						TorrentList.add(torrent);
					});
				});

				socket.on('torrent-updated', (data) => {
					const newTorrent = JSON.parse(data);
					$scope.$apply(() => {
						const torrent = TorrentList.getOne(newTorrent.hash);
						torrent.progress = newTorrent.progress;
						torrent.uploaded = newTorrent.uploaded;
						torrent.downloaded = newTorrent.downloaded;
						torrent.ratio = newTorrent.ratio;
						torrent.playing = newTorrent.playing;
					});
				});

				socket.on('torrent-finished', (data) => {
					const newTorrent = JSON.parse(data);
					const torrent = TorrentList.getOne(newTorrent.hash);
					$scope.$apply(() => {
						torrent.finished = newTorrent.finished;
					});
				});

				socket.on('torrent-removed', (data) => {
					const _torrent = JSON.parse(data);
					const torrent = TorrentList.getOne(_torrent.hash);
					$scope.$apply(() => {
						torrent.removed = true;
						setTimeout(() => {
							TorrentList.remove(torrent.hash);
						}, 1800);
					});
				});
			}]);