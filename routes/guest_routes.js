var express = require('express');
var jwt = require('express-jwt');
var router = express.Router();

var mongoose = require('mongoose');
var passport = require('passport');

var Guest = mongoose.model('Guest');
var User = mongoose.model('User');

/***************** Authentication Middleware ***************/
var auth = jwt({secret: 'SECRET', requestProperty:'payload'})


router.get('/',
  //auth, 
  function(req,res,next){
  console.log('I am here');
  res.render('guests', {title: 'Guests' })
})

/*router.use(function(err, req, res, next) {
  if(401 == err.status) {
      //console.log('/home')
      //res.redirect('/home')
  }
});*/

/* Guests page. */
/*router.get('/api/guests',     //use for checking the authentication of user. Incomplete.
  auth, 
  function(req,res,next){
    var user= req.payload;
    console.dir("user id is" + JSON.stringify(user));
    //if(!req.payload.username) return res.redirect('home'); 
    next();
})*/


router.get('/api/guests', 
  auth,
  function(req, res, next){;
    console.log(req.payload._id);
    Guest.find({"user": req.payload._id}).exec(function(err,guests){
      if(err){return next(err); }
      res.json(guests);
    })
  }
);

router.get('/api/tables', 
  auth,
  function(req, res, next){
    
    var query = User.findById(req.payload._id);

    query.exec(function (err, user){
      if (err) { return next(err); }
      if (!user) { return next(new Error('can\'t find user')); }
     
      queriedUser = user;
      res.json(user.table);
    });
})

router.post('/api/tables', 
  auth,
  function(req, res, next){

    console.log(req.payload._id);     //test to see if user id is passed here
    var query = User.findById(req.payload._id);   //query will return a query object which needs to be exec

    query.exec(function (err, user){
      if (err) { return next(err); }
      if (!user) { return next(new Error('can\'t find user')); }
      queriedUser = user;             //assigned user object to new variable
    });

    console.log("user is " + queriedUser);  //test new variable

    User.findOneAndUpdate(              
      {_id: req.payload._id}, 
      {"$set":{"table":req.body}},     // e.g. {"$set": {"avatar": value}}
      {upsert:true},        // replace or create new if don't exist
      function(err, user){
        if(err){
          console.log('error updating');
        } else {
          console.log(user);
        }
      }
    )
})


router.post('/api/guests', 
  auth, 
  function(req,res,next){
      var query = User.findById(req.body.user);

      query.exec(function (err, user){
        if (err) { return next(err); }
        if (!user) { return next(new Error('can\'t find user')); }
        req.user = user;
        return next();
      });
  }
)

router.post('/api/guests', auth, function(req, res, next) {
  var guest = new Guest(req.body);

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

router.get('/api/guest/:guest', function(req, res, next){ 
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

