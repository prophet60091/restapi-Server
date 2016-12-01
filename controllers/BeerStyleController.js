

var Resource = require('resourcejs');
module.exports = function(app, route) {

  // Setup the controller for REST;
 Resource(app, '/beer/:beerId', route,  app.models.styles).rest({
    before: function(req, res, next) {
        console.log(route);
        console.log(app.models.styles)
    }

     // // Add a before handler to include filter and parent information.
     // before: function(req, res, next) {
     //     req.body.parent = req.params.parentId;
     //     req.modelQuery = this.model.where('parent', req.params.parentId);
     //     next();
     // }
    /*// The child REST interface.
     Resource(app, '/parent/:parentId', 'child', Child).rest({

     // Add a before handler to include filter and parent information.
     before: function(req, res, next) {
     req.body.parent = req.params.parentId;
     req.modelQuery = this.model.where('parent', req.params.parentId);
     next();
     }*/

     // //Add a before handler to include filter and parent information.
     // before: function(req, res, next) {
     //     req.body.beer = req.params.beerId;
     //     req.modelQuery = this.model.where('beer', req.params.beerId);
     //     next();
     // }

})

  // Return middleware.
  return function(req, res, next) {


    next();
  };
};
