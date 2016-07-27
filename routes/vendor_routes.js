var express = require('express');
var jwt = require('express-jwt');
var router = express.Router();
var auth = jwt({secret: 'SECRET', userProperty:'payload'})

var mongoose = require('mongoose');
var passport = require('passport');
var Vendor = mongoose.model('Vendor');

var multer = require('multer'); //middleware for image upload
var sharp = require('sharp'); //middleware for image resize
var fs = require('fs');

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

/******* Picture Upload Middleware ************/
function saveImageName(req, res, updatedObj){  //callback function for findOneAndUpdate
  Vendor.findOneAndUpdate(
    {_id: req.payload._id}, 
    updatedObj,     // e.g. {"$set": {"avatar": value}}
    function(err, vendor){
      if(err){
        console.log('error updating');
      } else {
        console.log(vendor);
        res.send(vendor);
      }
    }
  )
}

/******************** Upload Images********************/
  router.post('/photos/avatar', 
    auth, 
    multer({   // multer middleware
      storage: multer.diskStorage({
        destination: function(req, file, cb){
          cb(null, './public/images/vendor/avatar')
        },
        filename: function (req, file, cb){
          cb(null, 'profile' + '-' + Date.now() )
        }
      })  
    }).single('file'),
    function(req,res){
      var path = "./public/images/vendor/avatar";
      console.log("file path is " + req.file.path);
      
      fs.access(req.file.path, fs.F_OK, function(err){    //function to call to check if file exists and log to console. Doesn't do anything 
        if(!err){
          console.log('file exists');
        } else{
          console.log('file does not exist')
        }
      })

      sharp(req.file.path)
        .resize(100,100)
        .toFile(req.file.path + '_r', function(err){
            if(err){ throw err; }
        })

      var updatedObj={$set: {avatar: req.file.filename}}; //set the update object
      saveImageName(req, res, updatedObj); //cb method to findOneAndUpdate
    }
  );

  /**** Upload showcase Picture****/
  router.post('/photos/showcase', 
    auth, 
    multer({  // multer middleware
      storage: multer.diskStorage({
        destination: function(req, file, cb){
          cb(null, './public/images/vendor/showcase')
        },
        filename: function (req, file, cb){
          cb(null, 'image' + '-' + Date.now() )
        }
      })  
    }).single('file'),
    function(req,res){
      console.log(req.file.filename);
      console.log(req.payload._id)
      var updatedObj={$push:{image:{path: req.file.filename}}}; //set the update object. nested obj 3 levels deep
      saveImageName(req, res, updatedObj); //cb method to findOneAndUpdate
  });

/*** End upload middleware *******/

  router.get('/testing', function(req,res){
      var path = 'public/images/vendor/avatar/input5.jpg';

      console.log('test');
      sharp('public/images/vendor/avatar/input3.jpg')
        .resize(100,100)
        .toFile('public/images/vendor/avatar/output3.jpg', function(err){

        })
      res.send('hello');

    }
  )



module.exports = router;
