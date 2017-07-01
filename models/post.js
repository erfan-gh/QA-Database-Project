var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PostSchema = Schema(
	{
		body: {type: String, required: true, unique: true, max: 1000},
		creator_id: {type: Number, required: true, max: 100},
		created_at: {type: Date, required: true, max: 100},
	}
);

module.exports = mongoose.model('Post', PostSchema);