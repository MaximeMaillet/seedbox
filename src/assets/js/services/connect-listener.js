/**
 * Created by MaximeMaillet on 22/05/2017.
 */
"use strict";

angular
	.module('dragNTorrent')
	.service('connectListener', ['notify', function(notify) {

		this.connections = [];

		this.getTorrentConnection = (hash) => {
			for(var i=0; i<this.connections.length; i++) {
				if(this.connections[i].hash == hash) {
					return this.connections[i];
				}
			}
			throw new Error('Hash not found');
		};

		this.startAllTorrent = function(token, emitter) {
			var source = new EventSource('/listener');
			this.connections.push({
				token: token,
				source: source
			});

			emitter.onInit();

			source.addEventListener('error', function(event) {
				if (event.eventPhase == EventSource.CLOSED) {
					source.close();
					emitter.onClose();
				}
				else {
					source.close();
					emitter.onError(event);
				}
			}, false);

			source.addEventListener('message', function(msg) {
				var data = JSON.parse(msg.data);
				emitter.onEmit(data);

				if(data.event == 'close_connection') {
					source.close();
					emitter.onClose();
				}
			}, false);
		};

		this.start = (token, emitter) => {
			var source = new EventSource('http://192.168.1.42:5858/listener/client/open/'+token);
			this.connections.push({
				token: token,
				source: source
			});

			source.addEventListener('error', function(event) {
				if (event.eventPhase == EventSource.CLOSED) {
					notify.danger('[ConnectListener] Connection closed');
					emitter.onClose();
					source.close();
				}
			}, false);

			source.addEventListener('message', function(msg) {
				var data = JSON.parse(msg.data);
				console.log('Receive data');
				console.log(data);
				emitter.emit(data);

				if(data.event == 'close_connection') {
					notify.danger('[ConnectListener] Connection closed from server');
					source.close();
				}
			}, false);
		};

		this.stop = (token) => {
			try {
				var connection = this.getConnection(token);
				var index = this.connections.indexOf(connection);
				connection.source.close();
				this.connections.splice(index, 1);
				notify.danger('[ConnectListener] Close connection');
			}
			catch(err) {}
		};

		this.getConnection = (token) => {
			for(var i=0; i<this.connections.length; i++) {
				if(this.connections[i].token == token) {
					return this.connections[i];
				}
			}
			throw new Error('Token not found');
		};
	}]);