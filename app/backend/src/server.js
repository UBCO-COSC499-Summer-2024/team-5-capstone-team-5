const express = require('express');
const cors = require('cors');
const flash = require('connect-flash');
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('./passportConfig');

const app = express();

app.use(cors({
  origin: 'http://localhost:3000', // Replace with your client URL
  credentials: true // Allow cookies to be sent
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
  secret: 'your_secret_key',
  resave: false,
  saveUninitialized: false
}));

app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

app.set('view engine', 'ejs');
app.set('views', './views');

app.post('/api/auth/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true
}));

app.get('/login', (req, res) => {
  res.render('login', { message: req.flash('error') });
})

app.get('/api/auth/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) { return next(err); }
    res.json({ message: 'Logged out successfully' });
  });
});

module.exports = app;
