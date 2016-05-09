var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var Guest = mongoose.model('Guest');
var Checklist = mongoose.model('Checklist');


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;

/* Guests page. */
router.get('/guests', function(req, res, next){
  Guest.find(function(err,guests){
		if(err){return next(err); }
		res.json(guests);
	})
});

router.post('/guests', function(req, res, next) {
  var guest = new Guest(req.body);
  guest.save(function(err, guest){
    if(err){ return next(err); }
    res.json(guest);
  });

});

router.param('guest', function(req, res, next, id) {
  var query = Guest.findById(id);

  query.exec(function (err, guest){
    if (err) { return next(err); }
    if (!guest) { return next(new Error('can\'t find guest')); }

    req.guest = guest;
    return next();
  });
});

router.put('/guests/:guest/change', function(req, res, next){   //testing put
  req.guest.change(function(err, guest){
    if (err){return next(err);}

    res.json(guest);
  });
});


router.get('/guests/:id', function(req, res){
  console.log('getting one guest');
  Guest.findOne({
    _id: req.params.id
  })
  .exec(function(err, guest){
    if(err){
      res.send('error occurred');
    }else{
      console.log(guest);
      res.json(guest);
    }
  })
})


router.put('/guests/:id', function(req, res){
  Guest.findOneAndUpdate(
    {_id: req.params.id}, 
    {$set: {
      name: req.body.name,
      relation: req.body.relation,
      table: req.body.table
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


router.delete('/guests/:id', function(req, res){
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

/* Checklist page. */
router.get('/checklists', function(req, res, next){
  Checklist.find(function(err,checklists){
    if(err){return next(err); }

    res.json(checklists);
  })
});

router.post('/checklists', function(req, res, next) {
  var checklist = new Checklist(req.body);

  checklist.save(function(err, checklist){
    if(err){ return next(err); }

    res.json(checklist);
  });
});