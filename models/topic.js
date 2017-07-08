var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TopicSchema = Schema(
	{
		title: {type: String, required: true, unique: true, max: 100},
		creator_id: {type: Schema.Types.ObjectId, required: true, max: 100},
		created_at: {type: Date, required: true, default:Date.now},
		question_id: {type: Schema.Types.ObjectId, required: true},
		answers: {type: Array},
		skills: {type: Array},
	}
);

module.exports = mongoose.model('Topic', TopicSchema);