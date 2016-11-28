var Resource = require('resourcejs');
var passport = require('passport');
var config = require('../config/server');
var jwt = require('jwt-simple');
var helper = require('../helpers/auth');
module.exports = function(app, route) {

  // Setup the controller for REST;
  Resource(app, '', route,  app.models.locations).rest({

    before: function(req, res, next){
      var authUserID = new helper.checkAuth(req.headers, app.models.users, function(userID){
        console.log(userID);
      });
      console.log(authUserID);
      next();
    }



  });

  // Return middleware.
  return function(req, res, next) {

    next();
  };
};
