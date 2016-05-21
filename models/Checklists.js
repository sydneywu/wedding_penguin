var mongoose = require ('mongoose');

var checklistSchema = new mongoose.Schema({
	name: String,
	category: String,
	dueDate: Date,
	dateCreated: Date,
	user: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}]
})

mongoose.model('Checklist', checklistSchema);