const router = require('express').Router();
const crypto = require('crypto');

function hashPassword(password) {
  let hash = crypto.createHash('sha256');
  hash.updateOne(password);
  return hash.digest('hex');
}

module.exports = (passport, axios, User) => {

  router.post('/login', (req, res, next) => {
    req.body.password = hashPassword(req.body.password);
    passport.authenticate('local', (err, user) => {
      if (err) return res.json({success: false});
      if (!user) return res.json({success: false});
      if (!user.verified) return res.json({success: false, msg: 'verify'})
      req.logIn(user, (err) => {
        if (err) return res.json({success: false});
        return res.json({success: true});
      });
    })(req, res, next);
  });

  router.post('/register', (req, res) => {
    axios.post('https://api.authy.com/protected/json/phones/verification/start', {
      api_key: process.env.TWILIO_API_KEY,
      via: 'sms',
      country_code: 1,
      phone_number: req.body.phone,
      code_length: 4,
    })
    .then((resp) => {
      if (resp.data.success) {
        (new User({
          name: {fname: req.body.fname, lname: req.body.lname},
          email: req.body.email,
          password: hashPassword(req.body.password),
          phone: req.body.phone,
          birthday: req.body.birthday,
          gender: req.body.gender,
        })).save()
        .then(() => res.json({success: true}))
      } else res.json({success: false, msg: 'phone'})
    })
    .catch((err) => res.json({success: false}));
  });

  router.post('/verify', (req, res) => {
    axios.get('https://api.authy.com/protected/json/phones/verification/check', {
      params: {
        api_key: process.env.TWILIO_API_KEY,
        country_code: 1,
        phone_number: req.body.phone,
        verification_code: req.body.code,
      }
    })
    .then((resp) => {
      if (resp.data.success) {
        User.findOneAndUpdate({phone: req.body.phone}, {$set: {verified: true}})
        .then(() => res.json({success: true}))
      }
    })
    .catch((err) => res.json({success: false}));
  });

  router.use((req, res, next) => {
    if (req.user) next();
    else res.json({success: false});
  });

  router.post('/logout', (req, res) => {
    req.logout();
    res.json({success: true});
  });

  return router;
};
