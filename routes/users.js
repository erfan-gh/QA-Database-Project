var express = require('express');
var router = express.Router();
var models = require('../models');
var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy;
var auth = require('./auth');
var multer  = require('multer')
var path = require('path')

var storage = multer.diskStorage({
	destination: function(req, file, cb) {
		cb(null, 'media');
	},
	filename: function(req, file, cb) {
		cb(null, Date.now() + path.extname(file.originalname));
	},
});

var upload = multer({ storage: storage });

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
router.get('/', auth, function(req, res, next) {
	res.send('User profile here')
});

router.get('/register', function(req, res, next) {
	res.render('register');
});

router.post('/register', upload.single('userPhoto'), function(req, res, next) {
	var user = new models.User(req.body);
	user.skills = req.body.skills.split(',');
	if (req.file) {
		user.profile_name = req.file['filename'];
	}

	user.save(function(err) {
		if (err) res.render('error', {message: err.message, error: err});
		else res.redirect('/users');
	});
});

router.get('/edit', auth, function(req, res, next) {
	res.render('edit-profile', {user_id: req.user._id});
});

router.post('/edit/:user_id', upload.single('userPhoto'), function(req, res, next) {
	models.User.findByIdAndUpdate(req.params.user_id, req.body, function(err) {
		if (err) res.render('error', {message: err.message, error: err});
		else res.redirect('/topics');
	});
});


router.get('/login', function(req, res, next) {
  res.render('login');
});

router.get('/logout', function(req, res, next) {
	req.logout();
	res.redirect('/');
});

router.post('/login', passport.authenticate('local', { successRedirect: '/', failureRedirect: '/users/login', failureFlash: false }));

module.exports = router;
