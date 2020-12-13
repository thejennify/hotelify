const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    fname: {
      type: String,
      required: true,
    },
    lname: {
      type: String,
      required: true,
    },
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  phone: {
    type: Number,
    required: true,
  },
  verified: {
    type: Boolean,
    default: false,
  },
  birthday: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other'],
    required: true,
  },
  imgUrl: String,
  bio: String,
  languages: [String],
});

const User = mongoose.model('User', userSchema);

module.exports = User;
