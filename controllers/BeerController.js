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

var Resource = require('resourcejs');
module.exports = function(app, route) {

  // Setup the controller for REST;
 Resource(app, '', route,  app.models.beer).rest();

  // Return middleware.
  return function(req, res, next) {


    next();
  };
};
