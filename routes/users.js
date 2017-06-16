var express = require('express');
var router = express.Router();
var models = require('../models');
var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy;

passport.use(new LocalStrategy(
	{
		usernameField: 'email',
    	passwordField: 'password',
	},
	function(username, password, done) {
		models.User.findOne({ email: username }, function(err, user) {
			if (err) { return done(err); }
			if (!user) {
			return done(null, false, { message: 'Incorrect username.' });
			}
			if (!user.validPassword(password)) {
			return done(null, false, { message: 'Incorrect password.' });
			}
			return done(null, user);
		});
	}
));

passport.serializeUser(function(user, done) {
  done(null, user._id);
});

passport.deserializeUser(function(id, done) {
  models.User.findById(id, function(err, user) {
    done(err, user);
  });
});


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/register', function(req, res, next) {
	res.render('register');
});

router.post('/register', function(req, res, next) {
	var user = new models.User(req.body);

	user.save(function(err) {
		if (err) res.render('error', {message: err.message, error: err});
		else res.redirect('/users');
	});
});

router.get('/login', function(req, res, next) {
  res.render('login');
});

router.post('/login', passport.authenticate('local', { successRedirect: '/', failureRedirect: '/login', failureFlash: false }));

module.exports = router;
