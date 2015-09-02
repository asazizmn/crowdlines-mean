/* 
 *  Comments.js - crowdlines
 *  'Comment' schema definition
 *  
 *  Aziz | 31 Aug 2015
 */


// import global 'mongoose' object
var mongoose = require( 'mongoose' );

// define new comment schema
// and add it to the global mongoose object
mongoose.model( 'Comment', new mongoose.Schema
({
    body: String,
    author: String,
    upvotes: { type: Number, default: 0 },

    // please note that we are makeing a reference back to the 'Post' objecyt form here
    post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' }
}));


