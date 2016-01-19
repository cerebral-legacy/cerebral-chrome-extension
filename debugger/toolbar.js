var DOM = React.DOM;

var ToolbarStyle = {
  backgroundColor: '#EEE',
  padding: '5px 0',
  borderTop: '1px solid #999',
  borderBottom: '1px solid #999',
  position: 'fixed',
  top: 0,
  width: '100%',
  zIndex: 999999
};

var ResetButton = {
  textDecoration: 'underline',
  cursor: 'pointer',
  marginRight: 10
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
      currentComputed: 0
    };
  },
  componentWillReceiveProps: function (nextProps) {
    this.setState({
      stepValue: nextProps.currentSignalIndex + 1
    });
  },
  toggleKeepState: function () {
    var src = 'var event = new Event("cerebral.dev.toggleKeepState");window.dispatchEvent(event);';
    chrome.devtools.inspectedWindow.eval(src, function(res, err) {
      if (err) {
        console.log(err);
      }
    });
  },
  resetStore: function () {
    var src = 'var event = new Event("cerebral.dev.resetStore");window.dispatchEvent(event);';
    chrome.devtools.inspectedWindow.eval(src, function(res, err) {
      if (err) {
        console.log(err);
      }
    });
  },
  rewrite: function () {
    var src = 'var event = new CustomEvent("cerebral.dev.rewrite", {detail: ' + (this.props.totalSignals - this.props.currentSignalIndex[0] - 1) + '});window.dispatchEvent(event);';
    chrome.devtools.inspectedWindow.eval(src, function(res, err) {
      if (err) {
        console.log(err);
      }
    }.bind(this));
  },
  logModel: function () {
    var src = 'var event = new Event("cerebral.dev.logModel");window.dispatchEvent(event);';
    chrome.devtools.inspectedWindow.eval(src, function(res, err) {
      if (err) {
        console.log(err);
      }
    });
  },
  logComputedPath: function (event) {
    var src = 'var event = new CustomEvent("cerebral.dev.logComputedPath", {detail: ' + JSON.stringify(this.props.computedPaths[event.target.value - 1]) + '});window.dispatchEvent(event);';
    chrome.devtools.inspectedWindow.eval(src, function(res, err) {
      if (err) {
        console.log(err);
      }
      this.forceUpdate();
    }.bind(this));
  },
  rememberLast: function () {
    var src = 'var event = new CustomEvent("cerebral.dev.rememberNow");window.dispatchEvent(event);';
    chrome.devtools.inspectedWindow.eval(src, function(res, err) {
      if (err) {
        console.log(err);
      }
    }.bind(this));
  },
  toggleDisabled: function () {
    var src =  'var event = new Event("cerebral.dev.toggleDisableDebugger");window.dispatchEvent(event);';
    chrome.devtools.inspectedWindow.eval(src, function(res, err) {
      if (err) {
        console.log(err);
      }
      this.optimisticRangeUpdate(index);
    }.bind(this));
  },
  renderComputed(path, index) {
    return DOM.option({
      value: index
    },
      path
    )
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
            DOM.button({
              disabled: this.props.isExecutingAsync,
              onClick: this.props.remember
            }, 'Go To')
          ),
          DOM.li({
              style: ToolbarItem
            },
            DOM.button({
              disabled: this.props.isExecutingAsync,
              onClick: this.rememberLast
            }, 'Go To Last')
          ),
          DOM.li({
              style: ToolbarItem
            },
            DOM.button({
              disabled: this.props.isExecutingAsync,
              onClick: this.rewrite
            }, 'Rewrite')
          ),
          DOM.li({
              style: ToolbarItem
            },
            DOM.button({
              disabled: this.props.isExecutingAsync,
              onClick: this.resetStore
            }, 'Reset')
          ),
          DOM.li({
              style: ToolbarItem
            },
            DOM.button({
              disabled: this.props.isExecutingAsync,
              onClick: this.logModel
            }, 'Model')
          ),
          this.props.computedPaths.length ? DOM.li({
            style: ToolbarItem
          },
            DOM.select({
              onChange: this.logComputedPath,
              value: this.state.currentComputed
            },
              ['Run a computed state...'].concat(this.props.computedPaths).map(this.renderComputed)
            )
          ) : null,
          DOM.li({
            style: ToolbarRightItem
          },
            DOM.button({
              onClick: this.toggleDisabled
            }, this.props.isDisabled ? 'activate' : 'disable')
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
              checked: !this.props.willKeepState
            }), ' reset on refresh')
          )
        )
      )
    );
  }
});
