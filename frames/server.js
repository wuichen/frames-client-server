var express = require('express');
var app = express();
var YQL = require('yql');
var cors = require('cors');

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(request, response) {
  response.render('pages/index');
});

app.get('/weather',cors(), function(req,res) {
    var result = {
        taipei:{},
        seattle:{}
    }
    var taipeiQuery = new YQL('select * from weather.forecast where woeid in (select woeid from geo.places(1) where text="taipei")AND u="c"');
    var seattleQuesry = new YQL('select * from weather.forecast where woeid in (select woeid from geo.places(1) where text="seattle")AND u="c"');
    taipeiQuery.exec(function(err, data) {
      var location = data.query.results.channel.location;
      var condition = data.query.results.channel.item.condition;
      result.taipei = data.query.results.channel;
    });

    seattleQuesry.exec(function(err, data) {
      var location = data.query.results.channel.location;
      var condition = data.query.results.channel.item.condition;
      result.seattle = data.query.results.channel;
    });

    setTimeout(function() {
        res.json(result)
    },1000);

})

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});


