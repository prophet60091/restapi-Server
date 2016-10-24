
var Resource = require('resourcejs');
module.exports = function(app, route) {

    // Setup the controller for REST;
    Resource(app, '/user/:userId', route,  app.models.user).rest({
         // Add a before handler to include filter and parent information.
         before: function(req, res, next) {
             req.body.date = new Date();//req.params.userId;
             console.log(req.body.date);
             req.modelQuery = this.model.where('user', req.params.userId);
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
