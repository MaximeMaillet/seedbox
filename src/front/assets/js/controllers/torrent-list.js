'use strict';

angular
	.module('dragNTorrent')
	.controller('torrentListController',
		['$scope', 'torrentApi', 'notify', 'TorrentList', '$uibModal',
		($scope, torrentApi, notify, TorrentList, $uibModal) => {

			$scope.torrents = [];
			$scope.torrentModel = new FormData();
			$scope.model = {};
			let modalInstance = null;
			$scope.step = {
				zero: true,
				one: false,
				two: false,
				three: false
			};

			/**
			 * @param step
			 */
			$scope.updateStep = (step) => {
				Object.keys($scope.step).forEach((key) => {
					$scope.step[key] = key === step;
				});

				if(step !== 'zero') {
					$scope.torrentModel = new FormData();
				}
			};

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

			/**
			 * Add torrent
			 * @param ele
			 */
			$scope.torrentsAdded = (ele) => {
				const {files} = ele;
				for (let i = 0; i < files.length; i++) {
					$scope.torrentModel.append('torrents', files[i]);
					$scope.model.hasTorrent = true;
				}
			};

			/**
			 * Add data
			 * @param ele
			 */
			$scope.filesAdded = (ele) => {
				const {files} = ele;
				for (let i = 0; i < files.length; i++) {
					$scope.torrentModel.set('files', files[i]);
					$scope.model.hasFile = true;
				}
			};

			/**
			 * Add torrent, torrent+file or file
			 */
			$scope.add = () => {
				Object.keys($scope.step).forEach((key) => {
					if($scope.step[key]) {
						if (
							(key === 'two' && $scope.model.hasFile && $scope.model.hasTorrent)
							|| (key === 'one' && $scope.model.hasTorrent)
						) {
							create();
						}
						else if(key === 'three' && $scope.model.hasFile && $scope.model.tracker) {
							$scope.torrentModel.append('tracker', $scope.model.tracker);
							create();
						}
						else {
							notify.danger('You need upload torrent + data');
						}
					}
				});
			};

			/**
			 * Open modal for add torrent
			 * @return {*}
			 */
			$scope.openAdd = function() {
				modalInstance = $uibModal.open({
					animation: true,
					scope: $scope,
					templateUrl: 'static/templates/torrent-add.html',
				});
				return modalInstance;
			};

			function create() {
				torrentApi.create($scope.torrentModel)
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
			}

			$scope.loadTorrent();
		}]);