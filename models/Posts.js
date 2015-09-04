/* 
 *  Posts.js - crowdlines
 *  contains the schema for a 'Post'
 *  
 *  Aziz | 31 Aug 2015
 */


// import global 'mongoose' object
var mongoose = require( 'mongoose' );

// definition of the 'Post' schema
var PostSchema = new mongoose.Schema
({
    title: String,
    link: String,
    
    // will be initialised to '0'
    upvotes: { type: Number, default: 0 },
        
    // basically an array of 'Comment' references
    // this will allow us to use the built-in mongoose 'populate()' method to 
    // easily retrieve all comments associated with a post
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }]
});


// simple method to add one to the upvote count and then save it
// please refer to http://mongoosejs.com/docs/guide.html for more details
PostSchema.methods.upvote = function( callback )
{
    this.upvotes += 1;
    this.save( callback );
};


mongoose.model( 'Post', PostSchema );
