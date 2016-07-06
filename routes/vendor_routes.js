var express = require('express');
var jwt = require('express-jwt');
var router = express.Router();
var auth = jwt({secret: 'SECRET', userProperty:'payload'})

var mongoose = require('mongoose');
var passport = require('passport');
var Vendor = mongoose.model('Vendor');

/******* Picture Upload Middleware ************/
var multer = require('multer');

router.post('/photos/upload', 
  auth, 
  multer({                                          // multer middleware
    storage: multer.diskStorage({
      destination: function(req, file, cb){
        cb(null, './public/images/vendor/upload')
      },
      filename: function (req, file, cb){
        cb(null, 'profile' + '-' + Date.now()+'.jpg' )
      }
    })  
  }).single('file'),
  function(req,res){
    console.log(req.payload._id);
    console.log(req.file.filename)
    
    Vendor.findOneAndUpdate(
      {_id: req.payload._id}, 
      {$set: {
        avatar: req.file.filename
      }},
      function(err, vendor){
      if(err){
        console.log('error updating');
      } else {
        console.log(req.file.filename)
        console.log(vendor);
        res.send(vendor);
      }
    })
});

router.post('/photos/upload', 
  auth, 
  multer({                                          // multer middleware
    storage: multer.diskStorage({
      destination: function(req, file, cb){
        cb(null, './public/images/vendor/gallery')
      },
      filename: function (req, file, cb){
        cb(null, 'image' + '-' + Date.now()+'.jpg' )
      }
    })  
  }).single('file'),
  function(req,res){
    console.log(req.payload._id);
    console.log(req.file.filename)
    
    Vendor.findOneAndUpdate(
      {_id: req.payload._id}, 
      {$set: {
        avatar: req.file.filename         //issue: need to push into gallery.image.
      }},
      function(err, vendor){
      if(err){
        console.log('error updating');
      } else {
        console.log(req.file.filename)
        console.log(vendor);
        res.send(vendor);
      }
    })
});
/*** End upload middleware *******/

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

  query.exec(function (err, vendor){
    if (err) { return next(err); }
    if (!vendor) { return next(new Error('can\'t find vendor')); }

    req.vendor = vendor;
    return next();
  });
});

router.get('/api/vendor/:vendor', function(req, res, next){   
  res.json(req.vendor);
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

router.put('/api/vendor/:vendor/gallery/', function(req, res){
  vendor = req.vendor;
  console.log("calling" + vendor);

 vendor.gallery.push({name: req.body.galleryName});
  
  vendor.save(function(err, vendor){
    if(err){return next(err);}

    res.json(vendor);
    console.log(vendor);
  })
})

module.exports = router;
