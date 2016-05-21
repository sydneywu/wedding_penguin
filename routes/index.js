var express = require('express');
var jwt = require('express-jwt');
var routerA = express.Router();
var auth = jwt({secret: 'SECRET', userProperty:'payload'})

var mongoose = require('mongoose');
var passport = require('passport');


var Guest = mongoose.model('Guest');
var Checklist = mongoose.model('Checklist');
var User = mongoose.model('User');

/* GET home page. */
routerA.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

routerA.get('/guests', function(req,res,next){
  res.render('guests', {title: 'Guests' })
})

routerA.get('/test', function(req, res, next){
  res.render('test', {title: 'test'});
})

routerA.post('/api/register', function(req, res, next){
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

routerA.post('/api/login', function(req, res, next){
  if(!req.body.username || !req.body.password){
    return res.status(400).json({message: 'Please fill out all fields'});
  }

  passport.authenticate('local', function(err, user, info){
    if(err){ return next(err); }

    if(user){
      return res.json({token: user.generateJWT()});
    } else {
      return res.status(401).json(info);
    }
  })(req, res, next);
});

/* Test User specific Guest List. */
routerA.get('/api/users', function(req, res, next){
  User.find(function(err,users){
    if(err){return next(err); }

    res.json(users);
  })
})

routerA.param('user', function(req, res, next, id) {
  var query = User.findById(id);

  query.exec(function (err, user){
    if (err) { return next(err); }
    if (!user) { return next(new Error('can\'t find user')); }

    req.user = user;
    return next();
  });
});

routerA.get('/api/users/:user', function(req, res){
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


routerA.get('/api/users/:user/guests', function(req, res){
  console.log(req.user);
  
  req.user.populate('guests', function(err, guest){
    if (err){return next(err);}

    res.json(guest);
  })
})


module.exports = routerA;



