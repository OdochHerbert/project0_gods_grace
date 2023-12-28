const express=require('express')
const router=express.Router()
const bcrypt=require('bcryptjs')
const passport=require('passport')



//Configuration for Multer
const multer=require('multer')

const multerStorage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "public/images");
    },
    filename: (req, file, cb) => {
      const ext = file.mimetype.split("/")[1];
      cb(null, `${file.fieldname}-${Date.now()}.${ext}`);
    },
  });
  // Multer Filter
const multerFilter = (req, file, cb) => {
    if (file.mimetype.split("/")[1] === ("png") ||("jpg")||("jpeg")) {
      cb(null, true);
    } else {
      cb(new Error("Not an Image File!!"), false);
    }
  };

  //Calling the "multer" Function
const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter,
  });




//User Modell
const User =require('../models/User')
const Posts =require('../models/post')
// Example route in your Express app
router.post('/add-product', (req, res) => {
  // Your logic to add the product goes here
  res.send('Product added successfully');
});

//LOGIN
router.get('/login',(req,res)=> res.render('login',{user:req.user}))
///REGISTER
router.get('/register',(req,res)=> res.render('register',{user:req.user}))

//REGISTER HANDLE
router.post('/register',(req,res)=>{
   const {name,email,password,password1}=req.body;
   
///VALIDATION
//1. Creating error array to hold the validatioon messages
const errors=[]
//checking required fields
if(!name || !email || !password || !password1){
    errors.push({msg: "Please Fill in All Fields"})
}
//checking passwords
if(password !== password1){
    errors.push({msg:"Passwords do not match"})
}
//check password length
if(password.length<6){
    errors.push({msg:"passwords should be atleast 6 characters"})
}
if(errors.length>0){
    //with this rendering if failde to meet riteria, fields will remain the same due values set in ejs
    //to send message to them we created partials/messages
    res.render('register',{
        errors,
        name,
        email,
        password,
        password1
    })
} else{
    //Validation passed Now what
    //1. Checking if user already exists
      //Remenber that mongoose methods always return promises, so use .then .catch
    User.findOne({email:email})
    .then(user=>{
        if(user){
            //user exists
            errors.push({msg:"Email already exists"})
            res.render('register',{
                errors,
                name,
                email,
                password,
                password1
            }
            )
        }else{
            const newUser=new User({
                name,
                email,
                password }
            )
            //HASH PASSWORD
            bcrypt.genSalt(10,(err,salt)=>
              bcrypt.hash(newUser.password,salt,(err,hash)=>{
                if(err) throw err;
                //set password to hashed
                newUser.password=hash
                //save User
                newUser.save()
                .then(user=>{
                    req.flash('success_msg','You are now registered and can now login')
                    res.redirect('/users/login')
                })
                .catch(err=>console.log(err))

            }))
        }
        
    })
}

})

//Login Handle
router.post('/login',(req,res,next)=>{
    passport.authenticate('local',{
     successRedirect:'/dashboard',
     failureRedirect:'/users/login',
     failureFlash:true   
    })(req,res,next)
})

//LOGOUT HANDLE
router.get('/logout', (req,res)=>{
    req.logout();
    req.flash('success_msg','You are logged out')
    res.redirect('/users/login')
})

//
router.post('/pic',upload.single('image'),(req,res)=>{
    const userid=req.user._id
    const image=req.file.filename
    User.findById(userid)
    .then((user)=>{
    user.img=image
    //use path to delete the previous
    user.save(
        ()=>{
            res.redirect('/dashboard')
        })
    }).catch(err=>console.log(err))
})

//YOUR POSTS
router.get('/posts/:id', (req, res) => {
    const { user } = req;
      const currentUser = req.user;
    //FIND ALL POSTS WITH SUBREDDIT AS IN REQ.PARAMS 
    Posts.find({ }).lean()
      .then((sub) => {res.render('myposts', { sub, user,name:req.user.name })
    console.log(sub)
    })
      .catch((err) => {
        console.log(err);
      });
  });
  //SINGLE USER DEPARTMENTS
router.get('/:subreddit/:userid', (req, res) => {
  const { user } = req;
    const currentUser = req.user;
  //FIND ALL POSTS WITH SUBREDDIT AS IN REQ.PARAMS 
  Posts.find({ author: req.params.userid ,subreddit: req.params.subreddit }).lean()
    .then((sub) => {res.render('topic-single', { sub, user,name:req.user.name, subreddit:req.params.subreddit })
  console.log(sub)
  })
    .catch((err) => {
      console.log(err);
    });
});
module.exports=router