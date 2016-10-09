var restful = require('node-restful');
module.exports = function(app, route) {

  // Setup the controller for REST;
  //Resource(app, '', route, app.models.movie).rest(); // we didn't install resources its having issues

  var rest = restful.model(
      'beer',
      app.models.beer
  ).methods(['get', 'put', 'post', 'delete' ]);

  //register the endpoint of the application - (i.e. defines it as a place where a rest api is available)
    rest.register(app, route);

  // Return middleware.
  return function(req, res, next) {
    next();
  };
};
