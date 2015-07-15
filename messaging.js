var render = function (props) {
  React.render(React.createElement(DebuggerComponent, props), document.querySelector('#app'));
};

(function createChannel() {
    //Create a port with background page for continous message communication
    var port = chrome.extension.connect({
        name: "Sample Communication" //Given a Name
    });

    // Listen to messages from the background page
    port.onMessage.addListener(function (message) {
      render(message.props);
    });

}());

render();
