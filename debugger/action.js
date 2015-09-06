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
  fontSize: 12,
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
  display: 'inline'
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

  render: function() {

    var actionStyle = merge({}, ActionStyle, {
      opacity: this.props.action.hasExecuted || this.props.action.isExecuting ? '1' : '0.5'
    });

    return DOM.li({
        style: actionStyle
      },
      DOM.h3({
          style: ActionHeaderStyle
        }, '⌁ ' + this.props.action.name,
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
      ),
      DOM.div({
        style: InputStyle
      }, DOM.h4({style: InputTitle}, '⇢ input: '), this.props.renderValue(this.props.action.input)),
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
