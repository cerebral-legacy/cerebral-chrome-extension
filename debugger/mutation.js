var DOM = React.DOM;

var LogLink = {
  textDecoration: 'underline',
  fontFamily: 'inherit',
  cursor: 'pointer',
  color: '#999'
};

var MutationStyle = {
  padding: '5px 10px',
  fontSize: 12
};

var MutationArgsStyle = {
  fontSize: 11,
  color: '#888',
  fontWeight: 'normal'
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
    var src = 'var event = new CustomEvent("cerebral.dev.logPath", ' + JSON.stringify(detail) + ');window.dispatchEvent(event);';
    chrome.devtools.inspectedWindow.eval(src, function(res, err) {
      if (err) {
        console.log(err);
      }
    });
  },
  logArg: function(argString, event) {
    event.preventDefault();
    var src = 'console.log(JSON.parse(\'' + argString + '\'))';
    chrome.devtools.inspectedWindow.eval(src, function(res, err) {
      if (err) {
        console.log(err);
      }
    });
  },
  renderMutationArg: function(mutationArg, index) {
    var argString = JSON.stringify(mutationArg);
    if (argString.length > 50) {
      return DOM.a({
        key: index,
        style: {
          cursor: 'pointer',
          textDecoration: 'underline'
        },
        onClick: this.logArg.bind(null, argString)
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
