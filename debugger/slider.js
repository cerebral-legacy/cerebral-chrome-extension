var DOM = React.DOM;

var SliderStyle = {
  padding: '10px',
  borderBottom: '1px solid #EEE',
  height: '40px',
  boxSizing: 'border-box'
};

function debounce(fn, delay) {
  var timer = null;
  return function () {
    var context = this, args = arguments;
    clearTimeout(timer);
    timer = setTimeout(function () {
      fn.apply(context, args);
    }, delay);
  };
}

var SliderComponent = React.createClass({
  remember: function (index) {
    var src = 'var event = new CustomEvent("cerebral.dev.remember", {detail: ' + (index - 1) + '});window.dispatchEvent(event);';
    chrome.devtools.inspectedWindow.eval(src, function(res, err) {
      if (err) {
        console.log(err);
      }
      this.props.optimisticRangeUpdate(index);
    }.bind(this));
  },
  render: function() {
    return DOM.div({
        style: SliderStyle
      },
      React.createElement(RangeComponent, {
        onChange: this.remember,
        disabled: !this.props.isRemembering && (this.props.isExecutingAsync/* || this.props.recorder.isPlaying || this.props.recorder.isRecording*/),
        value: this.props.value || 0,
        steps: this.props.steps
      })
    )
  }
});
