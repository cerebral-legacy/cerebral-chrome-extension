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

var signalWrapperStyle = {
  paddingTop: 25,
  paddingBottom: 25
};

var DebuggerComponent = React.createClass({
  getInitialState: function () {
    return {
      currentSignalIndex: [-1, -1],
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
      console.log('got message!');
      var state = JSON.parse(message);
      state.signals = createSignalsStructure(state.signals || []);
      console.log(state.signals.length);
      if (!state.signals.length) {
        state.currentSignalIndex = [-1, -1];
      } else if (
        !this.state.signals.length ||
        this.state.currentSignalIndex[0] === this.state.signals.length - 1 ||
        state.currentSignalIndex === this.state.signals.length - 1
      ) {
        state.currentSignalIndex = [state.currentSignalIndex, state.signals[state.currentSignalIndex].length - 1];
      } else {
        state.currentSignalIndex = this.state.currentSignalIndex;
      }

      this.setState(state);
    }.bind(this));

    var src = 'var event = new Event("cerebral.dev.requestUpdate");window.dispatchEvent(event);';
    chrome.devtools.inspectedWindow.eval(src, function(res, err) {
      if (err) {
        console.log(err);
      }
    });
  },
  onSignalClick: function (columnIndex, signalIndex, event) {
    this.setState({
      currentSignalIndex: [columnIndex, signalIndex || 0]
    });
  },
  render: function () {
    var currentSignalIndex = this.state.currentSignalIndex;
    var signals = this.state.signals;
    var signal = signals.length ? signals[currentSignalIndex[0]][currentSignalIndex[1]] : null;

    signalWrapperStyle.paddingTop = signals.reduce(function (highest, column) {
      return highest > column.length ? highest : column.length;
    }, 1) * 37.5 + 30;

    return DOM.div({
          style: debuggerStyle
        },
        React.createElement(ToolbarComponent, {
          willStoreState: this.state.willStoreState,
          willKeepState: this.state.willKeepState,
          currentSignalIndex: currentSignalIndex,
          totalSignals: signals.length,
          computedPaths: this.state.computedPaths || [],
          isExecutingAsync: this.state.isExecutingAsync,
          isDisabled: this.state.disableDebugger,
          isRemembering: this.state.isRemembering
        }),
        React.createElement(SignalsComponent, {
          signals: this.state.signals,
          currentSignalIndex: currentSignalIndex,
          onSignalClick: this.onSignalClick,
          foo: 'bar'
        }),
        DOM.div({
          style: signalWrapperStyle
        },
          signal ? React.createElement(SignalComponent, {
            key: currentSignalIndex,
            signal: signal,
            isExecutingAsync: this.state.isExecutingAsync
          }) : DOM.span()
        )
      );
  }
});
