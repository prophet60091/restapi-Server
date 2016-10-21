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
  brewery: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'locations',
    required: false
  },
  style: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'styles',
    required: true
  },
  alcohol_content: {
    type: Number,
    max: 3,
    required: false
  },
  ibu: {
    type: Number,
    max: 4,
    required: false
  },
  origin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'locations',
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
module.exports = mongoose.model('beer', BeerSchema);
