var express = require('express');
var path = require('path');
var cons = require('consolidate');
var helper = require('./public/javascript/servercode.js');
var bodyParser = require('body-parser');

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// socket io connection
var server = require('http').Server(app);
var io = require('socket.io')(server);

// using static middleware to access the folders
app.use(express.static(path.join(__dirname, 'public')));

// view engine setup
app.engine('html', cons.swig)
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');

//setting port 
app.set('port', process.env.PORT || 8080);

// This responds with "Hello World" on the homepage
app.get('/', function (req, res) {
   console.log("Got a GET request for the homepage");
   res.render('index1.html');
})

// This responds a POST request for the homepage
app.post('/', function (req, res) {
   console.log("Got a POST request for the homepage");
   res.render('index1.html');
})

app.post('/getData', function (req, res) {

   console.log("body " + req.body.ID);

   for(key in req.body){
    console.log("key " + key);
   }
   console.log("Data topic changed");
   res.redirect('/');
})

// This responds a GET request for abcd, abxcd, ab123cd, and so on
app.get('/getRating', function(req, res) {
  helper.getRegionalRating();
  var newrating = helper.getPreferenceRating();
  
  for(var i;i<newrating.length;i++){
    console.log(rating[i].region);
    console.log(rating[i].rating);
  }

  console.log(data);
  res.send({aa:1, bb:2});
})

// catch 404 and forward to error handler
app.use(function(err, req, res, next) {
  console.error(err.stack);
  res.type('text/html');
  res.status(200);
});


io.on('connection', function(socket){
  console.log('User Connected');
  var data = "Welcome";
  socket.emit('renderMap', data);
  socket.on('disconnect', function(){
      console.log('User Disconnected');
  });
});

server.listen(app.get('port'), function(){
  console.log('Server listening at port ' + app.get('port'));
});

module.exports = app;
