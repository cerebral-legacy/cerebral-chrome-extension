// This is included and executed in the inspected page
(function (window) {

	if (window.CEREBRAL_INIT) {
		return;
	}

	window.addEventListener('cerebral.dev.initialized', function (event) {

		if (window.CEREBRAL_INIT) {
			return;
		}

		window.CEREBRAL_INIT = true;
		chrome.extension.sendMessage(event.detail, function(message){});

		window.addEventListener('cerebral.dev.update', function (event) {
			chrome.extension.sendMessage(event.detail, function(message){});
		});

	});

	var event = new Event('cerebral.dev.initialize');
	window.dispatchEvent(event);

}(window));
