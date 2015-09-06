var DOM = React.DOM;

var SignalStyle = {
  color: '#666',
  marginBottom: '0',
  fontSize: '1.25em',
  padding: '0 10px'
};

var ActionsStyle = {
  listStyleType: 'none',
  padding: 5,
  margin: 0
};

var OutputActionsStyle = {
  listStyleType: 'none',
  padding: '5px 5px 5px 0',
  border: '1px solid #EEE',
  margin: '0 0 5px 0'
};

var OutputsStyle = {
  listStyleType: 'none',
  padding: 5,
  margin: '0 5px',
};

var OutputStyle = {
  fontSize: 12
};

var ParallelStyle = {
  listStyleType: 'none',
  padding: '5px 5px 10px 0',
  borderLeft: '2px solid #DDD'
};

var ParallelWrapperStyle = {
  marginTop: 10
};

var OutputTitle = {
  margin: 0,
  fontSize: 12,
  display: 'inline'
};

var ValueStyle = {
  fontSize: 12
}

var SignalComponent = React.createClass({
  renderFPS: function(duration) {

    var color = duration >= 16 ? '#d9534f' : duration >= 10 ? '#f0ad4e' : '#5cb85c';
    return DOM.strong(null, DOM.small({
      style: {
        color: color
      }
    }, ' (' + duration + 'ms)'));
  },
  logValue: function (valueString, event) {
    event.preventDefault();
    chrome.extension.sendMessage({
      action: 'code',
      content: 'console.log(JSON.parse(\'' + valueString + '\'))',
      tabId: chrome.devtools.inspectedWindow.tabId
    });
  },
  renderValue: function (value) {
    var valueString = value ? JSON.stringify(value) : '';
    var output = null;

    if (valueString.length > 50) {
      output = DOM.a({
        style: {
          cursor: 'pointer',
          textDecoration: 'underline'
        },
        onClick: this.logValue.bind(null, valueString)
      }, valueString.substr(0, 50) + '...');
    } else {
      output = valueString;
    }

    return DOM.span({style: ValueStyle}, output);
  },
  renderOutputs: function (action) {
    if (!action.outputs) {
      return null;
    }
    return DOM.ul({
      style: OutputsStyle
    }, Object.keys(action.outputs).map(function (output, index) {
      // Opacity on paths not taken, outputPath
      var outputStyle = merge({}, OutputStyle, {
        opacity: action.hasExecuted && output === action.outputPath ? '1' : '0.5'
      });
      return DOM.li({
        key: index,
        style: outputStyle
      }, DOM.h4({style: OutputTitle}, '⇣ ' + output + ': '), this.renderValue(action.output), DOM.ul({
        style: OutputActionsStyle
      }, action.outputs[output].map(this.renderAction)));

    }, this));
  },
  renderAction: function (action, index) {

    if (Array.isArray(action)) {
      return DOM.li({
        style: ParallelWrapperStyle
      }, DOM.ul({
        style: ParallelStyle
      }, action.map(this.renderAction)))
    } else {
      return React.createElement(ActionComponent, {
        action: action,
        renderValue: this.renderValue,
        key: index,
        index: index,
        getValue: this.props.getValue
      }, this.renderOutputs(action));
    }

  },
  render: function() {

    return DOM.div(null,
      DOM.h2({
        style: SignalStyle
      }, DOM.span(null, this.props.signal.name, this.renderFPS(this.props.signal.duration))),
      DOM.ul({
        style: ActionsStyle
      }, this.props.signal.branches.map(this.renderAction))
    )
  }
});
