const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
  host: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  listing: {
    type: mongoose.Schema.ObjectId,
    ref: 'Listing',
    required: true,
  },
  guest: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
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
});

const Request = mongoose.model('Request', requestSchema);

module.exports = Request;
