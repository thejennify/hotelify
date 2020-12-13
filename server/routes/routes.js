const router = require('express').Router();

const compareDates = (date1, date2) => {
  if (!date1 || !date2) return 0;
  let d1 = date1.split('-');
  let d2 = date2.split('-');
  if (parseInt(d1[0]) < parseInt(d2[0])) return -1;
  if (parseInt(d1[0]) > parseInt(d2[0])) return 1;
  if (parseInt(d1[1]) < parseInt(d2[1])) return -1;
  if (parseInt(d1[1]) > parseInt(d2[1])) return 1;
  if (parseInt(d1[2]) < parseInt(d2[2])) return -1;
  if (parseInt(d1[2]) > parseInt(d2[2])) return 1;
  return 0;
}

module.exports = (City, Hotel) => {

  router.get('/cities', (req, res) => {
    City.find()
    .then((cities) => res.json({success: true, cities}))
    .catch(() => res.json({success: false}));
  });

  router.get('/hotels/:city', (req, res) => {
    Hotel.find({city: req.params.city.replace('+', ' ')})
    .then((hotels) => res.json({success: true, hotels}))
    .catch(() => res.json({success: false}));
  });

  router.get('/search/:city', (req, res) => {
    Hotel.find({city: req.params.city.replace('+', ' ')})
    .populate({
      path: 'listings',
      populate: {path: 'host', select: 'name email gender imgUrl bio languages'},
    })
    .then(data => {
      let hotels = [];
      for (let i = 0; i < data.length; i++) {
        hotels[i] = {
          _id: data[i]._id,
          name: data[i].name,
          stars: data[i].stars,
          rating: data[i].rating,
          images: data[i].images,
          description: data[i].description,
          location: data[i].location,
          listings: data[i].listings,
        };
      }
      hotels = hotels.map((hotel) => {
        if (req.query.stars && hotel.stars < req.query.stars) return null;
        if (req.query.rating && hotel.rating < req.query.rating) return null;
        if (req.query.from && req.query.to || req.query.price || req.query.gender || req.query.guests) {
          for (let i = 0; i < hotel.listings.length; i++) {
            if ( compareDates(hotel.listings[i].from, req.query.from) === 1
              || compareDates(hotel.listings[i].to, req.query.to) === -1
              || req.query.price && req.query.price < hotel.listings[i].price
              || req.query.gender && req.query.gender !== hotel.listings[i].user.gender
              || req.query.guests && req.query.guests > hotel.listings[i].guests
            ) {
              hotel.listings.splice(i, 1);
              i--;
            }
          }
        }
        if (!hotel.listings.length) return null;
        return hotel;
      });
      hotels = hotels.filter((hotel) => (hotel));
      res.json({success: true, hotels});
    })
    .catch(() => res.json({success: false}));
  });

  return router;
}
