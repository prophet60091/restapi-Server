var mongoose = require('mongoose');

// Create the Schema.
var BeerSchema = new mongoose.Schema({
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
  location: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'locations',
    required: false
  },
  style: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'styles',
    required: false
  },
  alcohol_content: {
    type: Number,
    max: 20,
    required: false
  },
  ibu: {
    type: Number,
    max: 9999,
    required: false
  },
  image: {
    type: String,
    maxlength: 255,
    required: false
  },
  date: {
    type: Date,
    required: false
  }
});


// Export the model.
//module.exports = BeerSchema;
module.exports = mongoose.model('beers', BeerSchema);
