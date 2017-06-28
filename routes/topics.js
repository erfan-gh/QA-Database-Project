var express = require('express');
var router = express.Router();
var models = require('../models');
var auth = require('./auth')

router.get('/', auth, function(req, res, next) {
  res.send('Topics here')
});

module.exports = router;