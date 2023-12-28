const { Schema, model } = require('mongoose');
const Populate = require('../util/autopopulate');

const commentSchema = new Schema({
  name: { type: String},
  unit: { type:String},
  price:{type:Number, required: true},
  description: { type: String },
  
}, { timestamps: true });

// Always populate the author field
commentSchema
  .pre('findOne', Populate('agent'))
  .pre('find', Populate('agent'))
  .pre('findOne', Populate('unit'))
  .pre('find', Populate('unit'));

module.exports = model('Comment', commentSchema);