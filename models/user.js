var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = Schema(
	{
		email: {type: String, required: true, unique: true, max: 100},
		password: {type: String, required: true, max: 100},
		first_name: {type: String, required: true, max: 100},
		last_name: {type: String, required: true, max: 100},
		rate: {type: Number, default: 0},
		profile_name: {type: String, required: false},
		skills: {type: Array},
	}
);

UserSchema
.virtual('name')
.get(function() {
	return this.last_name + ', ' + this.first_name;
});

UserSchema.methods.validPassword = function(password) {
	if (this.password == password) {
		console.log('Hay its valid');
		return true;
	}
	console.log('Oh its not valid');
	return false;
}

module.exports = mongoose.model('User', UserSchema);