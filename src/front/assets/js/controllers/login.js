angular.module('dragNTorrent')
	.controller('LoginController', ['$scope', 'notify', 'UserApi',
		function($scope, notify, UserApi) {

			$scope.model = {
				username: '',
				password: '',
			};

			$scope.forgotPassword = function() {
				notify.info('Shame on you ! You lost ...');
			};

			$scope.subscribe = function() {
				notify.info('You should ask to God');
			};

			$scope.login = function() {
				UserApi.login($scope.model.username, $scope.model.password)
					.then((res) => {
						window.location = '/';
					})
					.catch((e) => {
						notify.danger(e.data);
					});
			};
		}]);