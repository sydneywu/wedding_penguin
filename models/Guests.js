var mongoose = require('mongoose');

var GuestSchema = new mongoose.Schema({
	name: String,
	relation: String,
	table: Number
});

mongoose.model('Guest', GuestSchema);