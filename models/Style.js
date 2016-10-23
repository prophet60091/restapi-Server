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
  },
  related_styles: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'beers',
    required: false
  }],

});

// Export the model.
//module.exports = BeerSchema;
module.exports = mongoose.model('style', StyleSchema);