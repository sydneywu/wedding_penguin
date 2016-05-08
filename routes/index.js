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
    if (!guest) { return next(new Error('can\'t find post')); }

    req.guest = guest;
    return next();
  });
});

router.get('/guests/:guest', function(req, res) {
  res.json(req.guest);
});

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