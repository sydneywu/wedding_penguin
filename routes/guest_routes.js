var express = require('express');
var jwt = require('express-jwt');
var router = express.Router();
var auth = jwt({secret: 'SECRET', userProperty:'payload'})

var mongoose = require('mongoose');
var passport = require('passport');

var Guest = mongoose.model('Guest');
var User = mongoose.model('User');



router.get('/',function(req,res,next){
  res.render('guests', {title: 'Guests' })
})

/* Guests page. */

router.get('/api/guests', auth, function(req, res, next){
  console.log(req.payload._id)
  Guest.find({"user": req.payload._id}).exec(function(err,guests){
    if(err){return next(err); }
    res.json(guests);
  })
});

router.post('/api/guests', auth, function(req, res, next) {
  var guest = new Guest(req.body);
  console.log(req.body.user);
  var query = User.findById(req.body.user);
  
  var findUser = function(){
    query.exec(function (err, user){
      if (err) { return next(err); }
      if (!user) { return next(new Error('can\'t find user')); }
      req.user = user;
      console.log(req.user);
      return req.user;
    });
  };

  console.log(findUser());

  req.user=findUser();

  guest.save(function(err, guest){
    if(err){ return next(err); }
    
    req.user.guests.push(guest);
    req.user.save(function(err, user){
      if(err){return next(err);}

      res.json(guest);
      console.log(guest);
    })
  });



});

/* Middleware for finding guest */
router.param('guest', function(req, res, next, id) {
  var query = Guest.findById(id);

  query.exec(function (err, guest){
    if (err) { return next(err); }
    if (!guest) { return next(new Error('can\'t find guest')); }

    req.guest = guest;
    return next();
  });
});

router.get('/api/guest/:guest', function(req, res, next){   //testing put
  res.json(req.guest)
});

router.put('/api/guest/:guest/change', function(req, res, next){   //testing put
  req.guest.change(function(err, guest){
    if (err){return next(err);}

    res.json(guest);
  });
});


router.put('/api/guest/:id', function(req, res){
  Guest.findOneAndUpdate(
    {_id: req.params.id}, 
    {$set: {
      name: req.body.name,
      relation: req.body.relation,
      table: req.body.table,
      user: req.body.user
    }},
    function(err, newGuest){
        if(err){
          console.log('error updating');
        } else {
          console.log(newGuest);
          res.send(newGuest);
        }
    }
  )
})


router.delete('/api/guest/:id', function(req, res){
  Guest.findOneAndRemove(
    { _id: req.params.id}, 
    function(err, newGuest){
      if(err){
        res.send('error');
      } else {
        console.log(newGuest);
        res.send("Successfully Deleted");
      }
    })
})



module.exports = router;

