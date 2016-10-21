var mongoose = require('mongoose');

// Create the Schema.
var StyleSchema = new mongoose.Schema({
  name: {
    type: String,
    maxlength: 60,
    required: true
  },
  description: {
    type: String,
    maxlength: 255,
    required: true
  }

});

// Export the model.
//module.exports = BeerSchema;
module.exports = mongoose.model('style', StyleSchema);
