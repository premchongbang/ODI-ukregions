var express = require('express');
var path = require('path');
var cons = require('consolidate');

var app = express();

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

//store category topic
var topics = "";

// This responds with "Hello World" on the homepage
app.get('/', function (req, res) {
   console.log("Got a GET request for the homepage");
   res.render('index1.html');
})

// This responds a POST request for the homepage
app.post('/', function (req, res) {
   console.log("Got a POST request for the homepage");
   res.send('index1.html');
})

app.post('/getdata', function (req, res) {
   var pageBody = req.body;
   console.log("body " + pageBody);
   console.log("Data topic changed");
   res.send('/public/data/topo_eer.json');
})

// This responds a DELETE request for the /del_user page.
app.delete('/del_user', function (req, res) {
   console.log("Got a DELETE request for /del_user");
   res.send('Hello DELETE');
})

// This responds a GET request for the /list_user page.
app.get('/list_user', function (req, res) {
   console.log("Got a GET request for /list_user");
   res.send('Page Listing');
})

// This responds a GET request for abcd, abxcd, ab123cd, and so on
app.get('/ab*cd', function(req, res) {   
   console.log("Got a GET request for /ab*cd");
   res.send('Page Pattern Match');
})

// catch 404 and forward to error handler
app.use(function(err, req, res, next) {
  console.error(err.stack);
  res.type('text/html');
  res.status(404);
  res.render('404');
});

// error handlers
app.use(function(err, req, res, next) {
  console.error(err.stack);
  res.status(500);
  res.render('500');
});

io.on('connection', function(socket){
   var finalPackage = "test";
   console.log('User Connected');
   socket.emit('renderMap', finalPackage);
   socket.on('disconnect', function(){
      console.log('User Disconnected');
   });
});

server.listen(app.get('port'), function(){
  console.log('Server listening at port ' + app.get('port'));
});

module.exports = app;
