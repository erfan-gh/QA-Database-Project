var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var RateSchema = Schema(
	{
		user_id: {type: Schema.Types.ObjectId, required: true, max: 100, ref: 'User'},
		post_id: {type: Schema.Types.ObjectId, required: true, max: 100, ref: 'Post'},
		rate: {type: Number, required: true, max: 100},
	}
);

module.exports = mongoose.model('Rate', RateSchema);