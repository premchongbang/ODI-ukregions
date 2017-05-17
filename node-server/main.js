var express = require('express');
var path = require('path');
var cons = require('consolidate');
var helper = require('./public/javascript/servercode.js');
var bodyParser = require('body-parser');
var values = require('object.values');
var clone = require('clone');

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// socket io connection
var server = require('http').Server(app);
var io = require('socket.io')(server);

// using static middleware to access the folders
app.use(express.static('public'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'node_modules')));

// view engine setup
app.engine('html', cons.swig)
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');

//setting port 
app.set('port', process.env.PORT || 8080);

// packaget to be sent to client side
var sendPackage = {};

// This responds with "Hello World" on the homepage
app.get('/', function (req, res) {
  console.log("Got a GET request for the homepage.");
  helper.getCrimeRating(function(crimeRating){
    var prefData = {};

    for (var i = 0; i < crimeRating.length; i++) {
      var region = crimeRating[i].region;
      var rating = crimeRating[i].rating;
      prefData[region] = rating;
    }

    sendPackage["Crime"] = prefData;
  });
  
  helper.getEconomyRating(function(economyRating){
    var prefData = {};

    for (var i = 0; i < economyRating.length; i++) {
      var region = economyRating[i].region;
      var rating = economyRating[i].rating;
      prefData[region] = rating;
    }

    sendPackage["Economy"] = prefData;
  });
  
  helper.getEducationRating(function(educationRating){
    var prefData = {};

    for (var i = 0; i < educationRating.length; i++) {
      var region = educationRating[i].region;
      var rating = educationRating[i].rating;
      prefData[region] = rating;
    }

    sendPackage["Education"] = prefData;
  });
  
  helper.getEmploymentRating(function(employmentRating){
    var prefData = {};

    for (var i = 0; i < employmentRating.length; i++) {
      var region = employmentRating[i].region;
      var rating = employmentRating[i].rating;
      prefData[region] = rating;
    }

    sendPackage["Employment"] = prefData;
  });
  
  helper.getHousingRating(function(housingRating){
    var prefData = {};

    for (var i = 0; i < housingRating.length; i++) {
      var region = housingRating[i].region;
      var rating = housingRating[i].rating;
      prefData[region] = rating;
    }

    sendPackage["Housing"] = prefData;
  });
  
  helper.getPopulationRating(function(populationRating){
	var prefData = {};

    for (var i = 0; i < populationRating.length; i++) {
      var region = populationRating[i].region;
      var rating = populationRating[i].rating;
      prefData[region] = rating;
    }

    sendPackage["Population"] = prefData;
  });
  
  helper.getSocialRating(function(socialRating){
    var prefData = {};

    for (var i = 0; i < socialRating.length; i++) {
      var region = socialRating[i].region;
      var rating = socialRating[i].rating;
      prefData[region] = rating;
    }

    sendPackage["Social"] = prefData;
  });
  
  helper.getOverallRating(function(overallRating){
    var prefData = {};

    for (var i = 0; i < overallRating.length; i++) {
      var region = overallRating[i].region;
      var rating = overallRating[i].rating;
      prefData[region] = rating;
    }

    sendPackage["Overall"] = prefData;
  });

  res.render('index1.html');
})

// This responds a POST request for the homepage
app.post('/', function (req, res) {
  console.log("Got a POST request for the homepage.");

  helper.getCrimeRating(function(crimeRating){
    var prefData = {};

    for (var i = 0; i < preferenceRating.length; i++) {
      var region = preferenceRating[i].region;
      var rating = preferenceRating[i].rating;
      prefData[region] = rating;
    }

    sendPackage["Crime"] = prefData;
  });
  
  helper.getEconomyRating(function(economyRating){
    var prefData = {};

    for (var i = 0; i < preferenceRating.length; i++) {
      var region = preferenceRating[i].region;
      var rating = preferenceRating[i].rating;
      prefData[region] = rating;
    }

    sendPackage["Economy"] = prefData;
  });
  
  helper.getEducationRating(function(educationRating){
    var prefData = {};

    for (var i = 0; i < preferenceRating.length; i++) {
      var region = preferenceRating[i].region;
      var rating = preferenceRating[i].rating;
      prefData[region] = rating;
    }

    sendPackage["Education"] = prefData;
  });
  
  helper.getEmploymentRating(function(employmentRating){
    var prefData = {};

    for (var i = 0; i < preferenceRating.length; i++) {
      var region = preferenceRating[i].region;
      var rating = preferenceRating[i].rating;
      prefData[region] = rating;
    }

    sendPackage["Employment"] = prefData;
  });
  
  helper.getHousingRating(function(housingRating){
    var prefData = {};

    for (var i = 0; i < preferenceRating.length; i++) {
      var region = preferenceRating[i].region;
      var rating = preferenceRating[i].rating;
      prefData[region] = rating;
    }

    sendPackage["Housing"] = prefData;
  });
  
  helper.getPopulationRating(function(populationRating){
	var prefData = {};

    for (var i = 0; i < populationRating.length; i++) {
      var region = populationRating[i].region;
      var rating = populationRating[i].rating;
      prefData[region] = rating;
    }

    sendPackage["Population"] = prefData;
  });
  
  helper.getSocialRating(function(socialRating){
    var prefData = {};

    for (var i = 0; i < preferenceRating.length; i++) {
      var region = preferenceRating[i].region;
      var rating = preferenceRating[i].rating;
      prefData[region] = rating;
    }

    sendPackage["Social"] = prefData;
  });
  
  helper.getOverallRating(function(overallRating){
    var prefData = {};

    for (var i = 0; i < preferenceRating.length; i++) {
      var region = preferenceRating[i].region;
      var rating = preferenceRating[i].rating;
      prefData[region] = rating;
    }

    sendPackage["Overall"] = prefData;
  });

  res.render('index1.html');
})

// This responds a GET request for abcd, abxcd, ab123cd, and so on
app.get('/getRating', function(req, res) {
  
  
  res.send(data);
})

app.post('/getPreferenceRating', function(req, res){
  console.log('Request received');

  var obj = req.body;
  var storeCategory = [];

  for(key in obj){
    storeCategory.push(obj[key])
    console.log("key " + obj[key]);
  }

  helper.getPreferenceRating(storeCategory[1].toLowerCase(), storeCategory[2].toLowerCase(), storeCategory[3].toLowerCase(), function(preferenceRating){
    var prefData = {};

    for (var i = 0; i < preferenceRating.length; i++) {
      var region = preferenceRating[i].region;
      var rating = preferenceRating[i].rating;
      prefData[region] = rating;
    }
    res.send(prefData);
  });
});

// catch 404 and forward to error handler
app.use(function(err, req, res, next) {
  console.error(err.stack);
  res.type('text/html');
  res.status(200);
});

io.on('connection', function(socket){
  console.log('User Connected');
  socket.emit('renderMap', sendPackage);

  socket.on('disconnect', function(){
      console.log('User Disconnected');
  });
});

server.listen(app.get('port'), function(){
  console.log('Server listening at port ' + app.get('port'));
});

module.exports = app;
