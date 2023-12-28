const express=require('express')
const router=express.Router()
const {ensureAuthenticated}=require('../config/auth')
const flash=require('connect-flash')
const session=require('express-session')
const bcrypt=require('bcryptjs')
const passport=require('passport')
//Post Model
const Posts=require('../models/post')
const User=require('../models/User')
const Subreddit=require('../models/subreddit')
const Comment=require('../models/comment')
//WELCOME PAGE
router.get('/',(req,res)=> res.render('welcome',{user:req.user}))
/*
router.post('/add-product', (req, res) => {
  const userId = req.user._id;
  console.log(req.user)
      const post = new Posts();
      let d = new Date()
      post.name=req.body.name
      post.product_type=req.body.type
      post.quantity=req.body.qty
      post.agent = userId;
      post.date= d.getDate()
      post.save()
      console.log(post)
  res.send('Product added successfully');
});
 */
//Dashboard
router.get('/dashboard',ensureAuthenticated,(req,res)=>{
    const { user } = req;
    const currentUser = req.user;
    let sub
  
    Posts.find({}).lean().populate('agent')
    .then((s) => {
     sub=s
     return Subreddit.find({}).lean()
    })
    .then((posts) => {res.render('dashboard', {posts,name:req.user.name,user, sub })
  })
    .catch((err) => {
      console.log(err.message);
    })
  })

  //Dashboard-get all posts
router.get('/dashboard/all-posts',ensureAuthenticated,(req,res)=>{
    const { user } = req;
    const currentUser = req.user;
    let sub
  
    Posts.find({}).lean().populate('author')
    .then((s) => {
     sub=s
     return Subreddit.find({}).lean()
    })
    .then((posts) => {res.render('all-posts', {posts,name:req.user.name,user, sub })
  })
    .catch((err) => {
      console.log(err.message);
    })
  })


//ADD NEW POST
// CREATE
router.post('/posts/new', (req, res) => {
  
    if (req.user) {
      const userId = req.user._id;
      const post = new Posts();
      post.title=req.body.title
      post.url=req.body.url
      post.body=req.body.body
      post.author = userId;
      post.subreddit=req.body.subreddit
     
post.upVotes = [];
post.downVotes = [];
post.voteScore = 0;
      
  
      post
        .save()
        .then(() => User.findById(userId))
        .then((user) => {
          user.posts.unshift(post);
          user.save();
          // REDIRECT TO THE NEW POST
          return res.redirect(`/dashboard`);
        }).then(()=>{
          const subreddit=new Subreddit()
          subreddit.content=req.body.subreddit
          subreddit.save()
        })
        .catch((err) => {
          console.log(err.message);
        });
    } else {
      return res.status(401); // UNAUTHORIZED
    }
  });

  //DEPARTMENTS
router.get('/:subreddit',ensureAuthenticated, (req, res) => {
  const { user } = req;
    const currentUser = req.user;
  //FIND ALL POSTS WITH SUBREDDIT AS IN REQ.PARAMS 
  Posts.find({ subreddit: req.params.subreddit }).lean()
    .then((sub) => {res.render('topic', { sub, user,name:req.user.name, subreddit:req.params.subreddit })
  console.log(sub)
  })
    .catch((err) => {
      console.log(err);
    });
});



//POST DETAIL
router.get('/posts/:postId/detail',ensureAuthenticated,(req,res)=>{
  const { user } = req;
    const currentUser = req.user;
    let  sub

  Posts.findById(req.params.postId).populate('comments').populate('usersVoted').lean()
  .then((p) => {
    sub = p;
    return Posts.find({}).lean().populate('comments');
  })
  .then((all)=>{
    res.render('post-detail',{all,sub,user,userid:req.user._id, name:req.user.name})
    
  })
})

//COMMENTING ON A POST
// CREATE Comment
router.post('/posts/:postId/comments', (req, res) => {
  const comment = new Comment(req.body);
  var d= new Date()
  comment.author = req.user._id;
  comment.random=d.getMilliseconds()
  comment.random1=d.getTime()

  comment
    .save()
    .then(() => Promise.all([
      Posts.findById(req.params.postId),
    ]))
    .then(([post]) => {
      post.comments.unshift(comment);
      return Promise.all([
        post.save(),
      ]);
    }).
    then(() => res.redirect(`/posts/${req.params.postId}/detail`))
    .catch((err) => {
      console.log(err);
    });
});


//Double link for commenting
router.post('/posts/:postId/notify',(req,res)=>{
  const currentUser = req.user;
  const post=req.params.postId
  
  User.find({},(err,user)=>{

  user.forEach(function(object){
    if(object.posts.includes(post)==true){
      object.notifications.push(currentUser.name+" has commented on your post" )
      object.notIds.push(req.params.postId)
      object.save()
    }
    else if(object.comments.includes(post)==true){
      object.notifications.push(currentUser.name+" has replied your comment" )
      object.notIds.push(req.params.postId)
      object.save()
    }
    
  })
   
  })
  
})


//Double link for commenting
router.post('/posts/viewed/:userid/:notIds',(req,res)=>{
  const currentUser = req.user;
  const post=req.params.postId
  var d= new Date()
  User.findById(req.params.userid,(err,user)=>{
  
      user.notifications.splice((req.params.notIds),1)
      user.notIds.splice((req.params.notIds),1)
      console.log(user.notifications)
      console.log(user.notIds)
      user.save()
    
    

   
  })
  
})

//Double link for commenting
router.post('/posts/save/:commentId/:authorId',(req,res)=>{
  const currentUser = req.user;
  const post=req.params.postId
  var d= new Date()
  User.findById(req.params.authorId,(err,user)=>{
  
      Comment.findById(req.params.commentId,(err,comment)=>{
        user.comments.push(comment)
      
        return user.save()
    
      })
    
   
  })
  
})
  

//REPLY SECTION

// NEW REPLY
router.get('/posts/:postId/comments/:commentId/replies/new', (req, res) => {
  
  const {user}=req.user
  let post;
  Posts.findById(req.params.postId).lean()
    .then((p) => {
      post = p;
      return Comment.findById(req.params.commentId).lean();
    })
    .then((comment) => {
      res.render('replies-new', { post, comment, user,name:req.user.name});
    })
    .catch((err) => {
      console.log(err.message);
    });
});

// CREATE REPLY
router.post('/posts/:postId/comments/:commentId/replies', (req, res) => {
  // TURN REPLY INTO A COMMENT OBJECT
  const reply = new Comment(req.body);
  reply.content = req.body.content
  reply.author = req.user._id;
  var d=new Date()
  reply.random=d.getMilliseconds()
  reply.random1=d.getTime()
  // LOOKUP THE PARENT POST
  Posts.findById(req.params.postId)
    .then((post) => {
      // FIND THE CHILD COMMENT
      Promise.all([
        reply.save(),
        Comment.findById(req.params.commentId),
      ])
        .then(([reply, comment]) => {
          // ADD THE REPLY
          comment.comments.unshift(reply._id);
          return Promise.all([
            comment.save(),
          ]);
        })
        .then(() => res.end(reply.content))
        .catch(console.error);
      // SAVE THE CHANGE TO THE PARENT DOCUMENT
      return post.save();
    });
});
  
//Create aan api where if we click we ignore all replies from all comments
//??ignoring replies(comments)??
//the create an api for when we click a comment we find the commentid then load it with all its replies while ignoring the one for others
//Or we can talk about hiding contents of an array

router.get('/posts/:postId/comments/:commentId',(req,res)=>{
  const {user}=req
  let comment;
  let p
  Posts.findById(req.params.postId).lean()
    .then((comment) => {
      sub = p;
      return Comment.findById(req.params.commentId,'content author').lean();
    })
    .then((sub) => {
      res.render('post-detail-1', { sub, comment, user,name:req.user.name});
    })
    .catch((err) => {
      console.log(err.message);
    });
    

    
})

//VOTING SYSTEM
router.post('/posts/:id/vote', (req, res) => {
  //console.log(req.params.id)
  Posts.findById(req.params.id).then((post) => {
    console.log(post)
    if(post.usersVoted.includes(req.user._id) == true){
    var index=post.usersVoted.indexOf(req.user._id)
    //console.log(index+'threeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeew'+req.body.vote)

   post.voteScores.splice((index),1,req.body.vote)
   let count=0
   let total=0
   post.voteScores.forEach(function(votes){
     count=count+1
     total=total+votes
   })
   post.rank=(total/(count*5))*100
    post.save();
    res.redirect('/posts/'+req.params.id+"/detail")}
  
    else{
      post.usersVoted.push(req.user._id)
      post.voteScores.push(req.body.vote)
      let count=0
   let total=0
   post.voteScores.forEach(function(votes){
     count=count+1
     total=total+votes
   })
   post.rank=(total/(count*5))*100
      post.save()
      res.redirect('/posts/'+req.params.id+"/detail")
    }
  }).catch(err=>console.log(err));
});

//Dashboard
router.get('/user/notifications',ensureAuthenticated,(req,res)=>{
  const { user } = req;
  const currentUser = req.user;
  let sub

  Posts.find({}).lean().populate('author')
  .then((s) => {
   sub=s
   return User.findById(currentUser._id).lean()
  })
  .then((posts) => {
    res.render('notifications', {posts,name:req.user.name,user, sub })
})
  .catch((err) => {
    console.log(err.message);
  })
})
router.get('/site/underprogress',(req,res)=>{
  console.log('called')
  res.render('underprogress')
})



module.exports=router