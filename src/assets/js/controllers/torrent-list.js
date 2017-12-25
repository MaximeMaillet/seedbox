'use strict';

angular
	.module('dragNTorrent')
	.controller('torrentListController',
		['$scope', 'torrentApi', 'notify', 'TorrentList',
		($scope, torrentApi, notify, TorrentList) => {

			$scope.torrents = [];

			/**
			 * Download torrents list about user
			 */
			$scope.loadTorrent = async() => {
				try {
					const torrents = await torrentApi.getList(true);
					$scope.$apply(() => {
						TorrentList.add(torrents);
						$scope.torrents = TorrentList.get();
					});
				} catch(e) {
					$scope.loaded_done = false;
					$scope.noloaded_message = 'dragNTorrent-server off';
					notify.danger('????', 'danger');
				}
			};
			$scope.loadTorrent();
		}]);