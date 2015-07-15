var DOM = React.DOM;

var SignalStyle = {
  color: '#666',
  marginBottom: '0',
  fontSize: '1.25em',
  padding: '0 10px'
};

var ActionsStyle = {
  listStyleType: 'none',
  paddingLeft: 0
};

var SignalComponent = React.createClass({
  renderFPS: function(duration) {

    var color = duration >= 16 ? '#d9534f' : duration >= 10 ? '#f0ad4e' : '#5cb85c';
    return DOM.strong(null, DOM.small({
      style: {
        color: color
      }
    }, ' (' + duration + 'ms)'));
  },
  renderAction: function (signal, action, index) {

    return React.createElement(ActionComponent, {
      action: action,
      key: index,
      index: index,
      signal: signal,
      getValue: this.props.getValue,
      isExecutingAsync: this.props.isExecutingAsync
    });

  },
  render: function() {

    return DOM.div(null,
      DOM.h2({
        style: SignalStyle
      }, DOM.span(null, this.props.signal.name, this.renderFPS(this.props.signal.duration))),
      DOM.ul({
        style: ActionsStyle
      }, this.props.signal.actions.map(this.renderAction.bind(null, this.props.signal)))
    )
  }
});
