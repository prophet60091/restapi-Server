var mongoose = require('mongoose');

// Create the Schema.
var BeerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  brewery: {
    type: String,
    required: false
  },
  style: {
    type: String,
    required: true
  },
  alcohol_content: {
    type: Number,
    required: false
  },
  origin: {
    type:String ,
    required: false
  },
  location: {
    type:String ,
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
