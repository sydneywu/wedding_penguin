var mongoose = require('mongoose');

var GuestSchema = new mongoose.Schema({
	name: String,
	relation: String,
	table: {type: Number, default: 0}
});

GuestSchema.methods.change = function(cb){
	this.relation = "changed";
	this.save(cb)
}

mongoose.model('Guest', GuestSchema);