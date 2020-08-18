const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  images: [{
    fireBaseUrl: String,
    filename: String
  }],
  name: String,
  prodId: String,
  description: String,
  price: Number,
  features: [String],
  specs: [String]
  // index: Number
});

module.exports.productSchema = productSchema;