//Controls the Signup of users with salted and hashed passwords
//refernce https://www.npmjs.com/package/resourcejs
//reference https://devdactic.com/restful-api-user-authentication-1/

var Resource = require('resourcejs');
var validator= require('validator');

module.exports = function(app, route) {

    // // pass passport for configuration
    // var passport	= require('passport');
    // require('../config/passport')(passport);

    var gandalf = false;

    Resource(app, '', route,  app.models.user).post({

        before: function(req, res, next) {
            var User = app.models.user;
            gandalf = false; //you shall not post

            // check if form complete
            if (!req.body.name || !req.body.password  || !req.body.email  ) {
                res.json({success: false, msg: 'Please pass name and password. and Email'});

            //validate the email
            } else if (!validator.isEmail(req.body.email)){
                res.json({success: false, msg: 'Invalid E-mail'});
            }
            //run, you fools!
            else {
                gandalf = true;
                res.json({success: true, msg: "Successfully created a new user"});
            }
            next();
        },
        // after:function(req,res,next){
        //     if(gandalf){
        //         if (res.err) {
        //             return res.json({success: false, msg: res.err});
        //         }
        //         res.json({success: true, msg: "Successfully created a new user"});
        //
        //     }
        //     //next();
        // }
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
