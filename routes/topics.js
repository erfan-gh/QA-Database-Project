var express = require('express');
var router = express.Router();
var models = require('../models');
var auth = require('./auth')

router.get('/', function(req, res, next) {
	models.Topic.aggregate([
	  { "$match": {} },
	  { "$lookup": {
	    "localField": "creator_id",
	    "from": "users",
	    "foreignField": "_id",
	    "as": "userinfo"
	  } },
	], function(err, doc) {
		params = []
		for(i in doc) {
			params.push({title: doc[i].title, first_name: doc[i].userinfo[0].first_name, last_name: doc[i].userinfo[0].last_name});
		}

		res.render('topics', {topics: params});
	});
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
	topic.skills = req.body.skills.split(',');
	topic.save(function(err) {
		if (err) res.render('error', {message: err.message, error: err});
		else res.redirect('/topics');
	});
});



module.exports = router;