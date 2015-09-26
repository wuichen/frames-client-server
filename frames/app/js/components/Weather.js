import React from 'react/addons';


var Weather = React.createClass({
  getInitialState: function () {
    return({
        seattleWeatherImage : null,
        taipeiWeatherImage: null
    })
  },
  componentDidMount: function () {
      var self = this;
      $.ajax({
          type: 'GET',
          url: 'http://localhost:5000/weather'
      }).done(function( data ) {
          console.log(data)
          self.setState({
              seattleWeatherImage: $.parseHTML(data.seattle.item.description)[1].src,
              taipeiWeatherImage: $.parseHTML(data.taipei.item.description)[1].src
          })
      }).fail(function (err) {
          console.log(err);
      });
  },

  render: function() {
    return (
        <div>
        {this.state.seattleWeatherImage && (
            <img src={this.state.seattleWeatherImage} />
        )}
        {this.state.taipeiWeatherImage && (
            <img src={this.state.taipeiWeatherImage} />
        )}
        </div>
    )
  }
});

export default Weather;