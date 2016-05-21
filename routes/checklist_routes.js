var express = require('express');
var jwt = require('express-jwt');
var router = express.Router();
var auth = jwt({secret: 'SECRET', userProperty:'payload'})

var mongoose = require('mongoose');
var passport = require('passport');

var Checklist = mongoose.model('Checklist');
var User = mongoose.model('User');

router.get('/', function (req, res, next){
	res.render('checklists', {title: '{Checklists}'})
})

/*======= Checklists API =========*/
router.get('/api/checklists', function(req,res,next){
	Checklist.find(function(err,checklists){
		if(err){return next(err);}
		res.json(checklists);
	})
})

router.post('/api/checklists', function(req, res, next){
	var checklist = new Checklist(req.body);
	var query = User.findById(req.body.user);
	var findUser = function(){
	    query.exec(function (err, user){
	      if (err) { return next(err); }
	      if (!user) { return next(new Error('can\'t find guest')); }
	      req.user = user;
	      console.log(req.user);
	      return req.user;
	    });
	  };
	req.user=findUser();
	checklist.save(function(err, checklist){
    if(err){ return next(err); }
    
    req.user.checklists.push(checklist);
    req.user.save(function(err, user){
      if(err){return next(err);}

      res.json(checklist);
      console.log(checklist);
    })
  });
})

module.exports = router;