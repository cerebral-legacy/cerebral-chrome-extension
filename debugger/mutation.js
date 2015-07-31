var DOM = React.DOM;

var LogLink = {
  textDecoration: 'underline',
  fontFamily: 'inherit',
  cursor: 'pointer',
  color: '#999'
};

var MutationStyle = {
  padding: '5px 10px',
  fontSize: '0.9em'
};

var MutationArgsStyle = {
  fontSize: '0.75em',
  color: '#888'
};

var mutationColors = {
  set: '#f0ad4e',
  push: '#286090',
  splice: '#d9534f',
  merge: '#5cb85c',
  unset: '#d9534f'
};

var MutationComponent = React.createClass({
  logPath: function(name, path, event) {
    event.preventDefault();
    var detail = {
      detail: {
        name: name,
        path: path
      }
    };
    chrome.extension.sendMessage({
      action: 'code',
      content: 'var event = new CustomEvent("cerebral.dev.logPath", ' + JSON.stringify(detail) + ');window.dispatchEvent(event);',
      tabId: chrome.devtools.inspectedWindow.tabId
    });
  },
  logArg: function(arg) {
    console.log(arg);
  },
  renderMutationArg: function(mutationArg, index) {
    var argString = JSON.stringify(mutationArg);
    if (argString.length > 50) {
      return DOM.a({
        key: index,
        style: {
          cursor: 'pointer'
        },
        onClick: this.logArg.bind(null, mutationArg)
      }, argString.substr(0, 50) + '...');
    } else {
      return argString;
    }
  },
  render: function() {

    var mutation = this.props.mutation;
    var mutationArgs = mutation.args.slice();
    var path = mutation.path;
    var color = mutationColors[mutation.name];
    var pathName = path.length ? path.join('.') : '$root';

    return DOM.li({
        style: MutationStyle
      },
      DOM.strong(null,
        DOM.span({
          style: {
            color: color
          }
        }, mutation.name),
        ' ',
        DOM.a({
          style: LogLink,
          onClick: this.logPath.bind(null, pathName, path)
        }, pathName),
        DOM.div({
          style: MutationArgsStyle
        }, mutationArgs.map(this.renderMutationArg))
      )
    )
  }
});
