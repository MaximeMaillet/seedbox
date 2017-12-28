angular.module('dragNTorrent')
	.controller('AuthCtrl', ['$scope', '$http', 'connectListener', 'notify',
		function($scope, $http, connectionListener, notify) {

			/**
			 * Display dashboard, load torrents and open connection
			 */
			$scope.connect = () => {

				$scope.displayLoaded();
				$scope.connection_attempts++;
				$scope.seconde_before_new_connect = 10;

				if($scope.connection_attempts >= 5) {
					var attemptConnectionInterval = setInterval(() => {
						$scope.$apply(() => {
							$scope.seconde_before_new_connect--;
							if($scope.seconde_before_new_connect == 0) {
								$scope.connection_attempts = 0;
								$scope.noloaded_message = 'Aller go !!!!';
								clearInterval(attemptConnectionInterval);
							}
						});
					}, 1000);
				}

				getToken()
					.then((user) => {
						//$scope.displayDone();
						//$scope.user = user;
						//$scope.loadTorrent();
						//$scope.connectListener();
					})
					.catch((error) => {
						$scope.$apply(() => {
							$scope.loaded_in_progress = false;
							$scope.loaded_done = false;
							$scope.noloaded_message = error;
						});
					});
			};


			/**
			 * Put dashboard on loaded
			 */
			$scope.displayLoaded = () => {
				$scope.loaded_in_progress = true;
				$scope.loaded_done = false;
			};

			/**
			 * Put dashboard on ready
			 */
			$scope.displayReady = () => {
				$scope.loaded_in_progress = false;
				$scope.loaded_done = true;
			};

			function getToken() {
				return new Promise((resolve, reject) => {
					const token = localStorage.getItem('dragNTorrent.token');
					if(!token) {
						$http({
							method: 'POST',
							url: '/api/token'
						}).then((response) => {
							localStorage.setItem('dragNTorrent.token', response.data.token);
							resolve(response.data);
						}, (response) => {
							reject(response.data.message);
						});
					}
					else {
						// TODO : get user data
						resolve({
							token: token
						});
					}

					setTimeout(() => {
						reject('Server time out');
					}, 1000);

				});
			}
	}]);