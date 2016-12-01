var mongoose = require('mongoose');

// Create the Schema.
var LocationSchema = new mongoose.Schema({
  name: {
    type: String,
    maxlength: 60,
    required: true
  },
  type: {
    type: String,
    maxlength: 60,
    required: true
  },
  address: [{
    number: {
      type: String,
      required: true,
      maxlength: 60
    },
    street: {
      type: String,
      required: true,
      maxlength: 60
    },
    unit:{
      type: String,
      required: false,
      maxlength: 60
    },
    city:{
      type: String,
      required: false,
      maxlength: 60
    },
    state:{
      type: String,
      required: false,
      maxlength: 60
    },
    zip:{
      type: String,
      required: false,
      maxlength: 10
    }
  }],
  beer_in_stock: [{
    beer:{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'beers',
      required: false
    },
    vessel: {
      type:String,
      maxlength: 60,
      required: false
    },
    on_sale: {
      type:String,
      maxlength: 60,
      required: false
    },
    price: {
      type:Number,
      maxlength: 6,
      required: false
    },
    unit: {
      type:String,
      maxlength: 60,
      required: false
    }

  }],
  date: {
    type: Date,
    required: false
  }
});

// Export the model.
//module.exports = BeerSchema;
module.exports = mongoose.model('locations', LocationSchema);
