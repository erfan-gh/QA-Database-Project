var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/qa");

var User = require('./user');
// var Topic = require('./topic');

module.exports = {
	User: User,
	// Topic: Topic,
};