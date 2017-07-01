var express = require('express');
var router = express.Router();
var models = require('../models');
var auth = require('./auth')

router.get('/', auth, function(req, res, next) {
  res.send('Topics here')
});

router.get('/create', auth, function(req, res, next) {
	res.render('create-topic');
});

router.post('/create', auth, function(req, res, next) {
	var question = new models.Post({
		body: req.body.body,
		creator_id: req.user._id,
	});

	question.save(function(err) {
		if (err) res.render('error', {message: err.message, error: err});
	});

	var topic = new models.Topic({
		title: req.body.title,
		creator_id: req.user._id,
		question_id: question._id,
		answers: {},
	});

	topic.save(function(err) {
		if (err) res.render('error', {message: err.message, error: err});
		else res.redirect('/topics');
	});
});


module.exports = router;