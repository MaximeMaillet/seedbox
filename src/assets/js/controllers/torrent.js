'use strict';
angular
	.module('dragNTorrent')
	.controller('torrentController',
		['$scope', 'connectListener', 'notify', 'torrentApi', '$uibModal',
		($scope, connectListener, notify, torrentApi, $uibModal) => {

			this.getHash = () => {
				return $scope.bind.hash;
			};

			this.finished = (newTorrent) => {
				$scope.$apply(() => {
					$scope.bind.progress = 100;
					$scope.bind.mb_downloaded = newTorrent.mb_total;
					$scope.bind.playing = false;
					$scope.bind.isDone = true;
				});
			};

			this.progress = (newTorrent) => {
				$scope.$apply(() => {
					if($scope.bind.progress < 100) {
						if(newTorrent.progress != undefined) {
							$scope.bind.progress = newTorrent.progress;
						}

						if(newTorrent.mb_downloaded != undefined) {
							$scope.bind.mb_downloaded = newTorrent.mb_downloaded;
						}

						$scope.bind.playing = newTorrent.playing;
						$scope.bind.is_finished = newTorrent.isDone;
					}
				});
			};

			this.update = (newTorrent) => {
				$scope.$apply(() => {
					$scope.bind.progress = newTorrent.progress;
					$scope.bind.mb_uploaded = newTorrent.mb_uploaded;
					$scope.bind.mb_downloaded = newTorrent.mb_downloaded;
					$scope.bind.mb_total = newTorrent.mb_total;
					$scope.bind.playing = newTorrent.playing;
					$scope.bind.isDone = newTorrent.isDone;
				});

			};
			
			$scope.pauseTorrent = function() {
				torrentApi.pause($scope.bind.hash);
				$scope.bind.is_active = false;
			};

			$scope.playTorrent = function() {
				torrentApi.play($scope.bind.hash);
				$scope.bind.is_active = true;
			};

			$scope.removeTorrent = function() {
				torrentApi.remove($scope.bind.hash);
			};

			this.getData = () => {
				const modalInstance = $uibModal.open({
					ariaLabelledBy: 'modal-title',
					ariaDescribedBy: 'modal-body',
					templateUrl: 'myModalContent.html'
				});

			};
	}]);