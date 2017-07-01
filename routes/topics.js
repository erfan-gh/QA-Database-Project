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

module.exports = router;