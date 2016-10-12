var mongoose = require('mongoose');

// Create the Schema.
var BeerSchema = new mongoose.Schema({
  name: {
    type: String,
    maxlength: 60,
    required: true
  },
  brewery: {
    type: String,
    maxlength: 60,
    required: false
  },
  style: {
    type: String,
    maxlength: 60,
    required: true
  },
  alcohol_content: {
    type: Number,
    max: 15,
    required: false
  },
  origin: {
    type:String ,
    maxlength: 60,
    required: false
  },
  location: {
    type:String ,
    maxlength: 60,
    required: false
  },
  loved: {
    type:Boolean,
    required: false
  }
});

// Export the model.
//module.exports = BeerSchema;
module.exports = mongoose.model('beer', BeerSchema);
