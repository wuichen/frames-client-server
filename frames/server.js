var express = require('express');
var path    = require("path");

var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var fs = require('fs');
var cors = require('cors');

var app = express();
app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/build'));


var APISample;


app.get('/',function(req,res){
  res.sendFile((path.join(__dirname + '/index.html')));
});

app.use(bodyParser.urlencoded({
        extended: false,
     parameterLimit: 10000,
     limit: '50mb'
}));

app.use(cookieParser());

fs.readFile('./app/js/utils/APISample.json', 'utf8', function(err, data) {
    if (err) throw err;
    APISample = JSON.parse(data);
});

var whitelist = ['http://localhost:3001','http://localhost:8080','https://serviceworkbench.firebaseapp.com'];
var corsOptions = {
    origin: function(origin, callback) {
        var originIsWhitelisted = whitelist.indexOf(origin) !== -1;
        callback(null, originIsWhitelisted);
    }
};

app.get('/next', cors(corsOptions), function(req, res) {
    var APISamples = [];
    var reportTempIndex = 0;

    for (var i = req.query.count - 1; i >= 0; i--) {
        reportTempIndex++;
        APISample.reportTempIndex = reportTempIndex;
        APISamples.push(JSON.parse(JSON.stringify(APISample)));
    }
    APISamples[0].ENTITY_CODE = 'this is a different store';
    res.json(APISamples);

  //error testing
   //  res.status(404)        // HTTP status 404: NotFound
   // .send('Not found');
});

app.get('/ping', cors(corsOptions), function(req, res) {
    res.json({isConnected: true});
})

app.post('/post', cors(corsOptions), function (req, res) {
  res.send('success');
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
