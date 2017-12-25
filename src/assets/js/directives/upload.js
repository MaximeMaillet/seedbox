
angular.module('dragNTorrent')
	.directive('upload', ['$http', function($http) {
		return {
			restrict: 'E',
			replace: true,
			scope: {
				addTorrent: '&trAction'
			},
			controller: 'DragndropCtrl',
			controllerAs: 'dnd',
			require: '?ngModel',
			template: '<div class="droper">Drag here to upload</div>',
			link: function(scope, element, attrs, ngModel) {

				element.on('dragover', (e) => {
					e.preventDefault();
					e.stopPropagation();
				});

				element.on('dragenter', (e) => {
					e.preventDefault();
					e.stopPropagation();
				});

				element.on('drop', (e) => {
					e.preventDefault();
					e.stopPropagation();
					if (e.dataTransfer){
						if (e.dataTransfer.files.length > 0) {
							upload(e.dataTransfer.files);
						}
					}
					return false;
				});

				const upload = function(files) {

					const data = new FormData();
					angular.forEach(files, (value) => {
						data.append('torrent', value);
					});

					data.append('token', ngModel.$viewValue);

					$http({
						method: 'PUT',
						url: 'http://localhost:8080/api/torrent',
						data: data,
						headers: {'Content-Type': undefined },
						transformRequest: angular.identity
					}).then((response) => {

						console.log(response.data.torrent);
						scope.$parent.torrents.push(response.data.torrent);

					}).catch((error) => {
						console.log(error);
					});
				};
			}
		};
	}]);