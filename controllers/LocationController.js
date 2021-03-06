var Resource = require('resourcejs');
var passport = require('passport');
var config = require('../config/server');
var jwt = require('jwt-simple');
module.exports = function(app, route) {
var userID = null;
  // Setup the controller for REST;
  Resource(app, '', route,  app.models.locations).get({

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
  /*
   POST
   */
    .post({
    //add this post's id to the user's beer collection
    //before: function(req, res, next){} TODO Check if location exists in system first?, then just add to the users stuff
    userId: null,
    before: function(req, res, next){
      //Check for credentials

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
  })
  /*
   DELETE
   */
    .delete({
    userId: null,
    before:function(req, res, next){

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
      console.log('-------cleaning up locations in users------');

      // // get the style id
      var locationid = res.resource.item._id;
      console.log("this should be deleted:", locationid);
      console.log("From this user:", userId);

      // /set parameters for the search
      var condition = {_id: userId},
          update = {$pull: {ulocations: {location: locationid  }}},
          options = { multi: true }; // check all beer documents

      var userModel = app.models.users.model('users');

      //remove it
      userModel.update(condition, update, options, function (err, numAffected){
        console.log(numAffected.ok);
      });

      console.log('----------------------------');

      next();
    }
    /*
    PUT
     */
  }).put({
    userId: null,
    before:function(req, res, next){
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
  }).index();
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
