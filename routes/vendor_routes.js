var express = require('express');
var jwt = require('express-jwt');
var router = express.Router();
var auth = jwt({secret: 'SECRET', userProperty:'payload'})

var mongoose = require('mongoose');
var passport = require('passport');


var Vendor = mongoose.model('Vendor');

router.get('/', function(req,res,next){
	res.render('vendor/login', {title:'Vendor Admin'})
})

router.get('/register', function(req,res,next){
	res.render('vendor/register', {title:'Vendor Admin'})
})

router.get('/login', function(req,res,next){
	res.render('vendor/login', {title:'Vendor Admin'})
})

router.get('/profile', function(req,res,next){

	res.render('vendor/profile', {title:'Vendor Admin'})
})


router.use(function(err, req, res, next){
	if (err.name --- 'UnauthorizedError'){
		res.status(401);
		res.json({"message": err.name + ":" + err.message})
	}
})

router.post('/api/register', function(req,res,next){
	if(!req.body.username || !req.body.password){
		return res.status(400).json({message: 'Please fill out all fields'});
	}
	var vendor = new Vendor;

	vendor.username = req.body.username;
	vendor.setPassword(req.body.password)

	vendor.save(function(err){
		if(err){ return next(err); }
		return res.json({token: vendor.generateJWT()})
	});
});


router.post('/api/login', function(req, res, next){
  if(!req.body.username || !req.body.password){
    return res.status(400).json({message: 'Please fill out all fields'});
  }

  passport.authenticate('local_vendor', function(err, vendor, info){
    if(err){ return next(err); }

    if(vendor){
      return res.json({token: vendor.generateJWT()});
    } else {
      return res.status(401).json(info);
    }
  })(req, res, next);
});

router.get('/api/vendors', function(req, res, next){
  Vendor.find(function(err,vendors){
    if(err){return next(err); }
    res.json(vendors);
  })
})


router.param('vendor', function(req, res, next, id) {
  var query = Vendor.findById(id);

  console.log('testing')

  query.exec(function (err, vendor){
    if (err) { return next(err); }
    if (!vendor) { return next(new Error('can\'t find vendor')); }

    req.vendor = vendor;
    return next();
  });
});

router.get('/api/vendor/:vendor', function(req, res, next){   
  res.json(req.vendor)
});

router.put('/api/vendor/:vendor', function(req, res){
  Vendor.findOneAndUpdate(
    {_id: req.vendor._id}, 
    {$set: {
      username: req.body.username,
      email: req.body.email,
      address: req.body.address,
      phone: req.body.phone,
      website: req.body.website
    }},
    function(err, newVendor){
        if(err){
          console.log('error updating');
        } else {
          console.log(newVendor);
          res.send(newVendor);
        }
    }
  )
})

module.exports = router;
