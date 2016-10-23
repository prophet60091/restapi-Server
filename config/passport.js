//reference https://devdactic.com/restful-api-user-authentication-1/
// refernce https://github.com/themikenicholson/passport-jwt
var JwtStrategy = require('passport-jwt').Strategy;

// load up the user model
var User = require('../models/User');
var config = require('./server'); // get db config file

// var opts = {}
// opts.jwtFromRequest = ExtractJwt.fromAuthHeader();
// opts.secretOrKey = 'secret';
// opts.issuer = "accounts.examplesoft.com";
// opts.audience = "yoursite.net";

module.exports = function(passport) {
    var opts = {};
    opts.secretOrKey = config.secret;
    passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
        User.findOne({id: jwt_payload.id}, function(err, user) {
            if (err) {
                return done(err, false);
            }
            if (user) {
                done(null, user);
            } else {
                done(null, false);
            }
        });
    }));
};