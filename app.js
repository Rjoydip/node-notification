var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var cors = require('cors');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var firebase = require("firebase");

// Initialize Firebase
var config = {
  apiKey: "AIzaSyBdtVvvl02t98wdvAYK82Z0785NhcNdP3Q",
  authDomain: "node-notification.firebaseapp.com",
  databaseURL: "https://node-notification.firebaseio.com",
  projectId: "node-notification",
  storageBucket: "node-notification.appspot.com",
  messagingSenderId: "345904074785"
};
firebase.initializeApp(config);

var tokens = [];

var app = express();

// For cors
app.use(cors());

// view engine setup
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function (req, res) {
  res.render('index.html');
});

app.get('/action', function (req, res) {
  res.status(200).send({
    message: "Clicked on action"
  });
});

app.post('/register', function (req, res) {
  tokens = req.body.token;
  res.send({
    status: 200,
    message: "Message registered"
  });
});

app.post('/send', function (req, res) {
  // This registration token comes from the client FCM SDKs.
  var registrationToken = req.body.token;

  // See the "Defining the message payload" section below for details
  // on how to define a message payload.
  var payload = {
    notification: {
      title: "Urgent action needed!",
      body: "Urgent action is needed to prevent your account from being disabled!"
    }
  };
  // Send a message to the device corresponding to the provided
  // registration token.
  admin.messaging().sendToDevice(registrationToken, payload)
    .then(function (response) {
      // See the MessagingDevicesResponse reference documentation for
      // the contents of response.
      console.log("Successfully sent message:", response);
      // res.send({
      //   response
      // });
    })
    .catch(function (error) {
      console.log("Error sending message:", error);
      // res.send({
      //   error
      // });
    });
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.send(err);
});

module.exports = app;