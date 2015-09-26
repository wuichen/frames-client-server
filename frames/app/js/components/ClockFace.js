import React from 'react/addons';


var ClockFace = React.createClass({
    rotate: function(deg) {
        return 'rotate(' + deg + 'deg)';
    },
    transform: function(str) {
        return { transform: str };
    },
    render: function() {
        var d = this.props.date;
        var millis = d.getMilliseconds();
        var second = d.getSeconds() * 6 + millis * (6 / 1000);
        var minute = d.getMinutes() * 6 + second / 60;
        var hour = ((d.getHours() % 12) / 12) * 360 + 90 + minute / 12;

        return (
          <div className="circle">
            <div className="face">
              <div className="second" style={this.transform(this.rotate(second))} />
              <div className="hour" style={this.transform(this.rotate(hour))} />
              <div className="minute" style={this.transform(this.rotate(minute))} />
            </div>
          </div>
        );
    }
});

export default ClockFace;
