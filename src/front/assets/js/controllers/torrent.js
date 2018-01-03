'use strict';
angular
	.module('dragNTorrent')
	.controller('torrentController',
		['$scope', 'connectListener', 'notify', 'torrentApi', '$uibModal',
		($scope, connectListener, notify, torrentApi, $uibModal) => {

			$scope.isLoaded = false;
			let instanceModal = null;

			$scope.pauseTorrent = async function() {
				$scope.isLoaded = true;
				update(await torrentApi.pause($scope.bind.hash));

			};

			$scope.playTorrent = async function() {
				$scope.isLoaded = true;
				update(await torrentApi.play($scope.bind.hash));
			};

			$scope.removeTorrent = async function() {
				$scope.isLoaded = true;
				const success = await torrentApi.remove($scope.bind.hash);
				if(success) {
					$scope.$apply(() => {
						$scope.bind.removed = true;
						$scope.isLoaded = false;
					});
					notify.success('Torrent removed');
				}
			};

			$scope.infoTorrent = function() {
				instanceModal = $uibModal.open({
					animation: true,
					scope: $scope,
					size: 'lg',
					templateUrl: 'static/templates/modal-torrent.html',
				});
			};

			$scope.watch = function() {
				notify.danger('Get out on Netflix !');
			};

			$scope.download = function() {
				notify.danger('This is illegal !');
			};

			function update(torrent) {
				$scope.$apply(() => {
					$scope.bind = torrent;
					$scope.isLoaded = false;
				});
			}
	}]);