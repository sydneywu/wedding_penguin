var mongoose = require ('mongoose');

var checklistSchema = new mongoose.Schema({
	name: String,
	category: String,
	dueDate: Date,
	dateCreated: Date,
})

mongoose.model('Checklist', checklistSchema);