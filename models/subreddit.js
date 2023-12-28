const mongoose=require('mongoose')
 const subredditSchema = new mongoose.Schema({
     
    content:{
        type:String,
        required:true
    }
 })

 const Subreddit=module.exports=mongoose.model('Subreddit', subredditSchema)