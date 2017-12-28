'use strict';

angular
	.module('dragNTorrent')
	.service('connectListener',
		[
		function() {

		this.startAllTorrent = function(token, emitter) {
			const source = new EventSource('/api/torrents/listener');
			emitter.onInit();

			source.addEventListener('error', (event) => {
				if (event.eventPhase === EventSource.CLOSED) {
					source.close();
					emitter.onClose();
				}
				else {
					source.close();
					emitter.onError(event);
				}
			}, false);

			source.addEventListener('message', (msg) => {
				const data = JSON.parse(msg.data);
				emitter.onEmit(data);

				if(data.event === 'close_connection') {
					source.close();
					emitter.onClose();
				}
			}, false);
		};
	}]);