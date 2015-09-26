import React from 'react/addons';
import ClockFace from '../components/ClockFace';
var moment = require('moment-timezone');


var AnalogClock = React.createClass({
  getInitialState: function() {
    var date = this._switchTimeZone();
    return { date: date };
  },
  _switchTimeZone: function() {
      var date = new Date();
      var taipeiDifference = moment.tz("Asia/Taipei").format('Z');
      var seattleDifference = moment.tz("America/Vancouver").format('Z');
      var taipeiTime = moment.tz(date,"Asia/Taipei").format();
      var seattleTime = moment.tz(date,"America/Vancouver").format();
      if(this.props.timezone === 'Seattle'){
          date = new Date(taipeiTime.replace(seattleDifference,taipeiDifference));
      }else{
          date = new Date(taipeiTime.replace(taipeiDifference,seattleDifference));
      }
      return date;
  },
  componentDidMount: function() {
    this._start();
  },
  _start: function() {
    var self = this;
    (function tick() {
      var date = self._switchTimeZone();

      self.setState({ date: date });
      requestAnimationFrame(tick);
    }());
  },
  render: function() {
    return <ClockFace date={this.state.date} />;
  }
});

export default AnalogClock;
