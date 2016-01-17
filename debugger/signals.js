var DOM = React.DOM;

var SignalsStyle = {
  background: 'url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAMElEQVQIW2N89+7dfwYk8P79ewZGZEGQgKCgIEIQJgDSBFaJLAAWvHv37n+QFmQAAEgLHsBFNKP+AAAAAElFTkSuQmCC) repeat',
  padding: '0 5px 0 5px',
  borderTop: '1px solid #999',
  position: 'fixed',
  top: 30,
  width: '100%',
  zIndex: 999999,
  overflowX: 'hidden',
  borderBottom: '1px solid #999',
  WebkitUserSelect: 'none'
};

var SignalsNav = {
  position: 'relative',
  display: 'flex',
  alignItems: 'stretch',
  flexWrap: 'nowrap',
  listStyleType: 'none',
  minHeight: 37.5,
  padding: 0,
  margin: 0,
  left: 0,
  transition: 'left 0.25s ease-out'
};

var SignalsColumn= {
  alignSelf: 'stretch',
  cursor: 'pointer',
  flex: 'auto'
}

var SignalsItem = {
  margin: '5px',
  border: '1px solid #333',
  padding: '5px',
  color: '#FFF',
  borderRadius: '4px',
  backgroundColor: 'green',
  opacity: '0.6',
  whiteSpace: 'nowrap'
};

var SignalsComponent = React.createClass({
  isDragging: false,
  isDetectingDrag: false,
  dragStart: 0,
  mouseStart: 0,
  componentDidMount: function() {
    this.positionSignals();
    this.getDOMNode().addEventListener('mousewheel', this.scroll);
    window.addEventListener('mousemove', this.drag);
    window.addEventListener('mouseup', this.stopDrag);
  },
  componentWillUnmount() {
    window.removeEventListener('mousemove', this.drag);
    window.removeEventListener('mouseup', this.stopDrag);
  },
  componentDidUpdate: function() {
    this.positionSignals();
  },
  detectDrag(event) {
    this.dragStart = this.refs.signals.getDOMNode().offsetLeft - 15;
    this.mouseStart = event.clientX;
    this.isDetectingDrag = true;
  },
  drag(event) {
    if (this.isDetectingDrag && Math.abs(this.dragStart - event.clientX) > 10) {
      this.isDetectingDrag = false;
      this.isDragging = true;
    }

    if (this.isDragging) {
      var moveTo = event.clientX - this.mouseStart + this.dragStart + 10;
      this.refs.signals.getDOMNode().style.transition = 'none';
      this.refs.signals.getDOMNode().style.left = moveTo + 'px';
    }
  },
  stopDrag() {
    this.refs.signals.getDOMNode().style.transition = 'left 0.25s ease-out';
    setTimeout(function () {
      this.isDragging = false;
      this.isDetectingDrag = false;
    }.bind(this), 0);

  },
  scroll: function (event) {
    event.preventDefault();
    this.move(event.deltaX);
  },
  move: function (deltaX) {
    this.refs.signals.getDOMNode().style.transition = 'none';
    this.refs.signals.getDOMNode().style.left = (parseInt(this.refs.signals.getDOMNode().style.left) - deltaX) + 'px';
  },
  positionSignals: function() {
    if (!this.props.signals.length) {
      return;
    }

    var els = this.refs.signals.getDOMNode().childNodes;
    var totalWidth = window.innerWidth;

    var currentLi = els[this.props.currentSignalIndex[0]];
    var currentLiOffset = currentLi.offsetLeft + (currentLi.offsetWidth / 2);
    var center = totalWidth / 2;
    var distanceToCenter = center - currentLiOffset;

    this.refs.signals.getDOMNode().style.left = distanceToCenter + 'px';
  },
  onSignalClick: function (columnIndex, signalIndex, event) {
    event.stopPropagation();
    if (this.isDragging) {
      return;
    }
    this.refs.signals.getDOMNode().style.transition = 'left 0.25s ease-out';
    setTimeout(function () {
      this.props.onSignalClick(columnIndex, signalIndex)
    }.bind(this), 50);
  },
  render: function() {
    var currentSignalIndex = this.props.currentSignalIndex;
    var currentColumnIndex = currentSignalIndex[0];
    var currentSignalIndex = currentSignalIndex[1];
    var onSignalClick = this.onSignalClick;

    return DOM.div(null,
      DOM.div({
          style: SignalsStyle,
          onMouseDown: this.detectDrag
        },
        DOM.ul({
            style: SignalsNav,
            ref: 'signals'
          },
          this.props.signals.map(function (signals, columnIndex) {
            var column = Object.keys(SignalsColumn).reduce(function (style, key) {
              style[key] = SignalsColumn[key];
              return style;
            }, {});

            if (columnIndex === currentColumnIndex) {
              column.backgroundColor = '#ddd';
              column.borderLeft = '1px solid #999';
              column.borderRight = '1px solid #999';
            }

            return DOM.li({
                style: column,
                onClick: onSignalClick.bind(null, columnIndex, 0),
                onMouseEnter: function (event) {
                  event.currentTarget.style.backgroundColor = '#E6E6E6';
                },
                onMouseLeave: function (event) {
                  event.currentTarget.style.backgroundColor = columnIndex === currentColumnIndex ? '#DDD' : 'transparent';
                }
              },

              signals.map(function (signal, signalIndex) {
                var style = Object.keys(SignalsItem).reduce(function (style, key) {
                  style[key] = SignalsItem[key];
                  return style;
                }, {});

                if (columnIndex === currentColumnIndex && signalIndex === currentSignalIndex) {
                  style.opacity = '1';
                }

                if (signal.isExecuting) {
                  style.backgroundColor = 'orange';
                }

                console.log(signal);
                return DOM.div({
                  style: style,
                  onClick: onSignalClick.bind(null, columnIndex, signalIndex)
                },
                  signal.name,
                  signal.isRouted ? DOM.small({style: {fontWeight: 'bold'}}, ' routed') : signal.isSync ? DOM.small({style: {fontWeight: 'bold'}}, ' sync') : null
                )
              })
            );
          }, this)
        )
      )
    );
  }
});
