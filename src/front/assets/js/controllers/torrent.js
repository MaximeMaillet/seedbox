'use strict';
angular
	.module('dragNTorrent')
	.controller('torrentController',
		['$scope', 'connectListener', 'notify', 'torrentApi',
		($scope, connectListener, notify, torrentApi) => {

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
	}]);