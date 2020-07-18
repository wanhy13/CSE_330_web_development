const express = require('express');
const router = express.Router();

//bring in post model
let Post = require('../models/post');
//user model
let User = require('../models/user');
//comment model
let Comment = require('../models/comment');

//add comment
router.get('/add/:id',ensureAuthenticated,function(req,res){
    res.render('add_comment',{
        title:req.params.id
    });
});
//add submit post route
router.post('/add/:id',function(req,res){
   // console.log("add id work")
   let postid= req.params.id
   
   req.checkBody('content','Content is required').notEmpty();
    

    
    let errors= req.validationErrors();
    if(errors){
        res.render('add_post',{
            errors:errors
        });
    }else{
        let comment = new Comment();
        comment.author = req.user._id;
        comment.authorname=req.user.username;
        comment.content = req.body.content;
        comment.postid=postid;
    
        comment.save(function(err){
            if(err){
                console.log(err)
            }else{
                req.flash('success','Post Added');
                res.redirect('/posts/'+comment.postid);
            }
        });
    }

   
});

router.delete('/:id',function(req,res){
    if(!req.user._id){
        res.status(500).send();
    }
    let query = {_id:req.params.id}

    Comment.findById(req.params.id,function(err,comment){
        
            Comment.remove(query,function(err){
                if (err){
                    console.log(err);
                }
                
                res.send({id:comment.postid});
            });
        
    })

    
});


// Access Control
function ensureAuthenticated(req, res, next){
    if(req.isAuthenticated()){
      return next();
    } else {
      req.flash('danger', 'Please login');
      res.redirect('/users/login');
    }
  }

module.exports = router;