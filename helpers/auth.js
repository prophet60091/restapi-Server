var passport = require('passport');
var config = require('../config/server');
var jwt = require('jwt-simple');

module.exports= {

    checkAuth: function (headers, model) {
        var token = getToken(headers);
        var userID = null;
        if (token) {

            var decoded = jwt.decode(token, config.secret);
            model.findOne({
                name: decoded.name
            }, function (err, user) {
                if (err) throw err;

                if (!user) {
                    //err = {success: false, msg: 'Authentication failed. User not found.'};
                    console.log("nope no user");
                } else {
                    //set the user Id of the requestor
                   return  user._id;

                }
            });
        } else {
            //err = {success: false, msg: 'No token provided.'};
            console.log("nope no token bruh");
        }
    },
    getToken: function (headers) {
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
    }
};