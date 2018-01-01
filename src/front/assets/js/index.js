angular
	.module('dragNTorrent', [
		'ui.bootstrap'
	])
	.config(['$httpProvider', '$interpolateProvider',
		($httpProvider, $interpolateProvider) => {
			$interpolateProvider.startSymbol('{[{').endSymbol('}]}');
		}
	])
	.constant('_', window._)
	.run(($rootScope) => {
		$rootScope._ = window._;
	});
;