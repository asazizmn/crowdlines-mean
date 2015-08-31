/* 
 *  Posts.js - crowdlines
 *  contains the schema for a 'Post'
 *  
 *  Aziz | 31 Aug 2015
 */

var mongoose = require( 'mongoose' );

// definition of the 'Post' schema
var PostSchema = new mongoose.Schema
({
    title: String,
    link: String,
    
    // will be initialised to '0'
    upvotes: { type: Number, default: 0 },
        
    // basically an array of 'Comment' references
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }]
});

mongoose.model( 'Post', PostSchema );
