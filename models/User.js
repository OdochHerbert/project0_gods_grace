const mongoose=require('mongoose')
const Populate = require('../util/autopopulate');

 const UserSchema = new mongoose.Schema({
     name:{
         type:String,
         required:true
     },
     email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    date:{
        type: Date,
        default: Date.now
    },
    img:{
        type: String

    },
    noimg:{
        type: String
    },
  posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Posts' }],
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
  subreddits:[{type:String}],
  notifications:[{type:String}],
  notIds:[{type: mongoose.Schema.Types.ObjectId, ref: 'Posts'}]
 
}, { timestamps: true });



 const User=module.exports=mongoose.model('User', UserSchema)