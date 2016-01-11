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
  fontSize: 14,
  border: '1px solid #EEE'
};

var MutationsStyle = {
  listStyleType: 'none',
  paddingLeft: 0
};

var InputStyle = {
  padding: 5,
  margin: '0 5px'
};

var InputTitle = {
  margin: 0,
  fontSize: 12,
  display: 'inline-block',
  verticalAlign: 'top'
};

var ActionComponent = React.createClass({
  getInitialState: function () {
    return {
      isCollapsed: false
    }
  },
  renderMutation: function (mutation, index) {
    return React.createElement(MutationComponent, {
      mutation: mutation,
      index: index,
      action: this.props.action,
      key: index,
      getValue: this.props.getValue
    });
  },

  renderDuration: function () {

    var duration = this.props.action.duration;

    if (!duration) {
      return null;
    }

    var color = duration >= 16 ? '#d9534f' : duration >= 10 ? '#f0ad4e' : '#5cb85c';

    return DOM.strong(null, DOM.small({
      style: {
        color: color
      }
    }, ' (' + duration + 'ms)'));

  },

  inspect: function(e) {
    e.preventDefault();

    function inspectSignal(window, signalName, path) {
      if (window.__CEREBRAL_DEVTOOLS_GLOBAL_HOOK__) {
        var signal = signalName.split('.').reduce(function (signals, key) {
          return signals[key];
        }, window.__CEREBRAL_DEVTOOLS_GLOBAL_HOOK__.signals);
        if (signal) {
          path = path.split(',');
          path = path.map(function (pathName, index) {
            if (path[index + 1] === 'outputs') {
              return Number(pathName) + 1;
            }
            return pathName;
          }).filter(function (pathName, index) {
            if (pathName === 'outputs') {
              return false;
            }
            return true;
          });
          var action = path.reduce(function (branches, index) {
            return branches[index];
          }, signal.chain);
          inspect(action);
        }
      }
    }

    var src = (
      '(' + inspectSignal.toString() + ')(window, "' + this.props.signalName + '", "' + this.props.action.path + '")'
    );

    chrome.devtools.inspectedWindow.eval(src, function(res, err) {
      if (err) {
        console.log(err);
      }
    });
  },

  render: function() {

    var actionStyle = merge({}, ActionStyle, {
      opacity: this.props.action.hasExecuted || this.props.action.isExecuting ? '1' : '0.75'
    });

    return DOM.li({
        style: actionStyle
      },
      DOM.a({
        onClick: this.inspect.bind(this),
        style: {
          cursor: "pointer"
        }
      }, DOM.h3({
          style: ActionHeaderStyle
      }, '↪ ' + this.props.action.name, this.props.devToolsIndex, this.renderDuration(),
        DOM.small({
            style: {
              color: this.props.action.isAsync ? 'orange' : '#555'
            }
          },
          this.props.action.isAsync &&
          this.props.action.isExecuting ?
          ' running' :
          this.props.action.isAsync ? ' async' :
          null
        )
      )),
      DOM.div({
        style: InputStyle
      },
      DOM.h4({style: InputTitle}, '⇢ input: '), this.props.renderValue(this.props.action.input)),
      DOM.ul({
        style: MutationsStyle
      }, this.props.action.mutations.map(this.renderMutation)),
      this.props.action.outputPath ?
        this.props.children :
        this.props.action.output ?
          DOM.div({
            style: InputStyle
          }, DOM.h4({style: InputTitle}, '⇠ output: '), this.props.renderValue(this.props.action.output))
          :
          null
    )
  }
});
