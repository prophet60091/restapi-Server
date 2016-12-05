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
//http://enable-cors.org/server_expressjs.html
app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', req.get('Origin') || '*');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE');
    res.header('Access-Control-Expose-Headers', 'Content-Length');
    res.header('Access-Control-Allow-Headers', 'Accept, Authorization, Content-Type, X-Requested-With, Range');
    res.header ('Cache-Control', 'public, max-age=0');
    if (req.method === 'OPTIONS') {
        return res.send(200);
    } else {
        return next();
    }
});

// log to console
app.use(morgan('dev'));
app.disable('etag');
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
    app.use('/nman', function(req, res){

        var newman = require('newman');
        var success = false;
        newman.run({
            collection: require('./assignment4.postman_collection.json'),
            environment: require('./live.postman_environment.json'),
            reporters: 'html',
            reporter : { html : { export : './newman/htmlResults.html'}}
        }).on('start', function(err, args){
            console.log(err);

        }).on('done', function (err, summary){
            if (err) {
                //res.send('["msg": "collection run encountered an error."]');
                console.log(err);
            }
            else {
                res.send('[{"msg":"generated a report"}]');
                console.log(summary);
                success = true;
            }
        } );
    });
    app.use('/report', function(req, res){

        res.sendFile('/newman/htmlResults.html',{ "root": './' }, function (err) {
            if (err) {
                console.log(err);
                res.send(err);
                res.status(err.status).end();

            }
            else {
                console.log('Sent results:');
            }
        });

    });

    // Load the routes.
    var routes = require('./routes');
    _.each(routes, function(controller, route) {
        app.use(route, controller(app, route));
    });

    //User Authentication
    /*app.post('/authenticate', function(req, res) {
        User.findOne({
            name: req.body.name
        }, function(err, user) {
            if (err) throw err;

            if (!user) {
                res.send({success: false, msg: 'Authentication failed. User not found.'});
            } else {
                // check if password matches
                user.comparePassword(req.body.password, function (err, isMatch) {
                    if (isMatch && !err) {
                        // if user is found and password is right create a token
                        var token = jwt.encode(user, config.secret);
                        // return the information including token as JSON
                        res.json({success: true, token: 'JWT ' + token});
                    } else {
                        res.send({success: false, msg: 'Authentication failed. Wrong password.'});
                    }
                });
            }
        });
    });*/


    //load language
    var msg = require('./config/language-en');

      // console.log('Listening on port 3000...');
      // app.listen(80);
    app.listen(config.port ,function () {
        console.log('started web process');
    });

})