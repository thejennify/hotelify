require('dotenv').config();
const app = require('express')();
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo')(session);
const cors = require('cors');
const axios = require('axios');

const routes = require('./routes/routes');
const auth = require('./routes/auth');
const protected = require('./routes/protected');


const User = require('./models/user');
const City = require('./models/city');
const Hotel = require('./models/hotel');
const Listing = require('./models/listing');

mongoose.connection.on('connected', () => {
  console.log('Connected to database!');
 
});

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true })

app.use(cors());
app.use(bodyParser.json());
app.use(session({
  secret: process.env.SECRET,
  resave: true,
  saveUninitialized: true,
  store: new MongoStore({
    mongooseConnection: mongoose.connection,
    stringify: false
  }),
}));

passport.serializeUser((user, done) => done(null, user._id));

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => done(err, user));
});

passport.use(new LocalStrategy((username, password, done) => {
  User.findOne({email: username}, (err, user) => {
    if (err) return done(err);
    if (!user) return done(null, false);
    if (user.password !== password) return done(null, false);
    return done(null, user);
  });
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/api', routes(City, Hotel));
app.use('/api', auth(passport, axios, User));
app.use('/api', protected(User, Hotel, Listing));

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server listening on port ${port}!`));
