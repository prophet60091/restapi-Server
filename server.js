// Robert Jackson CS496 10/4/16
// Adapted from this tutorial. Thank you travis! https://www.youtube.com/watch?v=OhPFgqHz68o
// Most of this is taken verbatim from the tutorial, and I've modified the database portion to be something else

var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var _ = require('lodash');

// Create the application.
var app = express();

// Add Middleware necessary for REST API's
app.use(bodyParser.urlencoded({extended: true}));
/*app.use(bodyParser.json());*/
 app.use(methodOverride('X-HTTP-Method-Override'));
app.use(bodyParser.json({type:'application/vnd.api+json'}));



// CORS Support
app.use(function(req, res, next) {
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
      res.header('Access-Control-Allow-Headers', 'Content-Type');
      next();
});

// Connect to MongoDB
var options = { server: { socketOptions: { keepAlive: 300000, connectTimeoutMS: 30000 } },
    replset: { socketOptions: { keepAlive: 300000, connectTimeoutMS : 30000 } } };

//mongoose.connect('mongodb://testing1234:doppelbok1@ds053206.mlab.com:53206/cs496beers');
mongoose.connect('mongodb://testing1234:doppelbok1@ds053206.mlab.com:53206/cs496beers', options);

//set the mongoose promise to use native ES6
mongoose.Promise = global.Promise;


mongoose.connection.once('open', function() {

    // Load the models.
    app.models = require('./models/index');

    app.use('/hello', function(req, res, next){
        res.send ('[{name: "Modus Hoperandi"}]');
        next();
    });

    // Load the routes.
    var routes = require('./routes');
    _.each(routes, function(controller, route) {
    app.use(route, controller(app, route));
    });

      // console.log('Listening on port 3000...');
      // app.listen(80);
    app.listen(8080, function () {
        console.log('started web process');
    });

})