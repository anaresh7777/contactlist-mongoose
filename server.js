var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var session = require('express-session');
var passport = require('passport');
var debug = require('debug');
var d3 = require("d3");

var mongojs = require('mongojs');
var db = mongojs('mongodb://naresh:naresh@ds063856.mlab.com:63856/mycontacts', ['contactlist']);

var index = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);
    
///////////////////////////////////////////////////
//////////////////////////////////////////////////
app.get('/contactlist', function (req, res) {
console.log("I received a GET request");
    db.contactlist.find(function (err, docs) {
        console.log(docs);
        res.json(docs);
    });
});
app.post('/contactlist', function (req, res) {
console.log(req.body);
    db.contactlist.insert(req.body, function(err,doc) {
res.json(doc);
    });
});
app.delete('/contactlist/:id', function (req,res) {
var id = req.params.id;
    console.log(id);
    db.contactlist.remove({_id: mongojs.ObjectId(id)}, function (err, doc) {
        res.json(doc);
    });
});
app.get('/contactlist/:id', function (req,res) {
    var id = req.params.id;
    console.log(id);
    db.contactlist.findOne({_id: mongojs.ObjectId(id)}, function (err, doc) {
        res.json(doc);
    });
});
app.put('/contactlist/:id', function (req,res) {
    var id = req.params.id;
    console.log(req.body.name);
    db.contactlist.findAndModify({query: {_id: mongojs.ObjectId(id)},
        update: {$set: {name:req.body.name, email:req.body.email, number:req.body.number}},
        new: true}, function (err,doc) {
        res.json(doc);
    });
});

////////////////////////////////////////////////////////////
/*
var JWT_SECRET = 'catsmeow';
var jwt = require('jwt-simple');
var bcrypt = require('bcryptjs');
var ObjectId = require('mongodb').ObjectId;

app.post('/users', function(req, res, next) {

    db.collection('users', function(err, usersCollection) {


        bcrypt.genSalt(10, function(err, salt) {

            bcrypt.hash(req.body.password, salt, function(err, hash) {

                var newUser = {
                    username: req.body.username,
                    password: hash
                };

                usersCollection.insert(newUser, {w:1}, function(err) {
                    return res.send();
                });
            });
        });

    });

});

app.put('/users/signin', function(req, res, next) {

    db.collection('users', function(err, usersCollection) {

        usersCollection.findOne({username: req.body.username}, function(err, user) {

            bcrypt.compare(req.body.password, user.password, function(err, result) {
                if (result) {
                    var token = jwt.encode(user, JWT_SECRET);
                    return res.json({token: token});
                } else {
                    return res.status(400).send();
                }
            });

        });
    });
});
*/


/*app.listen(3000);
console.log("Server is listening on port 3000");*/


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
