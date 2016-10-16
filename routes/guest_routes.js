var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var passport = require('passport');

var Guest = mongoose.model('Guest');
var User = mongoose.model('User');

var jwt = require('express-jwt'); //json web token
var auth = jwt({secret: 'SECRET', requestProperty:'payload'}); //authentication middleware

/********************************/
/********** ROUTES **************/
/********************************/

  /*Root Route - render a view file*/ 
  router.get('/',
    function(req,res,next){
      res.render('guests', {title: 'Guests' })
  })

  /* API calls - anguler controller call this routes*/
    router.all('/api/*',  //catch all route to ensure user is authenticated
      auth,
      function(req, res, next){ 

        query = User.findById(req.payload._id);
        query.exec(function (err, user){
          if (err) { return next(err); }
          if (!user) { 
            //return next(new Error('can\'t find user')); 
            //res.redirect(home);
            console.log("not found");
          }
          req.user = user;

          return next();
        });
    });

    /*** Participants Routes ***/

    router.get('/api/participants', auth, getAllGuests)               //get all participants
    router.post('/api/participant', auth, createOneGuest)
    router.param('participant', guestParams)
    router.get('/api/participant/:participant', getOneGuest )
    router.all('/api/participant/:participant', guestParams)
    router.put('/api/participant/:participant', updateOneGuest)
    router.delete('/api/participant/:participant', deleteOneGuest)


    function guestParams(req, res, next, id) {
      req.participant = req.user.participants.id(id);
      console.log("Guest Param test" + req.participant)
      return next();
    };

    function deleteOneGuest(req,res){
      User.findOneAndUpdate(
        {"_id": req.user._id},
        {$pull: {"participants": {_id: req.participant._id} } },
        checkForUpdateError
      )
    }

    function updateOneGuest(req,res){

      User.findOneAndUpdate(
        {"_id": req.user._id, "participants._id": req.participant._id},
        {"$set":{"participants.$": req.body} },
        checkForUpdateError
      )

      res.end();
    }

    function getOneGuest(req, res){
      res.json(req.participant)
    }


    function getAllGuests(req, res){
      res.json(req.user.participants);
    };

    function createOneGuest(req,res){
      User.findOneAndUpdate(
        {_id: req.user._id},
        {"$push":{participants: req.body} },
        checkForUpdateError
      )

      res.end();
    }

    function checkForUpdateError(err,user){
      if(err){
        console.log('error updating');
      } else {
        console.log("No error updating");
      }
    }



    /*** Guest Routes ***/
    router.get('/api/guests',       //get all guests
      auth,
      function(req, res, next){;
        Guest.find({"user": req.user}).exec(function(err,guests){
          if(err){return next(err); }
          res.json(guests);
        })
      }
    );


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


  /********************** TABLES SETTINGS *******************/
  router.get('/api/tables',         // Display all the tables of the guests
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

  router.param('table', function(req, res, next, id) {
    var query = User.table.findById(id);

    query.exec(function (err, table){
      if (err) { return next(err); }
      if (!table) { return next(new Error('can\'t find table')); }

      req.table = table;
      return next();
    });
  });



  router.get('/api/tables/57c483b0068c8c2437ef69d2', function(req,res,next){
    console.log("Authorized User again is " + req.user);

    queryTable = req.user.table.id('57c483b0068c8c2437ef69d2');

      /*query.exec(function (err, table){
        if (err) { return next(err); }
        if (!table) { return next(new Error('can\'t find user')); }

        req.table = table;
        return next();
      });*/
    console.log("Authorized Table is " + queryTable)
    next();
  });

  router.get('/api/tables/57c483b0068c8c2437ef69d2', function(req,res,next){
    console.log("Authorized Table again is " + queryTable)

  });

module.exports = router;
