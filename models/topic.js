var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TopicSchema = Schema(
	{
		title: {type: String, required: true, unique: true, max: 100},
		creator_id: {type: Number, required: true, max: 100},
		created_at: {type: Date, required: true, max: 100},
		question_id: {type: Number, required: true},
		answers: {type: Array},
	}
);

module.exports = mongoose.model('Topic', TopicSchema);