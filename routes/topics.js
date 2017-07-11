var express = require('express');
var async = require('async');
var router = express.Router();
var models = require('../models');
var auth = require('./auth');

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
			params.push({topic_id: doc[i]._id, title: doc[i].title, first_name: doc[i].userinfo[0].first_name, last_name: doc[i].userinfo[0].last_name});
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
		comments: [],
	});

	question.save(function(err) {
		if (err) console.log(err);
	});

	var topic = new models.Topic({
		title: req.body.title,
		creator_id: req.user._id,
		question_id: question._id,
		answers: [],
	});
	topic.skills = req.body.skills.split(',');
	topic.save(function(err) {
		if (err) res.render('error', {message: err.message, error: err});
		else res.redirect('/topics');
	});
});


router.get('/view/:topic_id', function(req, res, next) {
	async.waterfall(
    [
    	function(cb) {
    		models.Topic.findById(req.params.topic_id, function(err, doc) {
    			cb(null, doc);
    		});
    	},
    	function(topic, cb) {
    		models.Post.findById(topic.question_id).populate('comments').exec(function(err, doc) {
    			cb(null, topic, doc);
    		});
    	},
    	function(topic, question, cb) {
    		models.Post.find({_id: {$in: topic.answers}}).populate('comments').exec(function(err, doc) {
    			cb(null, topic, question, doc);
    		});
    	},
    ], function(err, topic, question, answers) {
    	console.log(question);
    	res.render('view-topic', {topic: topic, question: question, answers: answers});
    });
});


router.post('/comment', auth, function(req, res, next) {
	comment = new models.Comment({
		body: req.body.body,
		creator_id: req.user._id,
	});

	comment.save(function(err) {
		if (err) console.log(err);
	});

	models.Post.findByIdAndUpdate(req.body.post_id, {$push: {comments: comment._id}}, function(err) {
		if (err) res.render('error', {message: err.message, error: err});
		else res.redirect('/topics');
	});
});


module.exports = router;