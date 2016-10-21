var mongoose = require('mongoose');

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
      ref: 'beer',
      required: false
    },
    loved: {
      type:Boolean,
      required: false
    }}],
  ulocations: [{
    locations:{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'location',
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

// Export the model.
//module.exports = BeerSchema;
module.exports = mongoose.model('user', UserSchema);
