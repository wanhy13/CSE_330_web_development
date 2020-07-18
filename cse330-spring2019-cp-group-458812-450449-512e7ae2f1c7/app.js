const express = require('express');
const path = require('path');
const bodyParser=require('body-parser');
const mongoose = require('mongoose');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');
const config=require('./config/database');
const passport=require('passport');
const multer = require('multer');





mongoose.connect(config.database);
let db= mongoose.connection;
//check for db erros
db.once('open',function(){
    console.log('Connected to Mongodb');
})
db.on('error',function(err){
    console.log(err);
});

const app = express();

//bring in models 
let Post = require('./models/post');


app.set('views',path.join(__dirname,'views'));
app.set('view engine','pug');

//body parse
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

//set public folder
app.use(express.static(path.join(__dirname,'public')));

// Express Session Middleware
app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true
  }));
  
  // Express Messages Middleware
  app.use(require('connect-flash')());
  app.use(function (req, res, next) {
    res.locals.messages = require('express-messages')(req, res);
    next();
  });

  // Express Validator Middleware
app.use(expressValidator({
    errorFormatter: function(param, msg, value) {
        var namespace = param.split('.')
        , root    = namespace.shift()
        , formParam = root;
  
      while(namespace.length) {
        formParam += '[' + namespace.shift() + ']';
      }
      return {
        param : formParam,
        msg   : msg,
        value : value
      };
    }
  }));

  //passport config
  require('./config/passport')(passport);

 // Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

//flash
app.use(flash());

//upoad

// Set The Storage Engine
const storage = multer.diskStorage({
    destination: './public/uploads/',
    filename: function(req, file, cb){
      cb(null,file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
  });
// Init Upload
const upload = multer({
    storage: storage,
  
    fileFilter: function(req, file, cb){
      checkFileType(file, cb);
    }
  }).single('myImage');
// Check File Type
function checkFileType(file, cb){
    // Allowed ext
    const filetypes = /jpeg|jpg|png|gif/;
    // Check ext
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    // Check mime
    const mimetype = filetypes.test(file.mimetype);
  
    if(mimetype && extname){
      return cb(null,true);
    } else {
      cb('Error: Images Only!');
    }
  }



  app.get('/upload',function(req,res){
        res.render('upload')
  });
  app.get('/upload/:id',function(req,res){
    res.render('upload',{
        postid:req.params.id
    });
});

  app.post('/upload', (req, res) => {
  upload(req, res, (err) => {
    if(err){
       
      res.render('upload', {
        msg: err
      });
    } else {
        
      if(req.file == undefined){
      
        res.render('upload', {
          msg: 'Error: No File Selected!'
        });
      } else {
        
        res.render('add_post', {
          msg: 'File Uploaded!',
          file: `uploads/${req.file.filename}`
        });
      }
    }
  });
});


app.post('/upload/:id', (req, res) => {
    upload(req, res, (err) => {
      if(err){
          console.log("1"+err)
        res.render('upload', {
          msg: err
        });
      } else {
          
        if(req.file == undefined){
          console.log(2)
          res.render('upload', {
            msg: 'Error: No File Selected!'
          });
        } else {
          console.log(req.params.id);
          let query={_id:req.params.id}
          Post.findById(req.params.id,function(err,post){
                post.photo = "uploads/"+req.file.filename
                Post.update(query,post,function(err){
                    if(err){
                        console.log(err);
                        return;
                    }else{
                        res.redirect('/posts/edit/'+req.params.id);
                    }
                })
          });
          
        }
      }
    });
  });


//global user var
app.get('*',function(req,res,next){
    res.locals.user =req.user || null;
    next();

});


  app.get('/',function(req,res){
    Post.find({},function(err,posts){
        console.log(posts);
        if(err){
            console.log(err);
        }
        else{
            res.render('index',{
                title:"Posts",
                posts: posts,
                
            });
        }
        
    });
    
});

  
//route files
let posts = require('./routes/posts');
let users = require('./routes/users');
let comments = require('./routes/comments');
app.use('/posts',posts);
app.use('/users',users);
app.use('/comments',comments);


app.listen(3456,function(){
    console.log('Server started on port 3456....')
})
