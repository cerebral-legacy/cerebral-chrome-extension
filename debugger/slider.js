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
    chrome.extension.sendMessage({
      action: 'code',
      content: 'var event = new CustomEvent("cerebral.dev.remember", {detail: ' + (index - 1) + '});window.dispatchEvent(event);',
      tabId: chrome.devtools.inspectedWindow.tabId
    });
  },
  render: function() {
    return DOM.div({
        style: SliderStyle
      },
      React.createElement(RangeComponent, {
        onChange: this.remember,
        disabled: !this.props.isRemembering && (this.props.isExecutingAsync/* || this.props.recorder.isPlaying || this.props.recorder.isRecording*/),
        value: this.props.value,
        steps: this.props.steps
      })
    )
  }
});
