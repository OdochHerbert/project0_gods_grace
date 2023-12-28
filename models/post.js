const mongoose=require('mongoose')
const Populate = require('../util/autopopulate');
 const postSchema = new mongoose.Schema({
    name: {type: String},
    //product_type: { type: mongoose.Schema.Types.ObjectId, ref: 'Comment' },
    product_type:{type: String},
    agent: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    quantity: {type: Number},
date:{
    type: Date,
    default: Date.now
}
 })

 // Always populate the author field
postSchema
.pre('findOne', Populate('author'))
.pre('find', Populate('author'));

 const Posts=module.exports=mongoose.model('Posts', postSchema)