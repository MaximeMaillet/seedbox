angular
	.module('dragNTorrent')
	.directive('torrent', () => {
		return {
			restrict: 'E',
			scope: {
				bind: '='
			},
			templateUrl: 'static/templates/torrent.html',
			controller: 'torrentController',
			controllerAs: 'torrentCtrl'
		};
	});