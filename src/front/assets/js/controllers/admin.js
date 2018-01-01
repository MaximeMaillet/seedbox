'use strict';

angular
	.module('dragNTorrent')
	.controller('AdminController',
		['$scope', '$http', 'UserApi', 'notify', '$uibModal', '_',
		($scope, $http, UserApi, notify, $uibModal, _) => {
			$scope.users = [];
			$scope.userModel = {};
			let modalInstance = null;

			/**
			 * Load all users
			 */
			$scope.loadUsers = function() {
				UserApi.getAll()
					.then((users) => {
						$scope.users = users.map((user) => {
							user.is_validated = !!user.is_validated;
							return user;
						});
					});
			};

			/**
			 * Open modal for edit user
			 * @param id
			 */
			$scope.openEdit = function(id) {
				$scope.isCreated = false;
				$scope.userModel = _.cloneDeep(findUser(id));
				$scope.userModel.id = id;
				if($scope.userModel === null) {
					notify.danger('This user does not exists');
				}
				return openModalUser($scope);
			};

			/**
			 * Open modal for add user
			 */
			$scope.openCreate = function() {
				$scope.isCreated = true;
				$scope.userModel = {};
				return openModalUser($scope);
			};

			/**
			 * Create an user
			 */
			$scope.create = function() {
				UserApi.create($scope.userModel)
					.then((user) => {
						notify.success('User created');
						modalInstance.dismiss('cancel');
						$scope.users.push(user);
					})
					.catch((e) => {
						notify.danger(`Error : ${e.message}`);
					});
			};

			/**
			 * Edit an user
			 */
			$scope.edit = function() {
				UserApi.patch($scope.userModel.id, $scope.userModel)
					.then((user) => {
						notify.success('User updated');
						updateUser(user);
						if(modalInstance) {
							modalInstance.dismiss('cancel');
						}
					})
					.catch((e) => {
						notify.danger(`Error : ${e}`);
					});
			};

			/**
			 * Shortcut for valid user
			 * @param id
			 */
			$scope.valid = function(id) {
				$scope.userModel = _.cloneDeep(findUser(id));
				$scope.userModel.is_validated = true;
				$scope.edit();
			};

			$scope.remove = function(id) {
				UserApi.delete(id)
					.then((success) => {
						if(success) {
							notify.success('User deleted');
							$scope.users.splice($scope.users.indexOf(findUser(id)), 1);
						} else {
							notify.danger('User not deleted');
						}
					});
			};

			$scope.loadUsers();

			function findUser(id) {
				for(const i in $scope.users) {
					if($scope.users[i].id === id) {
						return $scope.users[i];
					}
				}
				return null;
			}

			function updateUser(_user) {
				Object.assign(findUser(_user.id), _user);
			}

			function openModalUser(scope) {
				modalInstance = $uibModal.open({
					animation: true,
					scope: scope,
					templateUrl: 'static/templates/user-add.html',
				});
				return modalInstance;
			}

		}]);