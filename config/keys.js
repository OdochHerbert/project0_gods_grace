/* Mongoose Connection */
const mongoose = require('mongoose');
assert = require('assert');

//const url = 'mongodb://localhost/passportdb';
const url = 'mongodb://localhost/passportdb'
//const url= 'mongodb+srv://Hyper:Readefmiller8.@cluster0.etm3zns.mongodb.net/?retryWrites=true&w=majority'
mongoose.connect(
  url,
  {
    useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false,
  },
  (err) => {
    assert.equal(null, err);
    console.log("Connected successfully to database");

    //db.close(); turn on for testing
  }
);
mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection Error:'));
mongoose.set('debug', false);

module.exports = mongoose.connection;