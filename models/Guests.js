var mongoose = require('mongoose');

var GuestSchema = new mongoose.Schema({
	name: String,
	relation: String,
	table: {type: Number, default: 0},
	user: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}]
});

GuestSchema.methods.change = function(cb){
	this.relation = "changed";
	this.save(cb)
}

mongoose.model('Guest', GuestSchema);