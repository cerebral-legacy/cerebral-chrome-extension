var DOM = React.DOM;

var OutputStyle = {
  fontSize: 12
};

var CollapseStyle = {
  cursor: 'default',
  fontSize: 8
};

var OutputTitle = {
  margin: 0,
  fontSize: 12,
  display: 'inline-block',
  verticalAlign: 'top'
};


var OutputPath = React.createClass({
  getInitialState: function () {
    return {
      isCollapsed: this.props.action.hasExecuted && this.props.output !== this.props.action.outputPath
    };
  },
  componentWillReceiveProps: function (nextProps) {
    this.setState({
      isCollapsed: nextProps.action.hasExecuted && nextProps.output !== nextProps.action.outputPath
    });
  },
  toggleCollapse: function () {
    this.setState({
      isCollapsed: !this.state.isCollapsed
    });
  },
  render: function() {

    var outputStyle = merge({}, OutputStyle, {
      opacity: this.props.action.hasExecuted && this.props.output === this.props.action.outputPath ? '1' : this.props.action.hasExecuted  && !this.state.isCollapsed ? '0.8' : '0.5'
    });

    return DOM.li({
      style: outputStyle
    }, DOM.h4({
      style: OutputTitle,
      onClick: this.toggleCollapse
    },
    this.state.isCollapsed ? DOM.small({style: CollapseStyle}, '▶ ') : DOM.small({style: CollapseStyle}, '▼ '),
    '⇣ ' + this.props.output + ': '),
    this.props.output === this.props.action.outputPath && this.props.action.output ? this.props.renderValue(this.props.action.output) : null,
    this.state.isCollapsed ?
      null
      :
      DOM.ul({
      style: OutputActionsStyle
    }, this.props.action.outputs[this.props.output].map(this.props.renderAction)));

  }
});
