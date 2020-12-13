const mongoose = require('mongoose');

const citySchema = new mongoose.Schema({
  name: String,
  map: {
    lat: Number,
    long: Number,
    zoom: Number,
  },
  img: String,
});

const City = mongoose.model('City', citySchema);

module.exports = City;
