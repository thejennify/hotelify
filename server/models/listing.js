const mongoose = require('mongoose');

const listingSchema = new mongoose.Schema({
  host: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  hotel: {
    type: mongoose.Schema.ObjectId,
    ref: 'Hotel',
    required: true,
  },
  room: {
    type: String,
    required: true,
  },
  guests: {
    type: Number,
    required: true,
  },
  from: {
    type: String,
    required: true,
  },
  to: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  info: {
    type: String,
    required: true,
  },
});

const Listing = mongoose.model('Listing', listingSchema);

module.exports = Listing;
