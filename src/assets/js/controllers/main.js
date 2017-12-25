/**
 * Created by MaximeMaillet on 20/05/2017.
 */
'use strict';
angular.module('dragNTorrent')
	.controller('MainCtrl',
		['$scope',
		function($scope) {

			const eventsToUpdate = ['paused', 'restart', 'update'];
			$scope.torrentController = [];
			$scope.torrents = [];
			$scope.connection_attempts = 0;
			$scope.listenerConnected = false;

			$scope.loaded_in_progress = false;
			$scope.loaded_done = true;



			// $scope.insert = function(torrent) {
			// 	console.log(torrent);
			// 	$scope.$apply(() => {
			// 		$scope.torrents.push(torrent);
			// 	});
			// };
			//
			// $scope.update = function(torrent) {
			// 	for(let i=0; i< $scope.torrentController.length; i++) {
			// 		if($scope.torrentController[i].getHash() == torrent.hash) {
			// 			$scope.torrentController[i].update(torrent);
			// 		}
			// 	}
			// };
			//
			// $scope.download = function(torrent) {
			// 	for(let i=0; i< $scope.torrentController.length; i++) {
			// 		if($scope.torrentController[i].getHash() == torrent.hash) {
			// 			$scope.torrentController[i].progress(torrent);
			// 		}
			// 	}
			// };
			//
			// $scope.finish = function(torrent) {
			// 	for(let i=0; i< $scope.torrentController.length; i++) {
			// 		if($scope.torrentController[i].getHash() == torrent.hash) {
			// 			$scope.torrentController[i].finished(torrent);
			// 		}
			// 	}
			// };
			//
			// $scope.remove = function(torrent) {
			// 	$scope.$apply(() => {
			// 		$scope.torrents.splice($scope.torrents.indexOf(torrent), 1);
			// 	});
			// };
	}]);