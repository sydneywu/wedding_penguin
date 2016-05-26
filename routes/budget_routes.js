var express = require('express');
var jwt = require('express-jwt');
var router = express.Router();
var auth = jwt({secret: 'SECRET', userProperty:'payload'})

var mongoose = require('mongoose');
var passport = require('passport');

var Budget = mongoose.model('Budget');
var User = mongoose.model('User');

router.get('/', function (req, res, next){
	res.render('budget', {title: '{Budget}'})
})

router.get('/api/budget', function(req, res, next){
  Budget.find(function(err,budget){
    if(err){return next(err); }
    res.json(budget);
    console.log(budget);
  })
});

router.post('/api/budget', function(req, res, next) {
  var budget = new Budget(req.body);
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

  budget.save(function(err, budget){
    if(err){ return next(err); }
    
    req.user.budget.push(budget);
    req.user.save(function(err, user){
      if(err){return next(err);}

      res.json(budget);
      console.log(budget);
    })
  });



});

router.param('budget', function(req, res, next, id) {
  var query = Budget.findById(id);

  query.exec(function (err, budget){
    if (err) { return next(err); }
    if (!budget) { return next(new Error('can\'t find budget')); }

    req.budget = budget;
    return next();
  });
});

router.get('/api/budget/:budget', function(req, res, next){   //testing put
  res.json(req.budget)
});

router.put('/api/budget/:budget/change', function(req, res, next){   //testing put
  req.budget.change(function(err, budget){
    if (err){return next(err);}

    res.json(budget);
  });
});


router.put('/api/budget/:id', function(req, res){
  Budget.findOneAndUpdate(
    {_id: req.params.id}, 
    {$set: {
      name: req.body.name,
      relation: req.body.relation,
      table: req.body.table,
      user: req.body.user
    }},
    function(err, newBudget){
        if(err){
          console.log('error updating');
        } else {
          console.log(newBudget);
          res.send(newBudget);
        }
    }
  )
})


router.delete('/api/budget/:id', function(req, res){
  Budget.findOneAndRemove(
    { _id: req.params.id}, 
    function(err, newBudget){
      if(err){
        res.send('error');
      } else {
        console.log(newBudget);
        res.send("Successfully Deleted");
      }
    })
})

module.exports = router;