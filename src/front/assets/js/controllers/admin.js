'use strict';

angular
	.module('dragNTorrent')
	.controller('AdminController',
		['$scope', '$http', 'UserApi', 'notify', '$uibModal',
		($scope, $http, UserApi, notify, $uibModal) => {
			$scope.users = [];
			$scope.userModel = {};

			$scope.loadUsers = function() {
				UserApi.getAll()
					.then((users) => {
						$scope.users = users;
					});
			};

			$scope.edit = function(id) {

			};

			$scope.create = function() {
				UserApi.create($scope.userModel)
					.then((success) => {
						if (success) {
							notify.info('User created');
						} else {
							notify.danger('User not created');
						}
					})
					.catch((e) => {
						notify.danger(`Error : ${e}`);
					});
			};

			$scope.add = function() {
				return $uibModal.open({
					animation: true,
					scope: $scope,
					templateUrl: 'static/templates/user-add.html',
				});
			};

			$scope.remove = function(id) {
				UserApi.delete(id)
					.then((success) => {
						if(success) {
							notify.info('User deleted');
						} else {
							notify.danger('User not deleted');
						}
					});
			};

			$scope.loadUsers();

		}]);