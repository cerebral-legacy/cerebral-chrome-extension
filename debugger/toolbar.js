var DOM = React.DOM;

var ToolbarStyle = {
  backgroundColor: '#EEE',
  padding: '5px',
  borderBottom: '1px solid #999'
};

var ResetButton = {
  textDecoration: 'underline',
  cursor: 'pointer'
};

var ToolbarNav = {
  listStyleType: 'none',
  padding: 0,
  margin: 0
};

var ToolbarItem = {
  display: 'inline-block',
  margin: '0 5px'
}

var ToolbarRightItem = {
  display: 'inline-block',
  margin: '0 5px',
  float: 'right'
};

var CollapseButton = {
  cursor: 'pointer',
  borderLeft: '1px solid #999',
  paddingLeft: '10px'
};

var ToolbarComponent = React.createClass({
  getInitialState: function () {
    return {
      stepValue: this.props.currentSignalIndex + 1 || 0,
    };
  },
  componentWillReceiveProps: function (nextProps) {
    this.setState({
      stepValue: nextProps.currentSignalIndex + 1
    });
  },
  toggleKeepState: function () {
    chrome.extension.sendMessage({
      action: 'code',
      content: 'var event = new Event("cerebral.dev.toggleKeepState");window.dispatchEvent(event);',
      tabId: chrome.devtools.inspectedWindow.tabId
    });
  },
  optimisticRangeUpdate: function (index) {
    this.setState({
      stepValue: index
    });
  },
  resetStore: function () {
    chrome.extension.sendMessage({
      action: 'code',
      content: 'var event = new Event("cerebral.dev.resetStore");window.dispatchEvent(event);',
      tabId: chrome.devtools.inspectedWindow.tabId
    });
  },
  render: function() {

    return DOM.div(null,
      DOM.div({
          style: ToolbarStyle
        },
        DOM.ul({
            style: ToolbarNav
          },
          DOM.li({
              style: ToolbarItem
            },
            this.state.stepValue,
            ' / ',
            this.props.totalSignals
          ),
          DOM.li({
              style: ToolbarItem
            }, !this.props.isRemembering &&
            (this.props.hasExecutingAsyncSignals /*|| this.props.recorder.isPlaying || this.props.recorder.isRecording*/) ?
            null :
            DOM.span({
              style: ResetButton,
              onClick: this.resetStore,
            }, 'reset')
          ),
          DOM.li({
              style: ToolbarRightItem
            },
            DOM.label(null, DOM.input({
              type: 'checkbox',
              style: {
                margin: '3px'
              },
              onChange: this.toggleKeepState,
              checked: this.props.willKeepState
            }), 'keep signals')
          )
        )
      ),
      React.createElement(SliderComponent, {
        isExecutingAsync: this.props.isExecutingAsync,
        optimisticRangeUpdate: this.optimisticRangeUpdate,
        willKeepState: this.props.willKeepState,
        value: this.state.stepValue,
        steps: this.props.steps,
        //recorder: this.state.recorder,
        isRemembering: this.props.isRemembering
      })
    );
  }
});
