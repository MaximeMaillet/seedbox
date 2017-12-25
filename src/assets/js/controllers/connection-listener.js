'use strict';

angular
	.module('dragNTorrent')
	.controller('connectionListenerController',
		['$scope', 'torrentApi', 'connectListener', 'notify', 'TorrentList',
			($scope, torrentApi, connectListener, notify, TorrentList) => {
				/**
				 * Open torrent listener
				 */
				$scope.connectListener = () => {
					connectListener.startAllTorrent(null, {
						onInit: function() {
							$scope.listenerConnected = true;
						},
						onClose: function() {
							$scope.$apply(() => {
								$scope.listenerConnected = false;
							});
							notify.danger('Connection torrents close');
						},
						onError: function(event) {
							$scope.$apply(() => {
								$scope.listenerConnected = false;
							});
							notify.danger('Error! Connection closed');
						},
						onEmit: function(data) {
							switch(data.event) {
								case 'insert':
									$scope.insert(data.torrent);
									break;
								case 'upload':
									$scope.$apply(() => {
										const torrent = TorrentList.getOne(data.torrent.hash);
										const newTorrent = data.torrent;
										torrent.progress = newTorrent.progress;
										torrent.mb_uploaded = newTorrent.mb_uploaded;
										torrent.mb_downloaded = newTorrent.mb_downloaded;
										torrent.ratio = newTorrent.ratio;
										torrent.playing = newTorrent.playing;
										torrent.is_finished = newTorrent.is_finished;
									});
									break;
								case 'download':
									$scope.download(data.torrent);
									break;
								case 'finish':
									$scope.finish(data.torrent);
									break;
								case 'remove':
									$scope.$apply(() => {
										TorrentList.remove(data.torrent.hash);
									});
									break;
							}
						}
					});
				};

				$scope.connectListener();
			}]);