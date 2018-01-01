angular
	.module('dragNTorrent', [
		'ui.bootstrap'
	])
	.config(['$httpProvider', '$interpolateProvider',
		($httpProvider, $interpolateProvider) => {
			$httpProvider.defaults.withCredentials = true;
			$interpolateProvider.startSymbol('{[{').endSymbol('}]}');
		}
	])
	// .run(['$http', '$cookies',
	// 	($http, $cookies) => {
	// 		$http.defaults.headers.post['X-CSRFToken'] = $cookies.csrftoken;
	// 	}
	// ])
;