var Resource = require('resourcejs');
var passport = require('passport');
var config = require('../config/server');
var jwt = require('jwt-simple');
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
                     next();
                 }
             });
         } else {
             return res.status(403).send({success: false, msg: 'No token provided.'});

         }
     }


 })
     .post({
         //add this post's id to the user's beer collection
     userId: null,

     //Check for credentials
     before: function(req, res, next) {

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
             return res.status403.send({success: false, msg: 'No token provided.'});

         }
     },

     after: function(req, res, next){
         var id = res.resource.item._id;
         console.log("req", req);
         console.log("idtopush", res.resource);
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
     })/*
  DELETE
  */
     .delete({
         userId: null,
         before: function (req, res, next) {

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
         after: function (req, res, next) {
             console.log('-------cleaning up beers in users------');

             // // get the style id
             var beerid = res.resource.item._id;
             console.log("this should be deleted:", beerid);
             console.log("From this user:", userId);

             // /set parameters for the search
             var condition = {_id: userId},
                 update = {$pull: {ubeers: {beer: beerid}}},
                 options = {multi: true}; // check all beer documents

             var userModel = app.models.users.model('users');

             //remove it
             userModel.update(condition, update, options, function (err, numAffected) {
                 console.log(numAffected.ok);
             });

             console.log('----------------------------');

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
                     next();
                 }
             });
         } else {
             return res.status(403).send({success: false, msg: 'No token provided.'});

         }
     }
 }).put({
     userId: null,
     beerId: null,
     before: function (req, res, next) {
         console.log("params:", req.params);
         beerId = req.params.beerId;

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

                     console.log("idtopush", beerId);
                     console.log("userId to add it to", userId);

                     // /set parameters for the add
                     var condition = {"_id": userId}
                         , update = {$addToSet:{"ubeers":{"beer": beerId, "loved": req.body.loved}}}    // set it to null
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
         } else {
             return res.status(403).send({success: false, msg: 'No token provided.'});

         }
     }
     //NOW ADD the beer to the users stash
     /*after: function(req, res, next){
         var id = beerId;
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
     }*/


    });
    getToken = function (headers) {
        if (headers && headers.authorization) {
            var parted = headers.authorization.split(' ');

            if (parted.length === 2) {
                return parted[1];
            } else {
                return null;
            }
        } else {
            return null;
        }
    };
  // Return middleware.
  return function(req, res, next) {


    next();
  };
};
