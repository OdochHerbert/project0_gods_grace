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



//ADDING PRODUCTS
router.post('/add-product', (req, res) => {
    const userId = req.user._id;
    console.log(req.user);
  
    const post = new Posts();
    let d = new Date();
    post.name = req.body.name;
    post.product_type = req.body.type;
    post.quantity = req.body.qty;
    post.agent = userId;
    post.date = d.getDate();
  
    post.save()
      .then(() => {
        console.log(post);
        res.redirect('/dashboard');
      })
      .catch((error) => {
        console.error(error);
        res.status(500).send('Internal Server Error');
      });
  });

//Add Inventory form
router.get('/add-product-view', (req,res)=>{
  res.render('add_product')
})

//Display the Inventory Data
router.get('/inventory-data', (req,res)=>{
  const { user } = req;
    const currentUser = req.user;
    Posts.find({}).lean().populate('agent')
    .then((posts) => {res.render('inventory', {posts,name:req.user.name,user })
  })
    .catch((err) => {
      console.log(err.message);
    })
  })

  //Search inventory
  router.post('/search-inventory', async (req, res) => {
    const productName = req.body.productName;
    console.log('PRODUCNAME: '+ productName)
  
    try {
      // Check if productName is provided
      if (!productName) {
        return res.status(400).send('Product name is required');
      }
  
      // Search for products based on the product name
      const posts = await Posts.find( {$or : [
        { name : new RegExp(productName, 'i') },
        //{ _id: productName }, // Add more fields as needed
      ],});
  
      res.render('inventory', { posts });
      console.log(posts)
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  });
 




module.exports=router