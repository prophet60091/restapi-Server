
var Resource = require('resourcejs');
module.exports = function(app, route) {

    // Setup the controller for REST;
    Resource(app, '/beer/:beerId', route,  app.models.users).rest({
         // Add a before handler to include filter and parent information.
         before: function(req, res, next) {
             req.body.beers = req.params.beerId;
             console.log(req.body.beer);
             req.modelQuery = this.model.where('beers', req.params.beerId);
             console.log(req.modelQuery);
             // res.json({success: false, msg: 'blah blah blah'});

            next();
         }

});

    // Return middleware.
    return function(req, res, next) {

        next();
    };
};
