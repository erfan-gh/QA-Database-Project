var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/qa");

var User = require('./user');
var Topic = require('./topic');
var Post = require('./post');
var Comment = require('./comment');
var Rate = require('./rate');

module.exports = {
	User: User,
	Topic: Topic,
	Post: Post,
	Comment: Comment,
	Rate: Rate,
};