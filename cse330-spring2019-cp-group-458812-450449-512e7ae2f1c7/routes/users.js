const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');

// Bring in User Model
let User = require('../models/user');

// Register Form
router.get('/register', function(req, res){
  res.render('register');
});

// Register Proccess
router.post('/register', function(req, res){
  
  const username = req.body.username;
  const password = req.body.password;
  
 

  req.checkBody('username', 'Username is required').notEmpty();
  req.checkBody('password', 'Password is required').notEmpty();


  let errors = req.validationErrors();
  let cond=false;
  
  User.find({},function(err,user){
    for (i in user){

        if (user[i].username==username){
            console.log('i am here')
            cond=true;
        }
    }
    if(errors){
        res.render('register', {
          errors:errors
        });
      
      } else if(cond){
        res.render('register', {
            errors:errors
          });
      }else {
          console.log("errhihihi",cond);
        let newUser = new User({
          username:username,
          password:password
        });
    
        bcrypt.genSalt(10, function(err, salt){
          bcrypt.hash(newUser.password, salt, function(err, hash){
            if(err){
              console.log(err);
            }
            newUser.password = hash;
            newUser.save(function(err){
              if(err){
                console.log(err);
                return;
              } else {
                req.flash('success','You are now registered and can log in');
                res.redirect('/users/login');
              }
            });
          });
        });
      }
})

  
});


// Login Form
router.get('/login', function(req, res){
  res.render('login');
});

// Login Process
router.post('/login', function(req, res, next){
  passport.authenticate('local', {
    successRedirect:'/',
    failureRedirect:'/users/login',
    failureFlash: true
  })(req, res, next);
});

// logout
router.get('/logout', function(req, res){
  req.logout();
  req.flash('success', 'You are logged out');
  res.redirect('/users/login');
});


//load reset form
router.get('/reset/:id',function(req,res){
   
    User.findById(req.params.id,function(err,user){
        if (user.id!=req.user._id){
            req.flash('danger','not Authorized');
            res.redirect('/');
        }
        res.render('reset_password',{
            user:user
        });
    });
});

//reset password
router.post('/reset/:id',function(req,res){
    
    req.checkBody('username', 'Username is required').notEmpty();
    req.checkBody('password', 'Password is required').notEmpty();


    let query={_id:req.params.id};
  
    let errors = req.validationErrors();
  
    if(errors){
      res.render('register', {
        errors:errors
      });
    } else {
        let user = {};
        user.username = req.body.username;
        user.password = req.body.password;
  
      bcrypt.genSalt(10, function(err, salt){
        bcrypt.hash(user.password, salt, function(err, hash){
          if(err){
            console.log(err);
          }
          user.password = hash;
          User.update(query,user,function(err){
            if(err){
              console.log(err);
              return;
            } else {
                console.log(user.password);
              req.flash('success','You have changed password');
              res.redirect('/');
            }
          });
        });
      });
    }
});

module.exports = router;