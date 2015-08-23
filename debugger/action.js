var DOM = React.DOM;

var ActionStyle = {
  position: 'relative',
  boxSizing: 'border-box',
  marginTop: 10
};

var ActionHeaderStyle = {
  padding: '3px 10px',
  backgroundColor: '#FCFCFC',
  margin: 0,
  color: '#888',
  fontSize: '1em',
  borderTop: '1px solid #EEE',
  borderBottom: '1px solid #EEE'
};

var MutationsStyle = {
  listStyleType: 'none',
  paddingLeft: 0
};

var OutputStyle = {
  paddingLeft: 10,
  fontSize: 12,
  height: 25,
  fontFamily: 'inherit',
  lineHeight: '25px',
  borderTop: '1px solid #EEE',
  borderBottom: '1px solid #EEE',
  backgroundColor: '#FEFEFE',
  marginTop: 10
};

var ActionComponent = React.createClass({
  renderMutation: function (mutation, index) {
    return React.createElement(MutationComponent, {
      mutation: mutation,
      index: index,
      action: this.props.action,
      key: index,
      getValue: this.props.getValue
    });
  },
  logOutput: function (outputString, event) {
    event.preventDefault();
    chrome.extension.sendMessage({
      action: 'code',
      content: 'console.log(JSON.parse(\'' + outputString + '\'))',
      tabId: chrome.devtools.inspectedWindow.tabId
    });
  },
  render: function() {

    var outputString = this.props.action.output ? JSON.stringify(this.props.action.output) : '';
    var output = null;

    if (outputString.length > 50) {
      output = DOM.a({
        style: {
          cursor: 'pointer',
          textDecoration: 'underline'
        },
        onClick: this.logOutput.bind(null, outputString)
      }, outputString.substr(0, 50) + '...');
    } else {
      output = outputString;
    }

    return DOM.li({
        style: ActionStyle
      },
      DOM.h3({
          style: ActionHeaderStyle
        }, (this.props.index + 1) + '. ', this.props.action.name,
        DOM.small({
            style: {
              color: this.props.action.isAsync ? 'orange' : '#555'
            }
          },
          this.props.action.isAsync &&
          this.props.isExecutingAsync &&
          this.props.index === this.props.signal.actions.length - 1 ?
          ' async action running' :
          this.props.action.isAsync ? ' async' :
          null
        )
      ),
      DOM.ul({
        style: MutationsStyle
      }, this.props.action.mutations.map(this.renderMutation)),
      output ? DOM.div({
        style: OutputStyle
      },
        DOM.strong(null, this.props.action.path ? this.props.action.path.toUpperCase() + ': ': 'OUTPUT: '),
        output
      ) : null
    )
  }
});
