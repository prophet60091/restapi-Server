// var restful = require('node-restful');
// //var Resource = require('resourcejs');
// module.exports = function(app, route) {
//
//   // Setup the controller for REST;
//   //Resource(app, '', route, app.models.beer).rest(); // we didn't install resources its having issues
//
//   var rest = app.resource = restful.model(
//       'beer',
//       app.models.beer
//   ).methods(['get','put','post','delete' ]);
//
//   //register the endpoint of the application - (i.e. defines it as a place where a rest api is available)
//     rest.register(app, route);
//   console.log(rest);
//
//   // Return middleware.
//   return function(req, res, next) {
//     //res.send('[{"_id":"57f960dfb722d0350c11120b","name":"Decadent","brewery":"ska","style":"Double IPA","alcohol_content":"9","origin":"Durango Colorado","location":"","__v":0},{"_id":"57f99a6b6640400d4c7a1c01","name":"Modus Hoparandi","brewery":"ska","style":" IPA","alcohol_content":"6.5","location":"","origin":"Durango, Colorado","__v":0}]')
//     next();
//   };
// };

//var Resource = require('resourcejs');
// pass passport for configuration
var passport	= require('passport');
require('../config/passport')(passport);

module.exports = function(app, route) {

    // // Setup the controller for REST;
    // Resource(app, '', route,  app.models.user).rest();

    // Return middleware.
    return function(req, res, next) {

        if (!req.body.name || !req.body.password) {
            res.json({success: false, msg: 'Please pass name and password.'});
        } else {
            var newUser = new User({
                name: req.body.name,
                password: req.body.password
            });
            // save the user
            newUser.save(function(err) {
                if (err) {
                    return res.json({success: false, msg: 'Username already exists.'});
                }
                res.json({success: true, msg: 'Successful created new user.'});
            });
        }

        next();
    };
};
