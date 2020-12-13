const mongoose = require('mongoose');

const hotelSchema = new mongoose.Schema({
  city: String,
  name: String,
  stars: Number,
  rating: Number,
  images: [String],
  description: String,
  location: {
    lat: Number,
    long: Number,
  },
  listings: [{
    type: mongoose.Schema.ObjectId,
    ref: 'Listing',
  }],
});

const Hotel = mongoose.model('Hotel', hotelSchema);

module.exports = Hotel;
