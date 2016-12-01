var Resource = require('resourcejs');
var passport = require('passport');
var config = require('../config/server');
var jwt = require('jwt-simple');
module.exports = function(app, route) {

  // Setup the controller for REST;
  Resource(app, '', route,  app.models.locations).rest({
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

  }).post({
    //add this post's id to the user's beer collection
    //before: function(req, res, next){} TODO Check if location exists in system first?, then just add to the users stuff

    after: function(req, res, next){
      console.log(res);
      var id = res.resource.item._id;
      //console.log("idtopush", id);
      //console.log("userId to add it to", userId);

      // /set parameters for the add
      var condition = {"_id": userId}
          , update = {$addToSet:{"ulocations":{"locations":id, "loved": req.body.loved}}}    // set it to null
          , options = { }; // check all beer documents

      var user = app.models.locations.model('locations');

      //add it
      user.update(condition, update, options, cb);

      function cb(err, model){
        console.log(model);
      }

      next();
    }
  }).delete({

    after: function(req, res, next){
      console.log('-------cleaning up locations in users------');
      // get the style id
      var id = res.resource.item._id;
      console.log(id);

      // // /set parameters for the search
      // var condition = {location: id}
      //     , update = {style: null }    // set it to null
      //     , options = { multi: true }; // check all beer documents
      //
      // var location = app.models.locations.model('locations');
      //
      // //remove it
      // location.update(condition, update, options, cb);
      //
      // function cb(err, numAffected){
      //   console.log(numAffected.ok);
      // }
      console.log('----------------------------');

      // console.log('-------cleaning up internal references------');
      // // get the style id
      // var id = res.resource.item._id;
      //
      // //find out which styles have it
      // condition = {style: id};
      // var styles = app.models.styles.model('styles');
      //
      // //remove it
      // beer.update(condition, {style: null}, cb);
      // function cb(err, numAffected){
      //     console.log(numAffected);
      // }
      // console.log('----------------------------');


      next();
    }
  });;
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
