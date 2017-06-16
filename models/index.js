var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/qa");

var User = require('./user');

module.exports = {
	User: User,
};