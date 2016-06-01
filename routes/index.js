var express = require('express');
var jwt = require('express-jwt');
var router = express.Router();
var auth = jwt({secret: 'SECRET', userProperty:'payload'})

var mongoose = require('mongoose');
var passport = require('passport');


var Guest = mongoose.model('Guest');
var Checklist = mongoose.model('Checklist');
var User = mongoose.model('User');

/* GET home page. */

var profileRead = function(req,res){
  //If no user ID exists in the JWT return a 401
  res.render('profile')               //tbf
  //console.log(req.payload)
  if(!req.payload._id){
    res.status(401).json({
      "message": "UnauthorizedError: private profile"
    });
  } else{
    //otherwise continue
    User
      .findById(req.payload._id)
      .exec(function(err,user){
        res.status(200).json(user);

      })
  }
}

router.use(function (err, req, res, next) {
  if (err.name === 'UnauthorizedError') {
    res.status(401);
    res.json({"message" : err.name + ": " + err.message});
  }
});

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/profile/api/guests', auth, function(req, res, next){
  Guest.find({"user": req.payload._id}).exec(function(err,guests){
    if(err){return next(err); }
    res.json(guests);           //tbf
  })
});

router.get('/profile', auth, profileRead)     //tbf

/*router.get('/guests', function(req,res,next){
  res.render('guests', {title: 'Guests' })
})*/

router.get('/test', function(req, res, next){
  res.render('test', {title: 'test'});
})

router.post('/api/register', function(req, res, next){
  if(!req.body.username || !req.body.password){
    return res.status(400).json({message: 'Please fill out all fields'});
  }

  var user = new User();

  user.username = req.body.username;

  user.setPassword(req.body.password)

  user.save(function (err){
    if(err){ return next(err); }

    return res.json({token: user.generateJWT()})
  });
});

router.post('/api/login', function(req, res, next){
  if(!req.body.username || !req.body.password){
    return res.status(400).json({message: 'Please fill out all fields'});
  }

  passport.authenticate('local_user', function(err, user, info){
    if(err){ return next(err); }

    if(user){
      return res.json({token: user.generateJWT()});
    } else {
      return res.status(401).json(info);
    }
  })(req, res, next);
});

/* Test User specific Guest List. */
router.get('/api/users', function(req, res, next){
  User.find(function(err,users){
    if(err){return next(err); }

    res.json(users);
  })
})

router.param('user', function(req, res, next, id) {
  var query = User.findById(id);

  query.exec(function (err, user){
    if (err) { return next(err); }
    if (!user) { return next(new Error('can\'t find user')); }

    req.user = user;
    return next();
  });
});

router.get('/api/users/:user', function(req, res){
      //res.json(req.user);

      req.user.populate('guests', function(err, guest){
        if (err){return next(err);}

        console.log(guest);
        res.json(guest);
      })
})


/*router.get('user/:user', function(req, res, next){
  req.user.populate('guests', function(err, guest){
    if (err){return next(err);}

    res.json(guest);
  })
})*/


router.get('/api/users/:user/guests', function(req, res){
  console.log(req.user);
  
  req.user.populate('guests', function(err, guest){
    if (err){return next(err);}

    res.json(guest);
  })
})


module.exports = router;



