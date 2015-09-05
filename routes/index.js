var express = require('express');
var router = express.Router();

// using the global mongoose object
// retrieve the registered models 'Post' and 'Comment'
var mongoose = require( 'mongoose' );
var Post = mongoose.model( 'Post' ); 
var Comment = mongoose.model( 'Comment' );


//
// General Routes
//

/* GET home page */
// this is what causes 'localhost:3000' to load index.html
router.get( '/', function( req, res, next )
{
    res.render
    (
        'index', 
        { 
            title: 'Express' 
        }
    );
});



//
// Post Routes
//

/* GET a JSON list of posts */
// using the express 'get' method,
// define the route URL and function to handle request
router.get( '/posts', function( req, res, next )
{
    // query db for all the posts
    Post.find( function( err, posts )
    {
        // in case of an error
        // pass the error to an error handling function
        if ( err )
        {
            return next( err );
        }

        // otherwise send the retrieved posts back to the client
        res.json( posts );
    });
});


/*  POST (i.e. create) a new post object */
// please note that this router.post is to do with POST request, not crowdlines 'post'
// so basically when POST has request URL '/posts', create a new object and save to db
router.post( '/posts', function( req, res, next )
{
    // creating new post object in memory
    // and then saving it to the db
    new Post( req.body ).save( function( err, post )
    {
        if ( err )
        {
            return next( err );
        }

        // please note that although it is not completely necessary to 
        // return a JSON representation of the model back to the client
        // it is usually a good practice and can help to show success
        res.json( post );
    });
});

// instead of replicating code within various request handlers that need to 
// load a post object, Express's param() method has been utilised
// now everytime a route URL containing :post is defined, express will run this first
// this basically retrieves the post object from the db and attaches it to 'req'
router.param( 'post', function( req, res, next, id )
{
    // mongoose's query interface (http://mongoosejs.com/docs/queries.html)
    Post.findById( id ).exec( function( err, post )
    {
        if ( err )
        {
            return next( err );
        }
      
        if ( !post )
        {
            return next( new Error( 'can\'t find post' ));
        }
      
        req.post = post;
        return next();
    });
});


/* GET a single post object, given the ID */
// please note that :post is the ID, that will be passed to the above method and
// have the resulting post object attached to 'req'
router.get( '/posts/:post', function( req, res )
{
    res.json( req.post );
});


/* Update the post upvote count, using HTTP PUT */
// please note how this route will firstly use the above param method
// to pre-load the appropriate post given the id
router.put( '/posts/:post/upvote', function( req, res, next )
{
    req.post.upvote( function( err, post )
    {
        if ( err )
        {
            return next( err );
        };
        
        res.json( post );
    });
});



//
// Comment Routes
//

/* POST a new comment for a particular post */
router.post( '/posts/:post/comments', function( req, res, next ) 
{
    // creating new post object in memory
    var comment = new Comment( req.body ); 
    
    // and linking parent post to it
    comment.post = req.post;
     
    // and then saving it to the db
    comment.save( function( err, comment )
    {
        if ( err )
        {
            return next( err );
        }

        // adding actual comment to the parent's list of comments
        req.post.comments.push( comment );
        
        // and saving the post as well
        req.post.save( function( err, post )
        {
            if ( err )
            {
                return next( err );
            }
            
            // returning the actual comment as part of the response
            res.json( comment );
        });
        
    });
});


/* Express's param method to help pre-load the appropriate comment */
router.param( 'comment', function( req, res, next, id )
{
    // mongoose's query interface (http://mongoosejs.com/docs/queries.html)
    Post.findById( id ).exec( function( err, comment )
    {
        if ( err )
        {
            return next( err );
        }
      
        if ( !comment )
        {
            return next( new Error( 'can\'t find comment' ));
        }
      
        req.comment = comment;
        return next();
    });
});


/* Update the comment upvote count, using HTTP PUT */
// please note how this route will firstly use the above param methods
// to pre-load the appropriate post and comment given the ids
router.put( '/posts/:post/comments/:comment/upvote', function( req, res, next )
{
    req.comment.upvote( function( err, comment )
    {
        if ( err )
        {
            return next( err );
        };
        
        res.json( comment );
    });
});


module.exports = router;