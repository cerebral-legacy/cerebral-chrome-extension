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
  toggleKeepState: function () {
    chrome.extension.sendMessage({
      action: 'code',
      content: 'var event = new Event("cerebral.dev.toggleKeepState");window.dispatchEvent(event);',
      tabId: chrome.devtools.inspectedWindow.tabId
    });
  },
  toggleStoreState: function () {
    chrome.extension.sendMessage({
      action: 'code',
      content: 'var event = new Event("cerebral.dev.toggleStoreState");window.dispatchEvent(event);',
      tabId: chrome.devtools.inspectedWindow.tabId
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

    return DOM.div({
        style: ToolbarStyle
      },
      DOM.ul({
          style: ToolbarNav
        },
        DOM.li({
            style: ToolbarItem
          },
          this.props.currentSignalIndex + 1,
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
            onChange: this.props.toggleStoreState,
            checked: this.props.willStoreState
          }), 'store')
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
    );
  }
});
