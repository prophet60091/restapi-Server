// Robert Jackson CS496 10/4/16
// Adapted from this tutorial. Thank you travis! https://www.youtube.com/watch?v=OhPFgqHz68o
// Most of this is taken verbatim from the tutorial, and I've modified the database portion to be something else
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var passport = require('passport');
var methodOverride = require('method-override');
var _ = require('lodash');
var morgan = require('morgan');
var config = require('./config/server');

// Create the application.
var app = express();

// Add Middleware necessary for REST API's
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(methodOverride('X-HTTP-Method-Override'));
app.use(bodyParser.json({type:'application/vnd.api+json'}));
app.use(methodOverride());


// CORS Support
app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', req.get('Origin') || '*');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE');
    res.header('Access-Control-Expose-Headers', 'Content-Length');
    res.header('Access-Control-Allow-Headers', 'Accept, Authorization, Content-Type, X-Requested-With, Range');
    if (req.method === 'OPTIONS') {
        return res.send(200);
    } else {
        return next();
    }
});

// log to console
app.use(morgan('dev'));

// Connect to MongoDB
var options = { server: { socketOptions: { keepAlive: 300000, connectTimeoutMS: 30000 } },
    replset: { socketOptions: { keepAlive: 300000, connectTimeoutMS : 30000 } } };

mongoose.connect(config.database, options);

// //set the mongoose promise to use native ES6
mongoose.Promise = global.Promise;

// pass passport for configuration
require('./config/passport')(passport);


mongoose.connection.once('open', function() {

    // Load the models.
    app.models = require('./models/index');

    app.use('/hello', function(req, res, next){
        res.send ('[{"_id":"57f960dfb722d0350c11120b","name":"Decadent","brewery":"ska","style":"Double IPA","alcohol_content":"9","origin":"Durango Colorado","location":"","__v":0},{"_id":"57f99a6b6640400d4c7a1c01","name":"Modus Hoparandi","brewery":"ska","style":" IPA","alcohol_content":"6.5","location":"","origin":"Durango, Colorado","__v":0}]');
        next();
    });

    // Load the routes.
    var routes = require('./routes');
    _.each(routes, function(controller, route) {
    app.use(route, controller(app, route));
    });

      // console.log('Listening on port 3000...');
      // app.listen(80);
    app.listen(config.port ,function () {
        console.log('started web process');
    });

})