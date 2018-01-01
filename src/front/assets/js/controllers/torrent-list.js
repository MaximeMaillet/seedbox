'use strict';

angular
	.module('dragNTorrent')
	.controller('torrentListController',
		['$scope', 'torrentApi', 'notify', 'TorrentList', '$uibModal',
		($scope, torrentApi, notify, TorrentList, $uibModal) => {

			$scope.torrents = [];
			$scope.torrentModel = {};
			let modalInstance = null;

			/**
			 * Download torrents list about user
			 */
			$scope.loadTorrent = async() => {
				try {
					const torrents = await torrentApi.getList(true);
					$scope.$apply(() => {
						TorrentList.add(torrents);
						console.log(TorrentList.get());
						$scope.torrents = TorrentList.get();
					});
				} catch(e) {
					$scope.loaded_done = false;
					$scope.noloaded_message = 'dragNTorrent-server off';
					notify.danger(e.message, 'danger');
				}
			};

			$scope.openAdd = function() {
				modalInstance = $uibModal.open({
					animation: true,
					scope: $scope,
					templateUrl: 'static/templates/torrent-add.html',
				});
				return modalInstance;
			};

			$scope.fileNameChanged = (ele) => {
				const {files} = ele;
				const data = new FormData();

				for (let i = 0; i < files.length; i++) {
					data.append('torrents', files[i]);
				}
				torrentApi.create(data)
					.then((torrent) => {
						for(const i in torrent) {
							if(torrent[i].success) {
								notify.success(`Torrent added : ${torrent[i].torrent.name}`);
								$scope.torrents.push(Object.assign(torrent[i].torrent, {
									status: 'ok'
								}));
							}
							else if(!torrent[i].success && torrent[i].message === 'waiting') {
								notify.danger(`Torrent waiting : ${torrent[i].torrent.name}`);
								$scope.torrents.push(Object.assign(torrent[i].torrent, {
									status: torrent[i].message
								}));
							}
						}
						modalInstance.dismiss('cancel');
					})
					.catch((e) => {
						notify.danger(`Error : ${e.message}`);
					});
			};

			$scope.loadTorrent();
		}]);