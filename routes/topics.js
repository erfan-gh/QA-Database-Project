var express = require('express');
var async = require('async');
var router = express.Router();
var models = require('../models');
var auth = require('./auth');
var mongoose = require('mongoose');

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

router.get('/search', function(req, res, next){
	res.render('search');
});

router.post('/search', function(req, res, next){
	keywords_array = req.body.query.split(' ');

	models.Topic.aggregate([
	   { "$match": { "skills": {"$in": keywords_array } }},
	   { "$project": {
           "title": 1,
	       "tagMatch": {
	           "$setIntersection": [
	               "$skills",
	               keywords_array
	           ]
	       },
	       "sizeMatch": {
	           "$size": {
	               "$setIntersection": [
	                   "$skills",
	                   keywords_array
	               ]
	           }
	       }
	   }},
	   { "$match": { "sizeMatch": { "$gte": 1 } } },
	   { "$sort" : { "sizeMatch": -1 } },
	   { "$project": { "title": 1, "tagMatch": 1} },
	], function(err, doc) {
		res.render('search-result', {topics: doc});
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


router.post('/answer/:topic_id', auth, function(req, res, next) {
	topic_id = req.params.topic_id;
	answer = new models.Post({
		body: req.body.body,
		creator_id: req.user._id,
		comments: [],
	});

	answer.save(function(err) {
		if (err) console.log(err);
	});

	models.Topic.findByIdAndUpdate(topic_id, {$push: {answers: answer._id}}, function(err) {
		if (err) res.render('error', {message: err.message, error: err});
		else res.redirect('/topics');
	})
});

router.get('/rate/:post_id/up', auth, function(req, res, next) {
	rate_obj = new models.Rate({
		user_id: req.user._id,
		rate: 25,
		post_id: req.params.post_id,
	});

	rate_obj.save(function(err) {
		if (err) console.log(err);
	});

	res.redirect('/topics');
});

router.get('/rate/:post_id/down', auth, function(req, res, next) {
	rate_obj = new models.Rate({
		user_id: req.user._id,
		rate: -25,
		post_id: req.params.post_id,
	});

	rate_obj.save(function(err) {
		if (err) console.log(err);
	});

	res.redirect('/topics');
});

router.get('/rate/:post_id/', function(req, res, next) {
	models.Rate.aggregate([
		{ "$match": { "post_id": mongoose.Types.ObjectId(req.params.post_id) }},
		{ "$group": { "_id" : null, sum : { "$sum": "$rate" } } }
	], function(err, doc) {
		if (doc.length == 0)
			res.send("" + 0);
		else
			res.send("" + doc[0].sum);
	});
});

module.exports = router;