const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  stripeBrand: String,
  stripeCustomerId: String,
  stripeExpMonth: Number,
  stripeExpYear: Number,
  stripeLast4: Number,
  stripeSource: String,
  status: String,
  _user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  _listing: {
    type: mongoose.Schema.ObjectId,
    ref: 'Listing',
    required: true,
  },
});

const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment;
