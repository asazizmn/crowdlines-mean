/* 
 *  Comments.js - crowdlines
 *  'Comment' schema definition
 *  
 *  Aziz | 31 Aug 2015
 */


// define new comment schema
// and add it to the global mongoose object
require( 'mongoose' ).model
( 
    'Comment', 
    new mongoose.Schema
    ({
        body: String,
        author: String,
        upvotes: { type: Number, default: 0 },
        post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' }
    }) 
);


