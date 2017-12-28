'use strict';

angular
	.module('dragNTorrent')
	.service('UserApi', ['$http', function($http) {

		const url = '/api';

		function send(method, endpoint, data) {
			return $http({
				'method': method,
				'url': url+endpoint,
				'data': data
			}).then((response) => {
				return response.data;
			});
		}

		return {
			login: function(username, password) {
				return send('POST', '/login', {username, password});
			},
			logout: function() {
				return send('POST', '/logout');
			},
		}
	}]);