var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CommentSchema = Schema(
	{
		body: {type: String, required: true, unique: true, max: 1000},
		creator_id: {type: Schema.Types.ObjectId, required: true, max: 100, ref: 'User'},
	}
);

module.exports = mongoose.model('Comment', CommentSchema);