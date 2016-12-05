
var Resource = require('resourcejs');
var passport = require('passport');
var config = require('../config/server');
var jwt = require('jwt-simple');
var _ = require('lodash');
// var helper = require('../helpers/auth');

module.exports = function(app, route) {
    // Setup the controller for REST;
    Resource(app, '', route,  app.models.beers)
        .get({
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
                        //console.log(_.map(user.ubeer, 'beer'));
                        //
                        // //return only those belonging to
                        // app.models.beers.find({'_id': {
                        //         $in: _.map(user.ubeers, 'beer')} },
                        //     function(err, docs){
                        //         console.log(err);
                        //         return  res.status(200).send(docs);
                        //     });
                    }
                });
            } else {
                return res.status(403).send({success: false, msg: 'No token provided.'});

            }
        }

    })
        .index({
        userId: null,

        //Check for credentials
        before: function (req, res, next) {
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
                        //console.log(_.map(user.ubeer, 'beer'));

                        //return only those belonging to
                        app.models.beers.find({
                                '_id': {
                                    $in: _.map(user.ubeers, 'beer')
                                }
                            },
                            function (err, docs) {
                                console.log(err);
                                return res.status(200).send(docs);
                            });
                    }
                });
            } else {
                return res.status(403).send({success: false, msg: 'No token provided.'});

            }
        }

    })
        .delete({

        before: function(req, res, next) {
            var beerid = req.params.mybeersId;
            req.skipResource = true;
            var userId = null;
            //Check the creds  //todo Yes I know this needs to be made into a service (aint nobody got time for that)
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

                        console.log('-------cleaning up Beers in users------', userId);
                        if (userId != undefined && userId != null) {
                            console.log("this should be deleted:", beerid);
                            console.log("From this user:", userId);

                            // /set parameters for the search
                            var condition = {_id: userId},
                                update = {$pull: {ubeers: {beer: beerid}}},
                                options = {multi: true}; // check all beer documents

                            var userModel = app.models.users.model('users');

                            //remove it
                            userModel.update(condition, update, options, function (err, numAffected) {
                                console.log(numAffected);
                                //if (numAffected.nModified == 1) {
                                    res.status(200).send({success: true, msg: 'neeerk'});
                                //}
                            });

                            console.log('----------------------------');
                        }
                    }
                });
            } else {
                return res.status(403).send({success: false, msg: 'No token provided.'});

            }
            next();
        }
    })
        .put({
        before: function (req, res, next) {
            console.log(req.params);
            var beerid = req.params.mybeersId;
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
                        //console.log(_.map(user.ubeer, 'beer'));

                        /*//add his beer
                        console.log('-------add beer in user RECORD------');

                        // // get the style id
                        //var beerid = res.resource.item._id;
                        console.log("this should be added:", beerid);
                        console.log("To this user:", userId);

                        // /set parameters for the search
                        var condition = {_id: userId},
                            update = {$addToSet: {ubeers: {beer: beerid}}},
                            options = {};

                        var userModel = app.models.users.model('users');

                        //remove it
                        userModel.update(condition, update, options, function (err, numAffected) {
                            console.log(numAffected.ok);
                            console.log(numAffected);
                            if (numAffected.nModified == 1) {
                                return res.status(200).send();
                            }
                        });*/

                        console.log('----------------------------');
                    }
                });
            } else {
                return res.status(403).send({success: false, msg: 'No token provided.'});

            }
            next();
        },
            //NOW ADD the beer to the users stash
        after: function(req, res, next){
            var id = res.resource.item._id;
            //console.log("idtopush", id);
            //console.log("userId to add it to", userId);

            // /set parameters for the add
            var condition = {"_id": userId}
                , update = {$addToSet:{"ubeers":{"beer":id, "loved": req.body.loved}}}    // set it to null
                , options = { }; // check all beer documents

            var user = app.models.users.model('users');

            //add it
            user.update(condition, update, options, cb);

            function cb(err, model){
                console.log(model);
            }

            next();
        }

    });


    /*app.delete("/myBeers/:id", function(req,res,next){
        var userId = null;
        //Check the creds  //todo Yes I know this needs to be made into a service (aint nobody got time for that)
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

                    console.log('-------cleaning up Beers in users------', userId);
                    if(userId != undefined && userId != null) {
                        // get the style id
                        var beerid = req.params.id;
                        console.log("this should be deleted:", beerid);
                        console.log("From this user:", userId);

                        // /set parameters for the search
                        var condition = {_id: userId},
                            update = {$pull: {ubeers: {beer: beerid}}},
                            options = {multi: true}; // check all beer documents

                        var userModel = app.models.users.model('users');

                        //remove it
                        userModel.update(condition, update, options, function (err, numAffected) {
                            console.log(numAffected);
                            if (numAffected.ok) {
                                //return res.status(200).send({success: true, msg: 'Removed from collection'});
                            }
                        });

                        console.log('----------------------------');
                    }
                    next();
                }
            });
        } else {
            return res.status(403).send({success: false, msg: 'No token provided.'});

        }

    });*/

    // // Setup the controller for REST;
    // Resource(app, '', route,  app.models.beers).get({
    //     userId: null,
    //
    //     //Check for credentials
    //     before: function(req, res, next) {
    //         //var result = passport.authorize('jwt', {session: false});
    //         //console.log(result);
    //         var token = getToken(req.headers);
    //         if (token) {
    //             console.log("gottoken");
    //             var decoded = jwt.decode(token, config.secret);
    //             app.models.users.findOne({
    //                 name: decoded.name
    //             }, function (err, user) {
    //                 if (err) throw err;
    //
    //                 if (!user) {
    //                     return res.status(403).send({success: false, msg: 'Authentication failed. User not found.'});
    //                 } else {
    //                     //set the user Id of the requestor
    //                     userId = user._id;
    //                     console.log(_.map(user.ubeer, 'beer'))
    //                     app.models.beers.find({'_id': {
    //                             $in: _.map(user.ubeer, 'beer')} },
    //                         function(err, docs){
    //                           return  res.status(200).send(docs);
    //                     });
    //
    //                 }
    //             });
    //         } else {
    //             return res.status(403).send({success: false, msg: 'No token provided.'});
    //
    //         }
    //     }
    //
    // }).index();


    // Return middleware.
    return function(req, res, next) {

        next();
    };
};
