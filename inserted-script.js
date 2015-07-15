// This is included and executed in the inspected page
(function (window) {

	var isInit = false;

	window.addEventListener('cerebral.dev.initialized', function (event) {

		if (isInit) {
			return;
		}

		isInit = true;

		console.log(event.detail);
		chrome.extension.sendMessage(event.detail, function(message){});

		window.addEventListener('cerebral.dev.update', function (event) {
			chrome.extension.sendMessage(event.detail, function(message){});
		});

	});

	var event = new Event('cerebral.dev.initialize');
	window.dispatchEvent(event);

}(window));
