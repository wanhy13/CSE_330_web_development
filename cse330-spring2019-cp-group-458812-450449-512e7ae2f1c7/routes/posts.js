const express = require('express');
const router = express.Router();

//bring in post model
let Post = require('../models/post');
//user model
let User = require('../models/user');
//comment model
let Comment = require('../models/comment');



//add route
router.get('/add',ensureAuthenticated,function(req,res){
    res.render('add_post',{
        title:"Add Post"
    });
});
//add submit post route
router.post('/add',function(req,res){
    req.checkBody('content','Content is required').notEmpty();
    console.log("content:"+req.body.content);
    console.log("content:"+req.body.file);

    //get errors
    let errors= req.validationErrors();
    if(errors){
        res.render('add_post',{
            errors:errors
        });
    }else{
        let post = new Post();
        post.author = req.user._id;
        post.authorname=req.user.username;
        post.content = req.body.content;
        post.photo = req.body.file;
    
        post.save(function(err){
            if(err){
                console.log(err)
            }else{
                req.flash('success','Post Added');
                res.redirect('/');
            }
        });
    }

   
});
//get single article with comment
router.get('/:id',function(req,res){
    Post.findById(req.params.id,function(err,post){
        let postid = req.params.id;
        let query = {postid:postid}
        let com=[];
        Comment.find(query,function(err,comments){
            com=comments;
        });
        User.findById(post.author, function(err,user){
            res.render('post',{
                author:user.username,
                post:post,
                comments:com
            });
        });
       
    });
});
//load edit form
router.get('/edit/:id',ensureAuthenticated,function(req,res){
    Post.findById(req.params.id,function(err,post){
        if (post.author!=req.user._id){
            req.flash('danger','not Authorized');
            res.redirect('/');
        }
        res.render('edit_post',{
            post:post
        });
    });
});

//edit posts
router.post('/edit/:id',ensureAuthenticated,function(req,res){
    let post = {};
    post.author = req.user._id;
    post.authorname=req.user.username;
    post.content = req.body.content;
    post.photo = req.body.file;

    let query={_id:req.params.id}

    Post.update(query,post,function(err){
        if(err){
            console.log(err);
            return;
        }else{
            res.redirect('/');
        }
    })
});
router.delete('/:id',ensureAuthenticated,function(req,res){
    if(!req.user._id){
        res.status(500).send();
    }
    let query = {_id:req.params.id}

    Post.findById(req.params.id,function(err,post){
        if(post.author!=req.user._id){
            res.status(500).send();
        }else{
            Post.remove(query,function(err){
                if (err){
                    console.log(err);
                }
                res.send('Success');
            });
        }
    })

    
});


//like it and dislike it 
router.post('/likeit/:id',ensureAuthenticated,function(req,res){
    let query={_id:req.params.id};

    Post.findById(req.params.id,function(err,post){
        let likelist=post.likelist;
        for(let i=0;i < likelist.length;i++){
            if (likelist[i]==req.user._id){
                console.log('you have liked it');
                return ;
            }
        }
        likelist.push(req.user._id);
        post.likelist=likelist;
        Post.update(query,post,function(err){
            if(err){
                console.log(err);
                return;
            }

            res.send({"id":req.params.id});
           
        });
        
    });

    
});


router.post('/unlikeit/:id',ensureAuthenticated,function(req,res){
    let query={_id:req.params.id};
   

    

    Post.findById(req.params.id,function(err,post){
        let likelist=post.likelist;
        let newlikelist=[];
        let inList=false
        for(let i=0;i < likelist.length;i++){
            if (likelist[i]==req.user._id){
                inList=true;
            }
        }
        if(inList){
            for(let i=0;i < likelist.length;i++){
                
                if (likelist[i]!=req.user._id){
                    newlikelist.push(likelist[i]);
                }
        
            }
            post.likelist=newlikelist;
            Post.update(query,post,function(err){
                if(err){
                    console.log(err);
                    return;
                }
                res.send({"id":req.params.id});
               
            })
        }
        
        
    });
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