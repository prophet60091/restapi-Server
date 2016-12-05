
var Resource = require('resourcejs');
var passport = require('passport');
var config = require('../config/server');
var jwt = require('jwt-simple');
var _ = require('lodash');
// var helper = require('../helpers/auth');
module.exports = function(app, route) {

    // Setup the controller for REST;
    Resource(app, '', route,  app.models.locations).get({
        userId: null,

        //Check for credentials
        before: function(req, res, next) {
            //var result = passport.authorize('jwt', {session: false});
            //console.log(result);
            var token = getToken(req.headers);
            if (token) {
                console.log("gottoken");
                var decoded = jwt.decode(token, config.secret);
                app.models.users.findOne({
                    name: decoded.name
                }, function (err, user) {
                    if (err) throw err;

                    if (!user) {
                        return res.status(403).send({success: false, msg: 'Authentication failed. User not found.'});
                    } else {
                        //set the user Id of the requestor
                        userId = user._id;

                        //return only those belonging to
                        app.models.locations.find({'_id': {
                                $in: _.map(user.ulocations, 'location')} },
                            function(err, docs){
                              return  res.status(200).send(docs);
                        });

                    }
                });
            } else {
                return res.status(403).send({success: false, msg: 'No token provided.'});

            }
        }

    }).put ({
        userId: null,

        //Check for credentials
        before: function(req, res, next) {
            //var result = passport.authorize('jwt', {session: false});
            //console.log(result);
            var token = getToken(req.headers);
            if (token) {
                console.log("gottoken");
                var decoded = jwt.decode(token, config.secret);
                app.models.users.findOne({
                    name: decoded.name
                }, function (err, user) {
                    if (err) throw err;

                    if (!user) {
                        return res.status(403).send({success: false, msg: 'Authentication failed. User not found.'});
                    } else {
                        //set the user Id of the requestor
                        userId = user._id;
                        next();
                    }
                });
            } else {
                return res.status(403).send({success: false, msg: 'No token provided.'});

            }
        },
        after: function(req, res, next){
            //console.log("response",res.resource);
            var id = res.resource.item._id;
            console.log("LOCATION: idtopush", id);
            console.log("LOCATION: userId to add it to", userId);

            // /set parameters for the add
            var condition = {"_id": userId}
                , update = {$addToSet:{"ulocations":{"location":id, "loved": req.body.loved}}}    // set it to null
                , options = { }; // check all beer documents

            var user = app.models.users.model('users');

            //add it
            user.update(condition, update, options, cb);

            function cb(err, model){
                console.log(model);
            }

            next();
        }

    }).index({
        userId: null,

        //Check for credentials
        before: function(req, res, next) {
            //var result = passport.authorize('jwt', {session: false});
            //console.log(result);
            var token = getToken(req.headers);
            if (token) {
                console.log("gottoken");
                var decoded = jwt.decode(token, config.secret);
                app.models.users.findOne({
                    name: decoded.name
                }, function (err, user) {
                    if (err) throw err;

                    if (!user) {
                        return res.status(403).send({success: false, msg: 'Authentication failed. User not found.'});
                    } else {
                        //set the user Id of the requestor
                        userId = user._id;

                        //return only those belonging to
                        app.models.locations.find({'_id': {
                                $in: _.map(user.ulocations, 'location')} },
                            function(err, docs){
                                return  res.status(200).send(docs);
                            });

                    }
                });
            } else {
                return res.status(403).send({success: false, msg: 'No token provided.'});

            }
        }
    }).post({
        userId: null,

        //Check for credentials
        before: function(req, res, next) {
            //var result = passport.authorize('jwt', {session: false});
            //console.log(result);
            var token = getToken(req.headers);
            if (token) {
                console.log("gottoken");
                var decoded = jwt.decode(token, config.secret);
                app.models.users.findOne({
                    name: decoded.name
                }, function (err, user) {
                    if (err) throw err;

                    if (!user) {
                        return res.status(403).send({success: false, msg: 'Authentication failed. User not found.'});
                    } else {
                        //set the user Id of the requestor
                        userId = user._id;

                        //return only those belonging to
                        app.models.locations.find({'_id': {
                                $in: _.map(user.ulocations, 'location')} },
                            function(err, docs){
                                return  res.status(200).send(docs);
                            });

                    }
                });
            } else {
                return res.status(403).send({success: false, msg: 'No token provided.'});

            }
        }
    })

    .delete({
       //remove a beer from the users collection
        userId: null,

        //Check for credentials
        before: function(req, res, next) {
            //var result = passport.authorize('jwt', {session: false});
            //console.log(result);
            var token = getToken(req.headers);
            if (token) {
                console.log("gottoken");
                var decoded = jwt.decode(token, config.secret);
                app.models.users.findOne({
                    name: decoded.name
                }, function (err, user) {
                    if (err) throw err;

                    if (!user) {
                        return res.status(403).send({success: false, msg: 'Authentication failed. User not found.'});
                    } else {
                        //set the user Id of the requestor
                        userId = user._id;

                        //return only those belonging to
                        app.models.locations.find({'_id': {
                                $in: _.map(user.ulocations, 'location')} },
                            function(err, docs){
                                return  res.status(200).send(docs);
                            });

                    }
                });
            } else {
                return res.status(403).send({success: false, msg: 'No token provided.'});

            }
        }


    });


    // Return middleware.
    return function(req, res, next) {

        next();
    };
};
