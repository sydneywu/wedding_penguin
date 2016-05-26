var mongoose = require('mongoose');

var BudgetSchema = new mongoose.Schema({
	name: String,
	relation: String,
	table: {type: Number, default: 0},
	user: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}]
});

BudgetSchema.methods.change = function(cb){
	this.relation = "changed";
	this.save(cb)
}

mongoose.model('Budget', BudgetSchema);