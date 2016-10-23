var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

// Create the Schema.
var UserSchema = new mongoose.Schema({
  name: {
    type: String,
    maxlength: 60,
    required: true
  },
  email: {
    type: String,
    maxlength: 255,
    required: true
  },
  password: {
    type: String,
    required: true,
    bcrypt: true
  },
  ubeer: [{
    beer:{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'beers',
      required: false
    },
    loved: {
      type:Boolean,
      required: false
    }}],
  ulocations: [{
    locations:{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'locations',
      required: false
    },
    loved: {
      type:Boolean,
      required: false
    }}],
  date: {
    type: Date,
    required: false
  }
});


//based on https://devdactic.com/restful-api-user-authentication-1/
//salt the password before storing it
UserSchema.pre('save', function (next) {
    var user = this;
    if (this.isModified('password') || this.isNew) {
        bcrypt.genSalt(10, function (err, salt) {
            if (err) {
                return next(err);
            }
            bcrypt.hash(user.password, salt, function (err, hash) {
                if (err) {
                    return next(err);
                }
                user.password = hash;
                next();
            });
        });
    } else {
        return next();
    }
});

// check if it matches the password in the database
UserSchema.methods.comparePassword = function (passw, callback) {
    bcrypt.compare(passw, this.password, function (err, isMatch) {
        if (err) {
            return callback(err);
        }
        callback(null, isMatch);
    });
};

// Export the model.
//module.exports = BeerSchema;
module.exports = mongoose.model('user', UserSchema);
