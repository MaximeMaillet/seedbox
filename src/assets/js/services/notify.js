/**
 * Created by MaximeMaillet on 25/05/2017.
 */
"use strict";

angular
	.module('dragNTorrent')
	.service('notify', function() {

		this.danger = (message) => {
			notify('danger', message);
		};

		this.info = (message) => {
			notify('info', message);
		};

		this.success = (message) => {
			notify('success', message);
		};

		function notify(type, message) {
			$.notify({message: message},{
				type: type || 'info',
				allow_dismiss: false,
				newest_on_top: true,
				placement: {
					from: "bottom",
					align: "right"
				},
				delay: 2000,
				timer: 1000,
				animate: {
					enter: 'animated fadeInDown',
					exit: 'animated fadeOutUp'
				}
			});
		}

	});