'use strict';

angular
	.module('dragNTorrent')
	.service('UserApi', ['$http', function($http) {

		const url = '/api';

		function send(method, endpoint, data) {
			return $http({
				'method': method,
				'url': url+endpoint,
				'data': data,
				'withCredentials': true
			}).then((response) => {
				return response.data;
			});
		}

		return {
			login: function(username, password) {
				return send('POST', '/users/login', {username, password});
			},
			logout: function() {
				return send('POST', '/users/logout');
			},
			getAll: function() {
				return send('GET', '/users');
			},
			patch: function(id, model) {
				return send('PATCH', `/users/${id}`, model);
			},
			delete: function(id) {
				return send('DELETE', `/users/${id}`);
			},
			create: function(model) {
				return send('POST', '/users', model);
			}
		};
	}]);