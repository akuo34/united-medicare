const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  images: [{
    fireBaseUrl: String,
    filename: String
  }],
  name: String,
  description: String,
  price: Number,
  // index: Number
});

module.exports.productSchema = productSchema;