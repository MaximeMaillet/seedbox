
angular.module('dragNTorrent')
	.controller('DragndropCtrl', ['$scope', '$http', 'connectListener', 'notify',
		function($scope, $http, connectionListener, notify) {

			$scope.title = 'Torrent Go!';
			$scope.torrentController = [];
			$scope.torrents = [];
			$scope.connection_attempts = 0;
			$scope.listenerConnected = false;

			$scope.insert = function(torrent) {
				$scope.$apply(() => {
					$scope.torrents.push(torrent);
				});
			};


			$scope.loaded_in_progress = false;
			$scope.loaded_done = true;
		}]);