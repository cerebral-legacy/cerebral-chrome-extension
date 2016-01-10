// This is included and executed in the inspected page
(function (window) {
	var CEREBRAL_INIT = false;

  function initializeHook(window) {
    Object.defineProperty(window, '__CEREBRAL_DEVTOOLS_GLOBAL_HOOK__', {
      value: {
        signals: {}
      }
    });
  }

  var js = (
    ';(' + initializeHook.toString() + '(window))'
  );

  // This script runs before the <head> element is created, so we add the script
  // to <html> instead.
  var script = document.createElement('script');
  script.textContent = js;
  document.documentElement.appendChild(script);
  script.parentNode.removeChild(script);

	var initialized = function (event) {

		if (CEREBRAL_INIT) {
			chrome.extension.sendMessage(event.detail, function(message){});
			return;
		}

		CEREBRAL_INIT = true;

		chrome.extension.sendMessage(event.detail, function(message){});

		var update = function (event) {
			if (!event.detail) {
				throw new Error('You have to pass a serializeable object to a signal. Did you pass a mouse event maybe?');
				return;
			}
			try {
				chrome.extension.sendMessage(event.detail, function(message){});
			} catch (e) {
				console.log('FAILED', e);
				window.removeEventListener('cerebral.dev.update', update);
				window.removeEventListener('cerebral.dev.initialized', initialized);
			}
		};
		window.addEventListener('cerebral.dev.update', update);

	};
	window.addEventListener('cerebral.dev.cerebralPong', initialized);
	window.addEventListener('cerebral.dev.cerebralPing', function () {
		var event = new Event('cerebral.dev.debuggerPing');
		window.dispatchEvent(event);
	});

	var event = new Event('cerebral.dev.debuggerPing');
	window.dispatchEvent(event);
}(window));
