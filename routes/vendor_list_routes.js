var express = require('express');
var jwt = require('express-jwt');
var router = express.Router();
var auth = jwt({secret: 'SECRET', userProperty:'payload'})

var mongoose = require('mongoose');
var passport = require('passport');


var Vendor = mongoose.model('Vendor');

router.get('/', function(req,res,next){
	res.render('vendorList', {title:'Vendor Listing'})
})

router.get('/api/vendors', function(req,res,next){
	Vendor.find(function(err,vendors){
    if(err){return next(err); }
    res.json(vendors);
  })
})

module.exports = router;
