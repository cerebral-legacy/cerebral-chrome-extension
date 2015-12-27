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

var ParallelStyle = {
  listStyleType: 'none',
  padding: '5px 5px 10px 0',
  borderLeft: '2px solid orange'
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
  logValue: function (valueString, event) {
    event.preventDefault();
    var src = 'console.log(JSON.parse(\'' + valueString + '\'))';
    chrome.devtools.inspectedWindow.eval(src, function(res, err) {
      if (err) {
        console.log(err);
      }
    });
  },
  renderValue: function (value) {
    return React.createElement(TreeView, {data: value}) || null;
  },
  renderOutputs: function (action) {
    if (!action.outputs) {
      return null;
    }
    return DOM.ul({
      style: OutputsStyle
    }, Object.keys(action.outputs).map(function (output, index) {
      // Opacity on paths not taken, outputPath
      return React.createElement(OutputPath, {
        key: index,
        action: action,
        output: output,
        renderAction: this.renderAction,
        renderValue: this.renderValue
      });

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
        index: index
      }, this.renderOutputs(action));
    }

  },
  render: function() {
    return DOM.div(null,
      DOM.h2({
        style: SignalStyle
      },
        DOM.span(null, this.props.signal.name),
        this.props.signal.isSync ? DOM.small({
          style: {
            color: 'orange'
          }
        }, this.props.signal.branches[0].name === 'setUrl' ? ' routed' : ' sync') : null
      ),
      DOM.ul({
        style: ActionsStyle
      }, this.props.signal.branches.map(this.renderAction))
    )
  }
});
