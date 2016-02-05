// Can use
// chrome.devtools.*
// chrome.extension.*

// Create a tab in the devtools area
var hasListener = false;
chrome.devtools.panels.create("Cerebral", "toast.png", "index.html", function(panel) {

  /*
  panel.onShown.addListener(function () {
    chrome.extension.sendMessage({
      action: 'script',
      content: 'inserted-script.js',
      tabId: chrome.devtools.inspectedWindow.tabId
    });
  });
  */

});
