var mongoose = require('mongoose');
var crypto = require('crypto');			//for hashing password
var jwt = require('jsonwebtoken');		//npm install jsonwebtoken --save

/*************** Sub Schema ****************/
  var tableSchema = new mongoose.Schema({     
    number: Number,
    name: {type: String, default: ""},
  })  

  var guestSchema = new mongoose.Schema({
    name: {type: String, required: true},
    relation: {type: String, default: "unassigned"},
    table: {type: Number, default: 0},
  })


/*************** Main Schema *****************/
var UserSchema = new mongoose.Schema({
  username: {type: String, lowercase: true, unique: true},
  hash: String,
  salt: String,
  guests: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Guest' }],
  participants: [guestSchema],
  checklists: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Checklist' }],
  budget: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Budget' }],
  table: [tableSchema]
});

 
UserSchema.methods.setPassword = function(password){
  this.salt = crypto.randomBytes(16).toString('hex');
  this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');
};

UserSchema.methods.validPassword = function(password) {
  var hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');
  return this.hash === hash;
};

UserSchema.methods.generateJWT = function() {

  // set expiration to 60 days
  var today = new Date();
  var exp = new Date(today);
  exp.setDate(today.getDate() + 60);

  return jwt.sign({
    _id: this._id,
    username: this.username,
    exp: parseInt(exp.getTime() / 1000),
  }, 'SECRET');
};

mongoose.model('User', UserSchema);