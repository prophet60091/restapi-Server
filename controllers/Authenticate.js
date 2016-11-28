//Controls the Signup of users with salted and hashed passwords
//refernce https://www.npmjs.com/package/resourcejs
//reference https://devdactic.com/restful-api-user-authentication-1/

var Resource = require('resourcejs');
var jwt = require('jwt-simple');
var config =  require('../config/server');

module.exports = function(app, route) {

    app.post("/authorize", function(req, res) {

        var User = app.models.users;

        User.findOne({
            name: req.body.name
        }, function(err, user) {
            if (err) throw err;

            if (!user) {
                res.send({success: false, msg: 'Authentication failed. User not found.'});

            }else if(!req.body.password){
                res.send({success: false, msg: 'Password Missing'});

            }else{
                // check if password matches
                user.comparePassword(req.body.password, function (err, isMatch) {
                    if (isMatch && !err) {
                        //if user is found and password is right create a token
                        var token = jwt.encode(user, config.secret);

                        //return the information including token as JSON
                        res.json({success: true, token: 'JWT ' + token, id: user.id });

                    } else {
                        res.send({success: false, msg: 'Authentication failed. Password was incorrect.'});

                    }

                //todo update the users lastlogin
                });
            }
        });
    });


    // Return middleware.
    return function(req, res, next) {

        next();
    };


    // return function(req, res, next) {
    //     if (!req.body.name || !req.body.password) {
    //         res.json({success: false, msg: 'Please pass name and password.'});
    //     } else {
    //         var newUser = new User({
    //             name: req.body.name,
    //             password: req.body.password
    //         });
    //         // save the user
    //         newUser.save(function (err) {
    //             if (err) {
    //                 return res.json({success: false, msg: 'Username already exists.'});
    //             }
    //             res.json({success: true, msg: 'Successful created new user.'});
    //         });
    //     }
    //     next();
    // }
};
