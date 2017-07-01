var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PostSchema = Schema(
	{
		body: {type: String, required: true, unique: true, max: 1000},
		creator_id: {type: Schema.Types.ObjectId, required: true, max: 100},
		created_at: {type: Date, required: true, default: Date.now},
	}
);

module.exports = mongoose.model('Post', PostSchema);