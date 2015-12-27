var DOM = React.DOM;

var debuggerStyle = {
  fontFamily: 'Consolas, Verdana',
  fontSize: '14px',
  fontWeight: 'normal',
  minHeight: '100%',
  backgroundColor: '#FFF',
  color: '#666',
  overflowY: 'auto',
  overflowX: 'hidden',
  boxSizing: 'border-box'
};

var DebuggerComponent = React.createClass({
  getInitialState: function () {
    return {
      currentSignalIndex: -1,
      signals: [],
      computedPaths: [],
      willStoreState: false,
      willKeepState: false,
      isExecutingAsync: false,
      disableDebugger: false
    };
  },
  componentDidMount: function () {
    var port = chrome.extension.connect({
        name: "Sample Communication" //Given a Name
    });

    // Listen to messages from the background page
    port.onMessage.addListener(function (message) {
      this.setState(JSON.parse(message));
    }.bind(this));

    var src = 'var event = new Event("cerebral.dev.requestUpdate");window.dispatchEvent(event);';
    chrome.devtools.inspectedWindow.eval(src, function(res, err) {
      if (err) {
        console.log(err);
      }
    });
  },
  render: function () {
    var currentSignalIndex = this.state.currentSignalIndex;
    var signals = this.state.signals || [];
    var signal = signals[currentSignalIndex];

    return DOM.div({
        style: debuggerStyle
      },
      React.createElement(ToolbarComponent, {
        willStoreState: this.state.willStoreState,
        willKeepState: this.state.willKeepState,
        currentSignalIndex: currentSignalIndex,
        totalSignals: signals.length,
        computedPaths: this.state.computedPaths || [],
        steps: signals.length,
        isExecutingAsync: this.state.isExecutingAsync,
        isDisabled: this.state.disableDebugger,
        isRemembering: this.state.isRemembering
      }),
      signal ? React.createElement(SignalComponent, {
        key: currentSignalIndex,
        signal: signal,
        isExecutingAsync: this.state.isExecutingAsync
      }) : DOM.span()
    );
  }
});
