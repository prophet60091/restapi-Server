
var Resource = require('resourcejs');
module.exports = function(app, route) {

    // Setup the controller for REST;
    Resource(app, '', route,  app.models.users).rest({
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

                        //return only those belonging to
                        app.models.locations.find({'_id': {
                                $in: _.map(user.ulocations, 'location')} },
                            function(err, docs){
                                return  res.status(200).send(docs);
                            });

                    }
                });
            } else {
                return res.status(403).send({success: false, msg: 'No token provided.'});

            }
        }
    });

    // Return middleware.
    return function(req, res, next) {

        next();
    };
};
