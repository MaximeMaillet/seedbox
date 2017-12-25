
angular.module('dragNTorrent')
	.directive('upload', ['$http', function($http) {
		return {
			restrict: 'E',
			replace: true,
			scope: {
				addTorrent: '&trAction',
				userToken: '=',
			},
			template: '<div class="droper">Drag here to upload</div>',
			link: function(scope, element, attrs, controllers) {

				const upload = function(files) {
					const data = new FormData();
					angular.forEach(files, (value) => {
						data.append('torrent', value);
					});

					data.append('token', scope.userToken);

					$http({
						method: 'POST',
						url: '/api/torrents',
						data: data,
						headers: {'Content-Type': undefined },
						transformRequest: angular.identity
					}).then((response) => {
						console.log(response.data.torrent);
					}).catch((error) => {
						console.log(error);
					});
				};

				element.on('dragover', (e) => {
					e.preventDefault();
					e.stopPropagation();
				});

				element.on('dragenter', (e) => {
					e.preventDefault();
					e.stopPropagation();
					element.addClass('hover');
				});

				element.on('dragleave', (e) => {
					e.preventDefault();
					e.stopPropagation();
					element.removeClass('hover');
				});

				element.on('drop', (e) => {
					e.preventDefault();
					e.stopPropagation();
					element.removeClass('hover');
					if (e.dataTransfer){
						if (e.dataTransfer.files.length > 0) {
							upload(e.dataTransfer.files);
						}
					}
					return false;
				});
			}
		};
	}]);